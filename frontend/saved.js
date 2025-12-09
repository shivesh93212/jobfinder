const savedList = document.querySelector("#savedList");
const noSaved = document.querySelector("#noSaved");

const BACKEND = "http://127.0.0.1:8000";

async function loadSaved() {
    const resp = await fetch(`${BACKEND}/saved`);
    const saved = await resp.json();

    savedList.innerHTML = "";

    if (saved.length === 0) {
        noSaved.hidden = false;
        return;
    }

    noSaved.hidden = true;

    saved.forEach((job) => {
        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <div class="job-left">
                <div class="logo">${(job.company || "J").charAt(0).toUpperCase()}</div>
                <div class="job-meta">
                    <h4>${escapeHtml(job.title)}</h4>
                    <p>${escapeHtml(job.company || "")} • ${escapeHtml(job.location || "Remote")}</p>
                    <p style="font-size:13px;color:#8b95a4">${escapeHtml(job.source || "")}</p>
                </div>
            </div>

            <div class="job-actions">
                <a href="${job.apply_url || "#"}" target="_blank" rel="noopener">Apply</a>

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

        // ✅ Set current status
        const select = card.querySelector(".status-select");
        select.value = job.status || "not_applied";

        // ✅ Update status in BACKEND
        select.addEventListener("change", (e) =>
            updateStatus(job.id, e.target.value)
        );

        // ✅ Remove saved job from BACKEND
        card.querySelector(".remove-btn")
            .addEventListener("click", () => removeSaved(job.id));

        savedList.appendChild(card);
    });
}

/* ---------------- BACKEND CALLS ---------------- */

async function updateStatus(jobId, status) {
    await fetch(`${BACKEND}/saved/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
}

async function removeSaved(jobId) {
    await fetch(`${BACKEND}/saved/${jobId}`, {
        method: "DELETE"
    });

    loadSaved();
}

/* ---------------- SECURITY ---------------- */

function escapeHtml(s = "") {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ---------------- INIT ---------------- */

loadSaved();
