# web-backend/predict_routes.py

from fastapi import APIRouter, Depends, HTTPException
import httpx
from sqlalchemy.orm import Session

from schemas import PassengerIn, PredictionOut
from auth_utils import verify_jwt_token_optional
from database import get_db
from crud import save_prediction
from config import settings

router = APIRouter(
    tags=["Predict"]
)

@router.post("/{model}", response_model=PredictionOut)
def predict(
    model: str,
    data: PassengerIn,
    db: Session = Depends(get_db),
    user=Depends(verify_jwt_token_optional),
):
    """
    Forward passenger data to the model-backend,
    log result for authenticated users,
    return prediction.
    """
    try:
        resp = httpx.post(
            f"{settings.model_url}/predict/{model}",
            json=data.dict(),
            timeout=5,
        )
        resp.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception:
        raise HTTPException(status_code=502, detail="Model backend error")

    result = resp.json()  # {model, survived, probability_of_survival}

    if user:
        save_prediction(
            db=db,
            user_id=user.User_id,
            model=model,
            survived=result["survived"],
            probability=result.get("probability_of_survival", 0.0),
            params=data.dict(),
        )

    return result