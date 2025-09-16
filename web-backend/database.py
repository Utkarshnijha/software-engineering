import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
try:
    from Integration import Base
except ImportError:
    from .Integration import Base

# Use your existing database connection string
SQLALCHEMY_DATABASE_URL = os.getenv(
    "Database_URL",
    "postgresql://postgres:1234@db:5432/Titanic_Databases"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()