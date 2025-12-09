
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from auth import router as auth_router
from jobs import router as jobs_router
from saved import router as saved_router
from tracker import router as tracker_router

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router,prefix="/auth")
app.include_router(jobs_router)
app.include_router(saved_router)
app.include_router(tracker_router)