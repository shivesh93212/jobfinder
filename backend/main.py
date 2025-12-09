from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from auth import router as auth_router
from jobs import router as jobs_router
from saved import router as saved_router
from tracker import router as tracker_router

app = FastAPI()

# ✅ CORS – ALLOW FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ✅ allow ALL (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(saved_router)
app.include_router(tracker_router)

@app.get("/")
def root():
    return {"status": "Backend running"}
