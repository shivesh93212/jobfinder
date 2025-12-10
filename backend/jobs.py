from fastapi import APIRouter, HTTPException
import requests
import os
router = APIRouter()

API_KEY = os.getenv("RAPID_API_KEY")   # <-- put your RapidAPI key here
API_URL = "https://jsearch.p.rapidapi.com/search"


@router.get("/jobs/search")
def search_jobs(q: str, location: str = "", type: str = "", exp: str = "", page: int = 1):

    # -------- Build API Query Parameters --------
    params = {
        "query": q,
        "page": page,
        "num_pages": 1   # we load one page at a time
    }

    if location:
        params["location"] = location
    if type:
        params["employment_types"] = type
    if exp:
        params["experience_level"] = exp

    # -------- API Authentication Headers --------
    headers = {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }

    # -------- Call JSearch API --------
    try:
        response = requests.get(API_URL, headers=headers, params=params)
        data = response.json()
    except Exception:
        raise HTTPException(500, "Failed to fetch job data")

    results = []

    # -------- Normalize API Response --------
    for job in data.get("data", []):
        results.append({
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city") or job.get("job_country"),
            "source": job.get("job_publisher"),        # LinkedIn / Naukri / Indeed
            "apply_url": job.get("job_apply_link")
        })

    return {
        "page": page,
        "count": len(results),
        "results": results
    }
