import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from app.models.billing import BillingSummary, Invoice
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class PDFGenerator:
    def __init__(self):
        self.pdf_dir = "generated_invoices"
        self.ensure_pdf_directory()
        
    def ensure_pdf_directory(self):
        """PDF klasörünü oluştur"""
        if not os.path.exists(self.pdf_dir):
            os.makedirs(self.pdf_dir)
    
    def generate_invoice_pdf(self, invoice: Invoice) -> str:
        """Fatura PDF'i oluştur"""
        filename = f"invoice_{invoice.invoice_id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        filepath = os.path.join(self.pdf_dir, filename)
        
        # PDF dokümanı oluştur
        doc = SimpleDocTemplate(
            filepath,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Story (PDF içeriği) oluştur
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#2c3e50')
        )
        
        header_style = ParagraphStyle(
            'CustomHeader',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors.HexColor('#34495e')
        )
        
        # Başlık
        story.append(Paragraph("INVOICE", title_style))
        story.append(Spacer(1, 20))
        
        # Şirket bilgileri ve fatura bilgileri
        company_invoice_data = [
            [
                Paragraph(f"<b>{settings.company_name}</b><br/>{settings.company_address}<br/>{settings.company_email}<br/>{settings.company_phone}", styles['Normal']),
                Paragraph(f"<b>Invoice #:</b> {invoice.invoice_id}<br/><b>Date:</b> {invoice.invoice_date.strftime('%B %d, %Y')}<br/><b>Due Date:</b> {invoice.due_date.strftime('%B %d, %Y')}", styles['Normal'])
            ]
        ]
        
        company_invoice_table = Table(company_invoice_data, colWidths=[3*inch, 3*inch])
        company_invoice_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(company_invoice_table)
        story.append(Spacer(1, 30))
        
        # Müşteri bilgileri
        story.append(Paragraph("Bill To:", header_style))
        customer_info = f"""
        <b>{invoice.billing_summary.user_fullname}</b><br/>
        {invoice.billing_summary.user_email}<br/>
        """
        story.append(Paragraph(customer_info, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Fatura dönemi
        period_text = f"<b>Billing Period:</b> {invoice.billing_summary.billing_period.start_date.strftime('%B %d, %Y')} - {invoice.billing_summary.billing_period.end_date.strftime('%B %d, %Y')}"
        story.append(Paragraph(period_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Fatura kalemleri tablosu
        story.append(Paragraph("Services", header_style))
        
        # Tablo başlıkları
        table_data = [
            ['Description', 'Quantity', 'Unit Price', 'Total']
        ]
        
        # Fatura kalemleri
        for item in invoice.billing_summary.line_items:
            table_data.append([
                item.description,
                f"{item.quantity:.2f}",
                f"${item.unit_price:.4f}",
                f"${item.total:.2f}"
            ])
        
        # Boş satır
        table_data.append(['', '', '', ''])
        
        # Ara toplam
        table_data.append([
            '', '', 'Subtotal:', f"${invoice.billing_summary.subtotal:.2f}"
        ])
        
        # Vergi
        table_data.append([
            '', '', f'Tax ({invoice.billing_summary.tax_rate*100:.0f}%):', f"${invoice.billing_summary.tax_amount:.2f}"
        ])
        
        # Toplam
        table_data.append([
            '', '', 'Total:', f"${invoice.billing_summary.total_amount:.2f}"
        ])
        
        # Tablo oluştur
        invoice_table = Table(table_data, colWidths=[3*inch, 1*inch, 1*inch, 1*inch])
        
        # Tablo stilleri
        invoice_table.setStyle(TableStyle([
            # Başlık satırı
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            
            # Veri satırları
            ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -4), 10),
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),
            
            # Toplam satırları
            ('FONTNAME', (0, -3), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -3), (-1, -1), 11),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#ecf0f1')),
            
            # Çizgiler
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#3498db')),
            ('LINEBELOW', (0, -4), (-1, -4), 1, colors.black),
            ('LINEBELOW', (0, -1), (-1, -1), 2, colors.black),
            
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(invoice_table)
        story.append(Spacer(1, 30))
        
        # Footer
        footer_text = """
        <b>Payment Terms:</b><br/>
        • Payment is due within 30 days of invoice date<br/>
        • Late payments may incur additional charges<br/>
        • For questions regarding this invoice, please contact: {}<br/><br/>
        <i>Thank you for using DecentraCloud Platform!</i>
        """.format(settings.company_email)
        
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # PDF oluştur
        try:
            doc.build(story)
            logger.info(f"PDF generated successfully: {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            raise
    
    def create_invoice_from_summary(self, billing_summary: BillingSummary) -> Invoice:
        """BillingSummary'den Invoice oluştur"""
        invoice_id = f"INV-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        invoice_date = datetime.now()
        due_date = invoice_date + timedelta(days=30)
        
        return Invoice(
            invoice_id=invoice_id,
            invoice_date=invoice_date,
            due_date=due_date,
            billing_summary=billing_summary
        )
    
    def get_pdf_url(self, filepath: str) -> str:
        """PDF dosyası için URL oluştur"""
        filename = os.path.basename(filepath)
        return f"/api/invoices/download/{filename}"
    
    def cleanup_old_pdfs(self, days_old: int = 30):
        """Eski PDF dosyalarını temizle"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days_old)
            
            for filename in os.listdir(self.pdf_dir):
                filepath = os.path.join(self.pdf_dir, filename)
                if os.path.isfile(filepath):
                    file_modified = datetime.fromtimestamp(os.path.getmtime(filepath))
                    if file_modified < cutoff_date:
                        os.remove(filepath)
                        logger.info(f"Removed old PDF: {filename}")
                        
        except Exception as e:
            logger.error(f"Error cleaning up PDFs: {e}")

# Singleton instance
pdf_generator = PDFGenerator() 