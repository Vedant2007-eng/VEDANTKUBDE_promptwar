from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "BlindSpot AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    ENVIRONMENT: str = "development"
    PORT: int = 8000

    # Frontend / CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "blindspot_db"

    # LLM Settings
    GROQ_API_KEY: str = Field(default="", description="Groq Cloud API Key")
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    LLM_TIMEOUT: float = 30.0
    MAX_CONCURRENT_AGENTS: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_cors_origins(self) -> List[str]:
        origins = list(self.ALLOWED_ORIGINS)
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins


settings = Settings()
