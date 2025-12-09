from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from database import get_db
from models import SavedJob
from schemas import SavedJobCreate
from utils import decode_token

router = APIRouter(tags=["Saved Jobs"])


# -------- JWT DEPENDENCY ----------
def get_current_user(Authorization: str = Header(None)):
    if Authorization is None:
        raise HTTPException(status_code=401, detail="Token missing")

    token = Authorization.replace("Bearer ", "")
    payload = decode_token(token)

    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload["user_id"]


# ---------------- CREATE ----------------
@router.post("/saved")
def save_job(
    job: SavedJobCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    new_job = SavedJob(**job.dict(), user_id=user_id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


# ---------------- READ ----------------
@router.get("/saved")
def get_saved(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    return db.query(SavedJob).filter(SavedJob.user_id == user_id).all()


# ---------------- UPDATE ----------------
@router.patch("/saved/{job_id}")
def update_saved(
    job_id: int,
    data: dict,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    job = db.query(SavedJob).filter(
        SavedJob.id == job_id,
        SavedJob.user_id == user_id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = data.get("status", job.status)
    db.commit()
    return {"message": "Status updated"}


# ---------------- DELETE ----------------
@router.delete("/saved/{job_id}")
def delete_saved(
    job_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    job = db.query(SavedJob).filter(
        SavedJob.id == job_id,
        SavedJob.user_id == user_id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": "Job removed"}
