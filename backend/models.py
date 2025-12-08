from sqlalchemy import Column ,Integer , String , Boolean , DateTime ,Text,ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__="users"

id=Column(Integer,primary_key=True,index=True)
email=Column(String,unique=True,index=True,nullabel=False)
hashed_password=Column(String,nullable=False)

saved_jobes=relationship("SavedJob",back_populates="user")
tracker_jobes=relationship("TrackerJob",back_populations="user")

class SavedJob(Base):
    __tablename__="saved_jobs"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    title=Column(String)
    company=Column(String)
    location=Column(String)
    source=Column(String)
    applu_url=Column(String)
    status=Column(String,default="not_applied")
    created_at=Column(DateTime,default=datetime.utcnow)

    user=relationship("USer",back_populates="saved_jobes")

class TrackerJob(Base):
    __tablename__="tracker_jobes"

    id=Column(Integer,primary_ley=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    title=Column(String)
    company=Column(String)
    location=Column(String)
    status=Column(String)
    updated_at=Column(DateTime,default=datetime.utcnow)

    user=relationship("User",back_populate="tracker_jobes")