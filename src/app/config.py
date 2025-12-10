"""Application settings loaded from environment variables."""

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Holds Supabase and application configuration."""

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True)

    supabase_url: str
    supabase_key: str
    supabase_table: str = "pitches"
    supabase_bucket: str = "presentations"
    code_length: int = Field(8, validation_alias="PITCH_CODE_LENGTH")


@lru_cache
def get_settings() -> Settings:
    """Returns cached application settings."""
    return Settings()
