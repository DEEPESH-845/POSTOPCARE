from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import Optional


class Settings(BaseSettings):
# App
    APP_NAME: str = "PostOpCare+ Photo Service"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api"


    # Security
    API_KEY: str = "dev-secret-key" # change in prod
    ALLOW_ORIGINS: str = "*" # comma-separated


    # Storage mode: "cloudinary" | "local"
    STORAGE_BACKEND: str = "local"


    # Local storage
    LOCAL_MEDIA_ROOT: str = "./media"
    BASE_URL: Optional[AnyUrl] = None # e.g., http://localhost:8000


    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    CLOUDINARY_FOLDER: str = "postopcare"


    # Analyzer
    ANALYZER_ENGINE: str = "mock" # "clip" | "mock"


class Config:
    env_file = ".env"
    env_file_encoding = "utf-8"


settings = Settings()