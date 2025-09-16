# web-backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from Integration import Base, engine

# Routers
from auth_routes import router as auth_router
from predict_routes import router as predict_router
from history_routes import router as history_router
from admin_routes import router as admin_router

load_dotenv()

app = FastAPI(
    title="Titanic Survivor Prediction API",
    version="1.0.0"
)

# CORS – in production narrow this down to your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under "/api/*"
app.include_router(auth_router,    prefix="/api/auth")
app.include_router(predict_router, prefix="/api/predict")
app.include_router(history_router, prefix="/api/history")
app.include_router(admin_router,   prefix="/api/admin")

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "API is running"}

# Create all tables (if they don't exist)
Base.metadata.create_all(bind=engine)
