from fastapi import APIRouter
import requests

router=APIRouter()

@router.get("/jobs/search")
def search_jobs(q:str,location:str="",type:str="",exp: str=""):
    return {
        "results":[
            {
                "title":"Python Developer",
                "company":"Google",
                "location":"Remote",
                "source":"Custom API",
                "apply_url":"https://google.com/jobs"
            }
        ]
    }