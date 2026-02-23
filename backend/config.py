"""Configuration management for the Legal AI backend."""
import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4o"

    # Mistral Configuration (Fallback)
    mistral_api_key: str = ""
    mistral_model: str = "mistral-large-latest"

    # Pinecone Configuration
    pinecone_api_key: str
    pinecone_index_name: str = "legal-ai-index"
    pinecone_environment: str = "us-east-1-aws"

    # LLM Provider
    llm_provider: Literal["openai", "mistral"] = "openai"

    # Embedding Configuration
    embedding_model: str = "text-embedding-3-small"
    embedding_dimension: int = 1536

    # Application Configuration
    frontend_url: str = "http://localhost:3000"
    backend_port: int = 8000

    # RAG Configuration
    top_k_chunks: int = 5
    chunk_size: int = 512
    chunk_overlap: int = 50

    # Confidence Thresholds
    retrieval_confidence_weight: float = 0.6
    llm_confidence_weight: float = 0.4
    high_confidence_threshold: float = 0.75
    medium_confidence_threshold: float = 0.50

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


# Global settings instance
settings = Settings()
