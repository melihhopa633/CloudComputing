from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from app.models.billing import MetricData, BillingSummary, BillingLineItem, BillingPeriod
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class BillingCalculator:
    def __init__(self):
        self.cpu_rate = settings.cpu_rate_per_hour
        self.memory_rate = settings.memory_rate_per_mb_hour
        self.base_charge = settings.base_service_charge
        self.tax_rate = 0.18  # %18 KDV
    
    def calculate_resource_usage(self, metrics: List[MetricData]) -> Dict[str, float]:
        """Toplam kaynak kullanımını hesapla"""
        if not metrics:
            return {
                'total_cpu_hours': 0.0,
                'total_memory_mb_hours': 0.0,
                'total_containers': 0
            }
        
        # Container bazında grupla
        container_usage = {}
        
        for metric in metrics:
            container_id = metric.container_id
            
            if container_id not in container_usage:
                container_usage[container_id] = {
                    'container_name': metric.container_name,
                    'cpu_hours': 0.0,
                    'memory_mb_hours': 0.0,
                    'samples': []
                }
            
            container_usage[container_id]['samples'].append(metric)
        
        total_cpu_hours = 0.0
        total_memory_mb_hours = 0.0
        
        # Her container için usage hesapla
        for container_id, usage_data in container_usage.items():
            samples = sorted(usage_data['samples'], key=lambda x: x.created_at)
            
            if len(samples) < 2:
                # Tek sample varsa, 1 saat varsayalım
                duration_hours = 1.0
            else:
                # İlk ve son sample arasındaki süreyi hesapla
                duration = samples[-1].created_at - samples[0].created_at
                duration_hours = max(duration.total_seconds() / 3600, 0.1)  # Min 0.1 saat
            
            # Ortalama kullanımı hesapla
            avg_cpu = sum(s.cpu_usage for s in samples) / len(samples)
            avg_memory_mb = sum(s.memory_mb for s in samples) / len(samples)
            
            # Container'ın toplam kullanımı
            container_cpu_hours = avg_cpu * duration_hours
            container_memory_mb_hours = avg_memory_mb * duration_hours
            
            total_cpu_hours += container_cpu_hours
            total_memory_mb_hours += container_memory_mb_hours
            
            usage_data['cpu_hours'] = container_cpu_hours
            usage_data['memory_mb_hours'] = container_memory_mb_hours
            usage_data['duration_hours'] = duration_hours
        
        return {
            'total_cpu_hours': round(total_cpu_hours, 4),
            'total_memory_mb_hours': round(total_memory_mb_hours, 4),
            'total_containers': len(container_usage),
            'container_details': container_usage
        }
    
    def create_billing_summary(
        self, 
        user_email: str, 
        user_fullname: str,
        start_date: datetime, 
        end_date: datetime,
        metrics: List[MetricData]
    ) -> BillingSummary:
        """Faturalama özetini oluştur - Her metric için ayrı"""
        
        line_items = []
        
        if not metrics:
            # Hiç metric yoksa minimum charge
            line_items.append(BillingLineItem(
                description="Minimum Service Charge (No Usage)",
                quantity=1.0,
                unit_price=self.base_charge,
                total=self.base_charge
            ))
        else:
            # Her metric için ayrı hesaplama
            container_counter = {}
            
            for i, metric in enumerate(metrics):
                # Container sayısını takip et
                if metric.container_id not in container_counter:
                    container_counter[metric.container_id] = len(container_counter) + 1
                
                container_num = container_counter[metric.container_id]
                
                # Bu metric için süre hesapla (varsayılan 1 saat)
                duration_hours = 1.0
                
                # CPU hesaplama - Minimum $0.50 per metric
                cpu_usage_hours = max((metric.cpu_usage / 100.0) * duration_hours, 0.2)  # Minimum 0.2 saat
                cpu_cost = max(cpu_usage_hours * self.cpu_rate, 0.50)  # Minimum $0.50
                
                line_items.append(BillingLineItem(
                    description=f"CPU #{i+1} - {metric.container_name[:15]}... ({metric.cpu_usage:.1f}%)",
                    quantity=round(cpu_usage_hours, 4),
                    unit_price=self.cpu_rate,
                    total=round(cpu_cost, 2)
                ))
                
                # Memory hesaplama - Minimum $1.00 per metric
                memory_mb_hours = max(metric.memory_mb * duration_hours, 800)  # Minimum 800 MB-hours
                memory_cost = max(memory_mb_hours * self.memory_rate, 1.00)  # Minimum $1.00
                
                line_items.append(BillingLineItem(
                    description=f"Memory #{i+1} - {metric.container_name[:15]}... ({metric.memory_mb:.1f}MB)",
                    quantity=round(memory_mb_hours, 2),
                    unit_price=self.memory_rate,
                    total=round(memory_cost, 2)
                ))
                
            # Unique container'lar için base charge ekle
            unique_containers = set()
            for metric in metrics:
                unique_containers.add(metric.container_id)
            
            # Her unique container için base charge
            for j, container_id in enumerate(unique_containers):
                # Bu container'a ait ilk metric'i bul
                container_metric = next(m for m in metrics if m.container_id == container_id)
                line_items.append(BillingLineItem(
                    description=f"Base Service - Container #{j+1} ({container_metric.container_name[:20]}...)",
                    quantity=1.0,
                    unit_price=self.base_charge,
                    total=self.base_charge
                ))
        
        # Toplamları hesapla
        subtotal = sum(item.total for item in line_items)
        tax_amount = subtotal * self.tax_rate
        total_amount = subtotal + tax_amount
        
        billing_period = BillingPeriod(
            start_date=start_date,
            end_date=end_date,
            user_email=user_email,
            user_fullname=user_fullname
        )
        
        return BillingSummary(
            user_email=user_email,
            user_fullname=user_fullname,
            billing_period=billing_period,
            line_items=line_items,
            subtotal=round(subtotal, 2),
            tax_rate=self.tax_rate,
            tax_amount=round(tax_amount, 2),
            total_amount=round(total_amount, 2)
        )
    
    def format_period_string(self, start_date: datetime, end_date: datetime) -> str:
        """Dönem string formatı"""
        if start_date.year == end_date.year and start_date.month == end_date.month:
            return start_date.strftime("%B %Y")
        else:
            return f"{start_date.strftime('%B %Y')} - {end_date.strftime('%B %Y')}"

# Singleton instance
billing_calculator = BillingCalculator() 