# web-backend/crud.py

from datetime import datetime
from sqlalchemy.orm import Session
from Integration import PredictionHistory, TrainedModel

def save_prediction(
    db: Session,
    user_id: int,
    model: str,
    survived: bool,
    probability: float,
    params: dict,
):
    """
    Persist a single prediction row.
    """
    # map model name → id (optional)
    model_row = (
        db.query(TrainedModel)
        .filter(TrainedModel.Model_Type == model)
        .first()
    )
    model_id = model_row.Model_id if model_row else None

    rec = PredictionHistory(
        Created_by=user_id,
        Model_used=model_id,
        Survival_status=survived,
        Probability=probability,
        Params=json.dumps(params),
        Created_at=datetime.utcnow(),
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


def get_last_history(db: Session, user_id: int, limit: int = 10):
    """
    Return latest `limit` predictions for a user.
    """
    return (
        db.query(PredictionHistory)
        .filter(PredictionHistory.Created_by == user_id)
        .order_by(PredictionHistory.Created_at.desc())
        .limit(limit)
        .all()
    )

def list_models(db: Session):
    """
    Return all trained-model metadata rows.
    """
    return db.query(TrainedModel).all()

def create_model_record(
    db: Session,
    name: str,
    algorithm: str,
    features: list[str],
    filepath: str
):
    """
    Persist a new TrainedModel row with all metadata.
    """
    rec = TrainedModel(
        Model_Type = name,
        Algorithm  = algorithm,
        Features   = ",".join(features),
        Filepath   = filepath,
        Created_at = datetime.utcnow(),
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec
