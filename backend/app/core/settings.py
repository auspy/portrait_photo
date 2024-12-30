"""
Settings management using Pydantic BaseSettings
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""

    # Redis settings (updated to match your env variables)
    UPSTASH_REDIS_REST_URL: str
    UPSTASH_REDIS_REST_TOKEN: str

    # Rate limiting settings
    FREE_RATE_LIMIT: int = 10
    FREE_RATE_WINDOW: int = 60  # seconds
    PRO_RATE_LIMIT: int = 100
    PRO_RATE_WINDOW: int = 60  # seconds

    # API settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Portrait Photo API"
    DEBUG: bool = False

    # JWT settings
    JWT_SECRET_KEY: str = "your-secret-key-here"  # You should set this in .env
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
