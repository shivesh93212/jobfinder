from pydantic import BaseModel

# ---------- AUTH ----------
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True


# ---------- SAVED JOB ----------
class SavedJobCreate(BaseModel):
    title: str
    company: str | None = None
    location: str | None = None
    source: str | None = None
    apply_url: str | None = None
    status: str = "not_applied"


class SavedJobOut(SavedJobCreate):
    id: int

    class Config:
        orm_mode = True
