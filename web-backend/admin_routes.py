# web-backend/admin_routes.py

from typing        import List
from fastapi       import APIRouter, Depends, HTTPException, Request
import httpx
from sqlalchemy.orm import Session

# === FIXED: absolute imports, not relative ===
from crud          import create_model_record
from Integration   import TrainedModel, Registered_User
from auth_utils    import verify_jwt_token
from database      import get_db
from schemas       import ModelInfo
from config        import settings

from pydantic import BaseModel

router = APIRouter(tags=["Admin"])
ADMIN_EMAILS = ["admin@titanic.com"]

def require_admin(request: Request, db: Session = Depends(get_db)):
    token = request.headers.get("Authorization","").removeprefix("Bearer ").strip()
    email = verify_jwt_token(token)
    user  = db.query(Registered_User).filter_by(Email=email).first()
    if not user or user.Email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get(
    "/features",
    response_model=List[str],
    dependencies=[Depends(require_admin)]
)
def list_features():
    return ["Pclass","Sex","Age","Fare","Embarked","Title","IsAlone"]

@router.get(
    "/models",
    response_model=List[ModelInfo],
    dependencies=[Depends(require_admin)]
)
def list_models(db: Session = Depends(get_db)):
    return db.query(TrainedModel).all()

@router.delete(
    "/models/{model_id}",
    status_code=204,
    dependencies=[Depends(require_admin)]
)
def delete_model(model_id: int, db: Session = Depends(get_db)):
    rec = db.get(TrainedModel, model_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Model not found")
    try:
        httpx.delete(f"{settings.MODEL_URL}/models/{model_id}", timeout=5)
    except:
        pass
    db.delete(rec)
    db.commit()
    return

class TrainRequest(BaseModel):
    name:      str
    algorithm: str
    features:  List[str]


@router.post(
    "/models",
    response_model=ModelInfo,
    status_code=201,
    dependencies=[Depends(require_admin)]
)
def train_model(req: TrainRequest, db: Session = Depends(get_db)):
    # 1) send to model-backend
    resp = httpx.post(f"{settings.MODEL_URL}/train", json=req.dict(), timeout=60)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=resp.text)
    meta = resp.json()  # {filename,name,algorithm,features}

    # 2) persist in our DB
    record = create_model_record(
        db,
        name      = meta["name"],
        algorithm = meta["algorithm"],
        features  = meta["features"],
        filepath  = meta["filename"],
    )

    # 3) return full DTO
    return ModelInfo.from_orm(record)
