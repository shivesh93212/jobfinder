from datetime import datetime,timedelta
from jose import jwt,JWTError
from config import SECRET_KEY,ALGORITHM

def create_access_token(data:dict,expires_minutes=60):
    to_encode=data.copy()
    expire=datetime.utcnow()+timedelta(minutes=expires_minutes)
    to_encode["exp"]=expire
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

def decode_token(token:str):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None