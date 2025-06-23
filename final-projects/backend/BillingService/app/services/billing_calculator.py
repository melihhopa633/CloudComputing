from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from app.models.billing import MetricData, BillingSummary, BillingLineItem, BillingPeriod
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class BillingCalculator:
    def __init__(self):
        self.cpu_rate = settings.cpu_rate_per_hour
        self.memory_rate = settings.memory_rate_per_gb_hour
        self.tax_rate = 0.18  # %18 KDV
    
    def calculate_resource_usage(self, metrics: List[MetricData]) -> Dict[str, float]:
        """Toplam kaynak kullanımını hesapla"""
        if not metrics:
            return {
                'total_cpu_hours': 0.0,
                'total_memory_gb_hours': 0.0,
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
                    'memory_gb_hours': 0.0,
                    'samples': []
                }
            
            container_usage[container_id]['samples'].append(metric)
        
        total_cpu_hours = 0.0
        total_memory_gb_hours = 0.0
        
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
            avg_memory_gb = avg_memory_mb / 1024  # MB to GB
            
            # Container'ın toplam kullanımı
            container_cpu_hours = avg_cpu * duration_hours
            container_memory_gb_hours = avg_memory_gb * duration_hours
            
            total_cpu_hours += container_cpu_hours
            total_memory_gb_hours += container_memory_gb_hours
            
            usage_data['cpu_hours'] = container_cpu_hours
            usage_data['memory_gb_hours'] = container_memory_gb_hours
            usage_data['duration_hours'] = duration_hours
        
        return {
            'total_cpu_hours': round(total_cpu_hours, 4),
            'total_memory_gb_hours': round(total_memory_gb_hours, 4),
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
        """Faturalama özetini oluştur"""
        
        usage = self.calculate_resource_usage(metrics)
        
        # Line items oluştur
        line_items = []
        
        # CPU kullanımı
        if usage['total_cpu_hours'] > 0:
            cpu_cost = usage['total_cpu_hours'] * self.cpu_rate
            line_items.append(BillingLineItem(
                description=f"CPU Usage ({usage['total_containers']} containers)",
                quantity=round(usage['total_cpu_hours'], 2),
                unit_price=self.cpu_rate,
                total=round(cpu_cost, 2)
            ))
        
        # Memory kullanımı
        if usage['total_memory_gb_hours'] > 0:
            memory_cost = usage['total_memory_gb_hours'] * self.memory_rate
            line_items.append(BillingLineItem(
                description=f"Memory Usage ({usage['total_containers']} containers)",
                quantity=round(usage['total_memory_gb_hours'], 2),
                unit_price=self.memory_rate,
                total=round(memory_cost, 2)
            ))
        
        # Eğer hiç kullanım yoksa, minimum charge ekle
        if not line_items:
            line_items.append(BillingLineItem(
                description="Minimum Service Charge",
                quantity=1.0,
                unit_price=0.01,
                total=0.01
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