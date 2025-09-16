# web-backend/schemas.py

from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime

# ── Auth ───────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ── Prediction in/out ────────────────────────────────────────────
class PassengerIn(BaseModel):
    Pclass: int
    Sex: int
    Age: int
    SibSp: int
    Parch: int
    Fare: int
    Embarked: int
    Title: int
    IsAlone: int


class PredictionOut(BaseModel):
    model: str
    survived: bool
    probability_of_survival: float


# ── History row ─────────────────────────────────────────────────
class HistoryOut(BaseModel):
    id: int = Field(..., alias="History_id")
    model: str | None = Field(None, alias="Model_used")
    survived: bool = Field(..., alias="Survival_status")
    probability: float = Field(..., alias="Probability")
    params: Dict = Field(..., alias="Params")
    timestamp: datetime = Field(..., alias="Created_at")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

# ── Model CRUD ────────────────────────────────────────────────
class ModelInfo(BaseModel):
    id:         int
    name:       str
    algorithm:  str
    features:   List[str]
    filepath:   str
    created_at: datetime

    class Config:
        orm_mode = True
