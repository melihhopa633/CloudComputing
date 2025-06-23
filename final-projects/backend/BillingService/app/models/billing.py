from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class MetricData(BaseModel):
    user_email: str
    user_fullname: str
    container_id: str
    container_name: str
    memory_mb: float
    cpu_usage: float
    created_at: datetime

class BillingLineItem(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float

class BillingPeriod(BaseModel):
    start_date: datetime
    end_date: datetime
    user_email: str
    user_fullname: str

class BillingSummary(BaseModel):
    user_email: str
    user_fullname: str
    billing_period: BillingPeriod
    line_items: List[BillingLineItem]
    subtotal: float
    tax_rate: float = 0.18  # %18 KDV
    tax_amount: float
    total_amount: float
    currency: str = "USD"
    
class Invoice(BaseModel):
    invoice_id: str
    invoice_date: datetime
    due_date: datetime
    billing_summary: BillingSummary
    
class BillingRequest(BaseModel):
    user_email: str
    start_date: datetime
    end_date: datetime
    
class InvoiceResponse(BaseModel):
    invoice_id: str
    user_email: str
    period: str
    total_amount: float
    currency: str
    pdf_url: str
    created_at: datetime 