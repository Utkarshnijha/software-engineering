# web-backend/history_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth_utils import get_current_user
from crud import get_last_history
from schemas import HistoryOut

router = APIRouter(prefix="", tags=["History"])

@router.get("/")
def last_ten(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return get_last_history(db, user.User_id)
