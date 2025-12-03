"""
Enterprise Predictive Maintenance ML System - Configuration
Using Pydantic for robust configuration management
"""
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings
from typing import Optional, Literal
from functools import lru_cache
import os


class DatabaseSettings(BaseSettings):
    """Database configuration settings"""
    postgres_host: str = Field(default="localhost", description="PostgreSQL host")
    postgres_port: int = Field(default=5432, description="PostgreSQL port")
    postgres_user: str = Field(default="postgres", description="PostgreSQL user")
    postgres_password: str = Field(default="", description="PostgreSQL password")
    postgres_db: str = Field(default="predictive_maintenance", description="PostgreSQL database")
    
    redis_host: str = Field(default="localhost", description="Redis host")
    redis_port: int = Field(default=6379, description="Redis port")
    
    @property
    def postgres_url(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    @property
    def redis_url(self) -> str:
        return f"redis://{self.redis_host}:{self.redis_port}"


class MLSettings(BaseSettings):
    """Machine Learning configuration settings"""
    model_name: str = Field(default="xgboost", description="Primary model type")
    model_path: str = Field(default="models/", description="Path to save/load models")
    training_data_path: str = Field(default="data/", description="Path to training data")
    
    # Model hyperparameters
    random_state: int = Field(default=42, description="Random state for reproducibility")
    test_size: float = Field(default=0.2, ge=0.1, le=0.4, description="Test split ratio")
    cv_folds: int = Field(default=5, ge=3, le=10, description="Cross-validation folds")
    
    # Feature engineering
    feature_selection_threshold: float = Field(default=0.01, description="Feature importance threshold")
    handle_imbalance: bool = Field(default=True, description="Whether to handle class imbalance")
    imbalance_method: Literal["smote", "adasyn", "class_weight"] = Field(default="smote")
    
    # Cost-benefit analysis
    maintenance_cost: float = Field(default=2050.0, description="Cost of unnecessary maintenance")
    failure_cost: float = Field(default=10300.0, description="Cost of missed failure")
    alert_threshold: float = Field(default=0.3, ge=0.0, le=1.0, description="Probability threshold for alerts")


class LLMSettings(BaseSettings):
    """LLM and AI Agent configuration"""
    google_api_key: str = Field(default="", description="Google Gemini API key")
    model_name: str = Field(default="gemini-pro", description="LLM model name")
    temperature: float = Field(default=0.1, ge=0.0, le=1.0, description="LLM temperature")
    max_tokens: int = Field(default=4096, description="Max tokens for LLM response")
    
    # CrewAI settings
    crew_verbose: bool = Field(default=True, description="CrewAI verbose mode")
    crew_max_iterations: int = Field(default=10, description="Max iterations for agents")
    
    # RAG settings
    embedding_model: str = Field(default="all-MiniLM-L6-v2", description="Embedding model for RAG")
    chunk_size: int = Field(default=1000, description="Document chunk size")
    chunk_overlap: int = Field(default=200, description="Document chunk overlap")
    top_k_retrieval: int = Field(default=5, description="Top K documents to retrieve")


class VectorDBSettings(BaseSettings):
    """Vector Database configuration"""
    chroma_persist_dir: str = Field(default="./chroma_db", description="ChromaDB persistence directory")
    collection_name: str = Field(default="maintenance_knowledge", description="Collection name")
    distance_metric: Literal["cosine", "l2", "ip"] = Field(default="cosine", description="Distance metric")


class MonitoringSettings(BaseSettings):
    """Monitoring and observability settings"""
    mlflow_tracking_uri: str = Field(default="http://localhost:5000", description="MLflow tracking URI")
    mlflow_experiment_name: str = Field(default="predictive_maintenance", description="MLflow experiment")
    
    enable_prometheus: bool = Field(default=True, description="Enable Prometheus metrics")
    prometheus_port: int = Field(default=8000, description="Prometheus metrics port")
    
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(default="INFO")
    structured_logging: bool = Field(default=True, description="Use structured logging")


class APISettings(BaseSettings):
    """API server configuration"""
    host: str = Field(default="0.0.0.0", description="API host")
    port: int = Field(default=8080, description="API port")
    workers: int = Field(default=4, description="Number of workers")
    
    cors_origins: list[str] = Field(default=["*"], description="CORS allowed origins")
    api_version: str = Field(default="v1", description="API version")
    
    rate_limit_requests: int = Field(default=100, description="Rate limit requests per minute")


class Settings(BaseSettings):
    """Main application settings aggregating all configs"""
    app_name: str = Field(default="PredictiveMaintenance-Enterprise", description="Application name")
    environment: Literal["development", "staging", "production"] = Field(default="development")
    debug: bool = Field(default=True, description="Debug mode")
    
    # Sub-configurations
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    ml: MLSettings = Field(default_factory=MLSettings)
    llm: LLMSettings = Field(default_factory=LLMSettings)
    vectordb: VectorDBSettings = Field(default_factory=VectorDBSettings)
    monitoring: MonitoringSettings = Field(default_factory=MonitoringSettings)
    api: APISettings = Field(default_factory=APISettings)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
