from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database import get_db
from models import SavedJob
from schemas import SavedJobCreate


router=APIRouter()

@router.post("/saved")
def save_job(job: SavedJobCreate , db:Session=Depends(get_db)):
    new=SavedJob(**job.dict(),user_id=1)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/saved")
def get_saved(db:Session=Depends(get_db)):
    return db.query(SavedJob).filter(SavedJob.user_id==1).all()