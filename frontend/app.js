const searchBtn = document.querySelector("#searchBtn");
const jobList = document.querySelector("#jobList");
const resultCount = document.querySelector("#resultCount");
const noResult = document.querySelector("#noResult");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn=document.querySelector("#logoutBtn");

function updateAuthButtons(){
    const token=localStorage.getItem("token");
    if(token){
        loginBtn.hidden=true;
        logoutBtn.hidden=false;
    }
    else{
        loginBtn.hidden=false;
        logoutBtn.hidden=true;
    }
}
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}

if(logoutBtn){
    logoutBtn.addEventListener("click",()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        alert("Logged out successfully!");
        updateAuthButtons();
        window.location.reload();
    });
}
updateAuthButtons();
const BACKEND = "https://jobfinder-ncq4.onrender.com";

searchBtn.addEventListener("click", runSearch);

async function runSearch() {
    const q = document.querySelector("#q").value.trim();
    const location = document.querySelector("#location").value.trim();

    if (!q) {
        alert("Please enter a search term");
        return;
    }

    resultCount.textContent = "Searching...";
    jobList.innerHTML = "";
    noResult.hidden = true;

    const url = new URL(`${BACKEND}/jobs/search`);
    url.searchParams.set("q", q);
    if (location) url.searchParams.set("location", location);

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch jobs");

        const data = await resp.json();
        const results = data.results || [];

        resultCount.textContent = `${results.length} job(s) found`;

        if (results.length === 0) {
            noResult.hidden = false;
            return;
        }

        results.forEach(job => renderJobCard(job));

    } catch (err) {
        console.error(err);
        resultCount.textContent = "Error loading jobs";
        noResult.hidden = false;
    }
}

function renderJobCard(job) {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
        <div class="job-left">
            <div class="logo">${(job.company || "J").charAt(0).toUpperCase()}</div>
            <div class="job-meta">
                <h4>${escapeHtml(job.title || "Untitled")}</h4>
                <p>${escapeHtml(job.company || "")} • ${escapeHtml(job.location || "Remote")}</p>
                <p style="font-size:13px;color:#8b95a4">${escapeHtml(job.source || "")}</p>
            </div>
        </div>
        <div class="job-actions">
            <a href="${job.apply_url || "#"}" target="_blank" rel="noopener">Apply</a>
            <button class="save-btn">Save</button>
        </div>
    `;

    card.querySelector(".save-btn")
        .addEventListener("click", () => saveJob(job));

    jobList.appendChild(card);
}

async function saveJob(job) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const resp = await fetch(`${BACKEND}/saved`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token   // ✅ JWT HEADER
            },
            body: JSON.stringify({
                title: job.title,
                company: job.company,
                location: job.location,
                source: job.source,
                apply_url: job.apply_url,
                status: "not_applied"
            })
        });

        if (!resp.ok) {
            const err = await resp.text();
            console.error(err);
            throw new Error("Save failed");
        }

        alert("Job saved ✅");

    } catch (err) {
        console.error(err);
        alert("Error saving job");
    }
}


function escapeHtml(s = "") {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
