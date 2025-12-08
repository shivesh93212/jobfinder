
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import timedelta,datetime
from jose import jwt

from database import get_db
from models import User
from schemas import UserCreate,UserLogin
from config import SECRET_KEY , ALGORITHM

router = APIRouter()
pwd=CryptContext(schemes=["bcrypt"])

def create_token(data:dict):
    to_encode=data.copy()
    to_encode["exp"]=datetime.utcnow()+timedelta(minutes=60)
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

@router.post("/register")
def register(user:UserCreate,db:Session=Depends(get_db)):
    exists=db.query(User).filter(User.email==user.email).first()
    if exists:
        raise HTTPException(400,"EMail already used")
    
    hashed=pwd.hash(user.password)
    new_user=User(email=user.email,hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"msg":"User created"}

@router.post("/login")
def login(user:UserLogin,db:Session=Depends(get_db)):
    db_user=db.query(User).filter(User.email ==user.email).first()

    if not db_user:
        raise HTTPException(400,"Invalid Credentials")
    if not pwd.verify(user.password,db_user.hashed_password):
        raise HTTPException(400,"Invalid Credentials")
    
    token=create_token({"user_id":db_user.id})
    return {"access_token":token}



