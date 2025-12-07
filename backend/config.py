from dotenv import load_dotenv
import os

load_dotenv() 


SECRET_KEY = str(os.getenv("SECRET_KEY")) 
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

DATABASE_URL = os.getenv("DATABASE_URL")

if SECRET_KEY is None:
    raise ValueError("SECRET_KEY is missing from .env")

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL is missing from .env")
