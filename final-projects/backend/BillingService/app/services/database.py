import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import List, Dict, Any
from app.config import settings
from app.models.billing import MetricData
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        self.connection_params = {
            'host': settings.postgres_host,
            'port': settings.postgres_port,
            'database': settings.postgres_db,
            'user': settings.postgres_user,
            'password': settings.postgres_password
        }
    
    def get_connection(self):
        """PostgreSQL bağlantısı oluştur"""
        try:
            conn = psycopg2.connect(**self.connection_params)
            return conn
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise
    
    def get_metrics_by_user_and_period(
        self, 
        user_email: str, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[MetricData]:
        """Kullanıcı ve tarih aralığına göre metrics getir"""
        query = """
        SELECT 
            user_email,
            user_fullname,
            container_id,
            container_name,
            memory_mb,
            cpu_usage,
            created_at
        FROM metrics 
        WHERE user_email = %s 
        AND created_at >= %s 
        AND created_at <= %s
        ORDER BY created_at ASC
        """
        
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute(query, (user_email, start_date, end_date))
                    rows = cursor.fetchall()
                    
                    metrics = []
                    for row in rows:
                        metrics.append(MetricData(
                            user_email=row['user_email'],
                            user_fullname=row['user_fullname'] or 'Unknown User',
                            container_id=row['container_id'],
                            container_name=row['container_name'],
                            memory_mb=float(row['memory_mb']),
                            cpu_usage=float(row['cpu_usage']),
                            created_at=row['created_at']
                        ))
                    
                    return metrics
                    
        except Exception as e:
            logger.error(f"Error fetching metrics: {e}")
            raise
    
    def get_all_users(self) -> List[Dict[str, str]]:
        """Tüm kullanıcıları getir"""
        query = """
        SELECT DISTINCT user_email, user_fullname 
        FROM metrics 
        WHERE user_email IS NOT NULL
        ORDER BY user_email
        """
        
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    
                    return [
                        {
                            'user_email': row['user_email'],
                            'user_fullname': row['user_fullname'] or 'Unknown User'
                        }
                        for row in rows
                    ]
                    
        except Exception as e:
            logger.error(f"Error fetching users: {e}")
            raise
    
    def save_invoice(self, invoice_data: Dict[str, Any]) -> str:
        """Fatura bilgilerini veritabanına kaydet"""
        query = """
        INSERT INTO invoices (
            invoice_id,
            user_email,
            user_fullname,
            start_date,
            end_date,
            subtotal,
            tax_amount,
            total_amount,
            currency,
            pdf_path,
            created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING invoice_id
        """
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query, (
                        invoice_data['invoice_id'],
                        invoice_data['user_email'],
                        invoice_data['user_fullname'],
                        invoice_data['start_date'],
                        invoice_data['end_date'],
                        invoice_data['subtotal'],
                        invoice_data['tax_amount'],
                        invoice_data['total_amount'],
                        invoice_data['currency'],
                        invoice_data['pdf_path'],
                        datetime.now()
                    ))
                    conn.commit()
                    return invoice_data['invoice_id']
                    
        except Exception as e:
            logger.error(f"Error saving invoice: {e}")
            raise
    
    def create_invoices_table(self):
        """Invoices tablosunu oluştur"""
        query = """
        CREATE TABLE IF NOT EXISTS invoices (
            id SERIAL PRIMARY KEY,
            invoice_id VARCHAR(50) UNIQUE NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            user_fullname VARCHAR(255),
            start_date TIMESTAMP WITH TIME ZONE,
            end_date TIMESTAMP WITH TIME ZONE,
            subtotal DECIMAL(10,2),
            tax_amount DECIMAL(10,2),
            total_amount DECIMAL(10,2),
            currency VARCHAR(10),
            pdf_path VARCHAR(500),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_invoices_user_email ON invoices (user_email);
        CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices (created_at);
        """
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query)
                    conn.commit()
                    logger.info("Invoices table created successfully")
                    
        except Exception as e:
            logger.error(f"Error creating invoices table: {e}")
            raise

# Singleton instance
db_service = DatabaseService() 