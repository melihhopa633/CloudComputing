from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import uvicorn
from app.api.billing import router as billing_router
from app.services.database import db_service
from app.config import settings

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting BillingService...")
    
    try:
        # Initialize database tables
        db_service.create_invoices_table()
        logger.info("✅ Database tables initialized")
        
        # Test database connection (graceful failure)
        try:
            users = db_service.get_all_users()
            logger.info(f"✅ Database connection successful. Found {len(users)} users.")
        except Exception as db_error:
            logger.warning(f"⚠️ Metrics table not ready yet: {db_error}")
            logger.info("✅ Service will start anyway - metrics table will be available when BlockchainService runs")
        
    except Exception as e:
        logger.error(f"❌ Critical startup error: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down BillingService...")

# FastAPI application
app = FastAPI(
    title="CloudChain Billing Service",
    description="Billing and invoicing service for CloudChain Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(billing_router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "CloudChain Billing Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/api/billing/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        users = db_service.get_all_users()
        
        return {
            "status": "healthy",
            "service": "BillingService",
            "version": "1.0.0",
            "database": "connected",
            "users_count": len(users)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level="info"
    ) 