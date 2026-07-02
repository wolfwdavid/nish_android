from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # =========================================================
    # APP
    # =========================================================

    APP_NAME: str = "DevManiac"

    APP_ENV: str = "development"

    API_V1_PREFIX: str = "/api/v1"

    DEBUG: bool = True


    # =========================================================
    # DATABASE
    # =========================================================

    DATABASE_URL: str


    # =========================================================
    # CORS
    # =========================================================

    FRONTEND_URL: str = "http://localhost:3000"

    CORS_ORIGINS: str = "http://localhost:3000"


    # =========================================================
    # CLERK / ADMIN
    # =========================================================

    ADMIN_CLERK_USER_IDS: str = ""

    CLERK_SECRET_KEY: str | None = None


    # =========================================================
    # CLOUDINARY / MEDIA
    # =========================================================

    CLOUDINARY_CLOUD_NAME: str | None = None

    CLOUDINARY_API_KEY: str | None = None

    CLOUDINARY_API_SECRET: str | None = None


    # =========================================================
    # SETTINGS CONFIG
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


    # =========================================================
    # HELPERS
    # =========================================================

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


    @property
    def admin_clerk_user_id_list(self) -> list[str]:
        return [
            user_id.strip()
            for user_id in self.ADMIN_CLERK_USER_IDS.split(",")
            if user_id.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()