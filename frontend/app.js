// Corrected app.js

const searchBtn = document.querySelector("#searchBtn");
const jobList = document.querySelector("#jobList");
const resultCount = document.querySelector("#resultCount");
const noResult = document.querySelector("#noResult");

searchBtn.addEventListener("click", () => runSearch());

async function runSearch() {
    const q = document.querySelector("#q").value.trim();
    const location = document.querySelector("#location").value.trim();
    const type = document.querySelector("#jobType").value;
    const exp = document.querySelector("#exp").value;

    if (!q) {
        alert('Please type a search term (e.g. "developer")');
        return;
    }

    resultCount.textContent = 'Searching...';
    jobList.innerHTML = '';
    noResult.hidden = true;

    const BACKEND = 'http://localhost:8000';

    const url = new URL(BACKEND + '/jobs/search');
    url.searchParams.set('q', q);
    if (location) url.searchParams.set('location', location);
    if (type) url.searchParams.set('type', type);
    if (exp) url.searchParams.set('exp', exp);

    try {
        const resp = await fetch(url.toString());
        if (!resp.ok) throw new Error('Network Error');

        const data = await resp.json();
        const results = data.results || [];

        resultCount.textContent = `${results.length} job(s) found`;

        if (results.length === 0) {
            noResult.hidden = false;
            return;
        }

        results.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';

            card.innerHTML = `
                <div class="job-left">
                    <div class="logo">${(job.company || 'J').charAt(0).toUpperCase()}</div>
                    <div class="job-meta">
                        <h4>${escapeHtml(job.title || 'Untitled')}</h4>
                        <p>${escapeHtml(job.company || '')} • ${escapeHtml(job.location || 'Remote')}</p>
                        <p style="font-size:13px;color:#8b95a4">${escapeHtml(job.source || '')}</p>
                    </div>
                </div>
                <div class="job-actions">
                    <a href="${job.apply_url || '#'}" target="_blank" rel="noopener">Apply</a>
                    <button class="save-btn" data-job='${HTMLSafeStringify(job)}'>Save</button>
                </div>
            `;

            const saveBtn = card.querySelector(".save-btn");
            saveBtn.addEventListener("click", onSaveClick);

            jobList.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        resultCount.textContent = "Error fetching jobs";
        noResult.hidden = false;
    }
}


function onSaveClick(e) {
    const btn = e.currentTarget;
    const job = JSON.parse(btn.dataset.job);

    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (saved.some(s => s.apply_url && s.apply_url === job.apply_url)) {
        btn.textContent = 'Saved';
        btn.disabled = true;
        return;
    }

    saved.push({ ...job, savedAt: new Date().toISOString(), status: 'not_applied' });
    localStorage.setItem('savedJobs', JSON.stringify(saved));

    btn.textContent = 'Saved';
    btn.disabled = true;
}


function escapeHtml(s = '') {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function HTMLSafeStringify(obj) {
    return escapeHtml(JSON.stringify(obj).replace(/'/g, "\\'"));
}
