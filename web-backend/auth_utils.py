# web-backend/auth_utils.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer

# ── ADD THESE IMPORTS ──────────────────────────────────────────
from sqlalchemy.orm import Session
from database import get_db
from Integration import Registered_User
from config import settings          # loads SECRET_KEY, ALGORITHM, etc.
# ───────────────────────────────────────────────────────────────

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Password helpers ───────────────────────────────────────────
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

# ── JWT helpers ────────────────────────────────────────────────
def create_access_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def verify_jwt_token(token: str) -> str:
    """Return email if token valid, else raise 401."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token missing subject")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def verify_jwt_token_optional(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Return user instance if a valid Bearer token is present,
    otherwise None (anonymous allowed).
    """
    token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    if not token:
        return None
    try:
        email = verify_jwt_token(token)
    except HTTPException:
        return None
    return db.query(Registered_User).filter_by(Email=email).first()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Decode required Bearer token, fetch user or 401.
    """
    email = verify_jwt_token(token)
    user = db.query(Registered_User).filter_by(Email=email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
