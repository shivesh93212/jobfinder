from pydantic import BaseModel

class UserCreate(BaseModel):
    email:str
    password:str
class UserLogin(BaseModel):
    email:str
    password:str
class SavedJobCreate(BaseModel):
    titel:str
    company:str
    location:str
    source:str
    apply_url:str
    status:str="not_applied"

class SavedJobOut(SavedJobCreate):
    id:int
       
       
    
    

