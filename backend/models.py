from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete")
    tracker_jobs = relationship("TrackerJob", back_populates="user", cascade="all, delete")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String)
    company = Column(String)
    location = Column(String)
    source = Column(String)
    apply_url = Column(String)
    status = Column(String, default="not_applied")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")


class TrackerJob(Base):
    __tablename__ = "tracker_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String)
    company = Column(String)
    location = Column(String)
    status = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="tracker_jobs")
