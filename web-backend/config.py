from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:1234@db:5432/Titanic_Databases"
    secret_key:   str = "CHANGE_ME"
    algorithm:    str = "HS256"
    access_token_expire_minutes: int = 60
    model_url:    str = "http://model-backend:8000"
    class Config:
        env_file = ".env"

settings = Settings()
