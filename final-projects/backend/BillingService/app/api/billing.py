from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import FileResponse
from datetime import datetime, timedelta
from typing import List, Optional
import os
import httpx
from app.models.billing import BillingRequest, InvoiceResponse, BillingSummary
from app.services.database import db_service
from app.services.billing_calculator import billing_calculator
from app.services.pdf_generator import pdf_generator
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/billing", tags=["billing"])

@router.get("/users")
async def get_users():
    """Tüm kullanıcıları IdentityService'den listele"""
    try:
        # IdentityService'den kullanıcıları çek
        async with httpx.AsyncClient() as client:
            response = await client.get("http://identityservice:8080/api/users")
            if response.status_code == 200:
                identity_users = response.json()
                # IdentityService'den gelen format: {"success": true, "data": [...]}
                if isinstance(identity_users, dict) and "data" in identity_users:
                    users = []
                    for user in identity_users["data"]:
                        users.append({
                            "user_email": user.get("email", ""),
                            "user_fullname": f"{user.get('username', '')}",
                            "id": user.get("id", ""),
                        })
                    return {"success": True, "data": users}
                else:
                    # Fallback: metrics tablosundan çek
                    logger.warning("IdentityService response format unexpected, falling back to metrics")
                    users = db_service.get_all_users()
                    return {"success": True, "data": users}
            else:
                # Fallback: metrics tablosundan çek
                logger.warning(f"IdentityService returned {response.status_code}, falling back to metrics")
                users = db_service.get_all_users()
                return {"success": True, "data": users}
    except Exception as e:
        logger.error(f"Error fetching users from IdentityService: {e}")
        # Fallback: metrics tablosundan çek
        try:
            users = db_service.get_all_users()
            return {"success": True, "data": users}
        except Exception as db_error:
            logger.error(f"Error fetching users from database: {db_error}")
            raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate")
async def calculate_billing(request: BillingRequest):
    """Belirtilen dönem için faturalama hesapla"""
    try:
        # Metrics'leri getir
        metrics = db_service.get_metrics_by_user_and_period(
            user_email=request.user_email,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        if not metrics:
            return {
                "success": True,
                "message": "No metrics found for the specified period",
                "data": {
                    "user_email": request.user_email,
                    "period": f"{request.start_date.date()} to {request.end_date.date()}",
                    "total_amount": 0.0,
                    "metrics_count": 0
                }
            }
        
        # Kullanıcı adını metrics'ten al
        user_fullname = metrics[0].user_fullname if metrics else "Unknown User"
        
        # Faturalama hesapla
        billing_summary = billing_calculator.create_billing_summary(
            user_email=request.user_email,
            user_fullname=user_fullname,
            start_date=request.start_date,
            end_date=request.end_date,
            metrics=metrics
        )
        
        return {
            "success": True,
            "data": {
                "billing_summary": billing_summary,
                "metrics_count": len(metrics),
                "period": billing_calculator.format_period_string(request.start_date, request.end_date)
            }
        }
        
    except Exception as e:
        logger.error(f"Error calculating billing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-invoice")
async def generate_invoice(request: BillingRequest):
    """Fatura oluştur ve PDF üret"""
    try:
        # Metrics'leri getir
        metrics = db_service.get_metrics_by_user_and_period(
            user_email=request.user_email,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        # Kullanıcı adını metrics'ten al
        user_fullname = metrics[0].user_fullname if metrics else "Unknown User"
        
        # Faturalama hesapla
        billing_summary = billing_calculator.create_billing_summary(
            user_email=request.user_email,
            user_fullname=user_fullname,
            start_date=request.start_date,
            end_date=request.end_date,
            metrics=metrics
        )
        
        # Invoice oluştur
        invoice = pdf_generator.create_invoice_from_summary(billing_summary)
        
        # PDF oluştur
        pdf_path = pdf_generator.generate_invoice_pdf(invoice)
        pdf_url = pdf_generator.get_pdf_url(pdf_path)
        
        # Veritabanına kaydet
        invoice_data = {
            'invoice_id': invoice.invoice_id,
            'user_email': billing_summary.user_email,
            'user_fullname': billing_summary.user_fullname,
            'start_date': billing_summary.billing_period.start_date,
            'end_date': billing_summary.billing_period.end_date,
            'subtotal': billing_summary.subtotal,
            'tax_amount': billing_summary.tax_amount,
            'total_amount': billing_summary.total_amount,
            'currency': billing_summary.currency,
            'pdf_path': pdf_path
        }
        
        saved_invoice_id = db_service.save_invoice(invoice_data)
        
        response = InvoiceResponse(
            invoice_id=invoice.invoice_id,
            user_email=billing_summary.user_email,
            period=billing_calculator.format_period_string(request.start_date, request.end_date),
            total_amount=billing_summary.total_amount,
            currency=billing_summary.currency,
            pdf_url=pdf_url,
            created_at=invoice.invoice_date
        )
        
        return {
            "success": True,
            "message": "Invoice generated successfully",
            "data": response
        }
        
    except Exception as e:
        logger.error(f"Error generating invoice: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/monthly-invoice/{user_email}")
async def generate_monthly_invoice(
    user_email: str,
    year: int = Query(..., description="Year (e.g., 2024)"),
    month: int = Query(..., description="Month (1-12)")
):
    """Belirtilen ay için fatura oluştur"""
    try:
        # Ay başı ve sonu hesapla
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1) - timedelta(seconds=1)
        else:
            end_date = datetime(year, month + 1, 1) - timedelta(seconds=1)
        
        request = BillingRequest(
            user_email=user_email,
            start_date=start_date,
            end_date=end_date
        )
        
        return await generate_invoice(request)
        
    except Exception as e:
        logger.error(f"Error generating monthly invoice: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_invoice(filename: str):
    """PDF faturayı indir"""
    try:
        pdf_path = os.path.join(pdf_generator.pdf_dir, filename)
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="Invoice not found")
        
        return FileResponse(
            path=pdf_path,
            filename=filename,
            media_type='application/pdf'
        )
        
    except Exception as e:
        logger.error(f"Error downloading invoice: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/usage-summary/{user_email}")
async def get_usage_summary(
    user_email: str,
    days: int = Query(30, description="Number of days to look back")
):
    """Kullanıcı kaynak kullanım özeti"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        metrics = db_service.get_metrics_by_user_and_period(
            user_email=user_email,
            start_date=start_date,
            end_date=end_date
        )
        
        if not metrics:
            return {
                "success": True,
                "data": {
                    "user_email": user_email,
                    "period_days": days,
                    "total_containers": 0,
                    "total_cpu_hours": 0.0,
                    "total_memory_mb_hours": 0.0,
                    "estimated_cost": 0.0
                }
            }
        
        usage = billing_calculator.calculate_resource_usage(metrics)
        
        # Tahmini maliyet
        estimated_cost = (
            usage['total_cpu_hours'] * billing_calculator.cpu_rate +
            usage['total_memory_mb_hours'] * billing_calculator.memory_rate
        ) * 1.18  # KDV dahil
        
        return {
            "success": True,
            "data": {
                "user_email": user_email,
                "period_days": days,
                "total_containers": usage['total_containers'],
                "total_cpu_hours": usage['total_cpu_hours'],
                "total_memory_mb_hours": usage['total_memory_mb_hours'],
                "estimated_cost": round(estimated_cost, 2),
                "metrics_count": len(metrics)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting usage summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Database connection test
        users = db_service.get_all_users()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "database": "connected",
            "users_count": len(users)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        } 