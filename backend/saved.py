from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import SavedJob
from schemas import SavedJobCreate

router = APIRouter()

# ---------------- CREATE ----------------
@router.post("/saved")
def save_job(job: SavedJobCreate, db: Session = Depends(get_db)):
    new = SavedJob(**job.dict(), user_id=1)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


# ---------------- READ ----------------
@router.get("/saved")
def get_saved(db: Session = Depends(get_db)):
    return db.query(SavedJob).filter(SavedJob.user_id == 1).all()


# ---------------- UPDATE (STATUS) ----------------
@router.patch("/saved/{job_id}")
def update_saved(job_id: int, data: dict, db: Session = Depends(get_db)):
    job = db.query(SavedJob).filter(
        SavedJob.id == job_id,
        SavedJob.user_id == 1
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = data.get("status", job.status)
    db.commit()
    return {"message": "Status updated"}


# ---------------- DELETE ----------------
@router.delete("/saved/{job_id}")
def delete_saved(job_id: int, db: Session = Depends(get_db)):
    job = db.query(SavedJob).filter(
        SavedJob.id == job_id,
        SavedJob.user_id == 1
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": "Job removed"}
