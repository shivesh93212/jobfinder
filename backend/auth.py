from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import get_db
from models import User
from schemas import UserCreate, UserLogin
from utils import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------- REGISTER ----------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == user.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = pwd_context.hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, str(db_user.hashed_password)):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"user_id": db_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": db_user.id
    }
