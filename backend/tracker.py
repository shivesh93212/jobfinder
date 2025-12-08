
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database import get_db
from models import TrackerJob


router = APIRouter()

@router.get("/tracker")
def get_tracker(db:Session=Depends(get_db)):
    return db.query(TrackerJob).filter(TrackerJob.user_id==1).all()
