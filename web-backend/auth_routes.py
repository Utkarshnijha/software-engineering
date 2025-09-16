from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from Integration import Registered_User
from database import get_db
from auth_utils import get_password_hash, verify_password, create_access_token

router = APIRouter(tags=["Authentication"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post("/register")
async def register_user(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):
    # check email
    if db.query(Registered_User).filter(Registered_User.Email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # check username
    if db.query(Registered_User).filter(Registered_User.Username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists.")
    # create
    new_user = Registered_User(
        Username=user.username,
        Email=user.email,
        Password=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/token")
async def login(
    login_req: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(Registered_User).filter(Registered_User.Username == login_req.username).first()
    if not user or not verify_password(login_req.password, user.Password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token(user.Email)
    return {"access_token": token, "token_type": "bearer"}
