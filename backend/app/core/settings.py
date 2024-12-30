"""
Settings management using Pydantic BaseSettings
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""

    # Redis settings
    UPSTASH_REDIS_REST_URL: str
    UPSTASH_REDIS_REST_TOKEN: str

    # Rate limiting settings
    FREE_RATE_LIMIT: int = 2
    FREE_RATE_WINDOW: int = 2592000  # 30 days in seconds
    PRO_RATE_LIMIT: int = 1000000  # Effectively unlimited
    PRO_RATE_WINDOW: int = 2592000  # 30 days in seconds

    # JWT settings
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    # File limits
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
