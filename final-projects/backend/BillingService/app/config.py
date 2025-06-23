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
    cpu_rate_per_hour: float = 0.05  # $0.05 per CPU hour
    memory_rate_per_gb_hour: float = 0.01  # $0.01 per GB hour
    
    # API Configuration
    api_port: int = 5003
    api_host: str = "0.0.0.0"
    
    # PDF Configuration
    company_name: str = "CloudChain Platform"
    company_address: str = "123 Cloud Street, Tech City"
    company_email: str = "billing@cloudchain.com"
    company_phone: str = "+1 (555) 123-4567"
    
    class Config:
        env_file = ".env"

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

settings = Settings() 