const savedList = document.querySelector("#savedList");
const noSaved = document.querySelector("#noSaved");

function loadSaved() {
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    savedList.innerHTML = "";

    if (saved.length === 0) {
        noSaved.hidden = false;
        return;
    }

    noSaved.hidden = true;

    saved.forEach((job, idx) => {
        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <div class="job-left">
                <div class="logo">${(job.company || 'J').charAt(0).toUpperCase()}</div>
                <div class="job-meta">
                    <h4>${escapeHtml(job.title)}</h4>
                    <p>${escapeHtml(job.company || '')} • ${escapeHtml(job.location || 'Remote')}</p>
                    <p style="font-size:13px;color:#8b95a4">${escapeHtml(job.source || '')}</p>
                </div>
            </div>

            <div class="job-actions">
                <a href="${job.apply_url || '#'}" target="_blank" rel="noopener">Apply</a>

                <select class="status-select">
                    <option value="not_applied">Not Applied</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>

                <button class="remove-btn small">Remove</button>
            </div>
        `;

 
        const select = card.querySelector(".status-select");
        select.value = job.status || "not_applied";

       
        select.addEventListener("change", e => updateStatus(idx, e.target.value));

      
        card.querySelector(".remove-btn").addEventListener("click", () => removeSaved(idx));

        savedList.appendChild(card);
    });
}

function updateStatus(index, status) {
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    if (!saved[index]) return;

    saved[index].status = status;
    saved[index].updatedAt = new Date().toISOString();

    localStorage.setItem("savedJobs", JSON.stringify(saved));
}

function removeSaved(index) {
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    saved.splice(index, 1);

    localStorage.setItem("savedJobs", JSON.stringify(saved));

    loadSaved();
}

function escapeHtml(s = '') {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

loadSaved();
