from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database Configuration
    postgres_host: str = "postgres_blockchain"
    postgres_port: int = 5432
    postgres_db: str = "blockchain_metrics"
    postgres_user: str = "blockchain"
    postgres_password: str = "blockchain"
    
    # Billing Configuration
    cpu_rate_per_hour: float = 2.50  # $2.50 per CPU hour
    memory_rate_per_mb_hour: float = 0.0012  # $0.0012 per MB hour (1.20/1024)
    base_service_charge: float = 5.00  # $5.00 base charge per service
    
    # API Configuration
    api_port: int = 5003
    api_host: str = "0.0.0.0"
    
    # PDF Configuration
    company_name: str = "DecentraCloud"
    company_address: str = "123 Blockchain Avenue, Tech Valley"
    company_email: str = "billing@decentracloud.com"
    company_phone: str = "+1 (555) DECENTRA"
    
    class Config:
        env_file = ".env"

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

settings = Settings() 