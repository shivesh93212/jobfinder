const trackerList = document.querySelector("#trackerList");
const noTracker = document.querySelector("#noTracker");

const BACKEND = "https://jobfinder-ncq4.onrender.com";

async function loadTracker() {
    try {
        const resp = await fetch(`${BACKEND}/tracker`);
        const tracked = await resp.json();

        trackerList.innerHTML = "";

        if (tracked.length === 0) {
            noTracker.hidden = false;
            return;
        }

        noTracker.hidden = true;

        tracked.forEach(job => {
            const card = document.createElement("div");
            card.className = "job-card";

            card.innerHTML = `
                <div style="flex:1">
                    <div style="display:flex; gap:12px; align-items:center">
                        <div class="logo">${(job.company || "J").charAt(0).toUpperCase()}</div>
                        <div>
                            <h4>${escapeHtml(job.title)}</h4>
                            <p style="color:var(--muted); margin:0">
                                ${escapeHtml(job.company)} • ${escapeHtml(job.location || "Remote")}
                            </p>
                        </div>
                    </div>
                    <p style="margin-top:8px;font-size:13px">
                        ${escapeHtml(job.source || "")}
                    </p>
                </div>

                <div style="text-align:right">
                    <p style="margin:0 0 8px 0">
                        Status: <strong>${humanStatus(job.status)}</strong>
                    </p>
                    <a href="${job.apply_url || "#"}" target="_blank" rel="noopener">
                        Open
                    </a>
                </div>
            `;

            trackerList.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        noTracker.hidden = false;
    }
}

/* ---------------- HELPERS ---------------- */

function humanStatus(s) {
    switch (s) {
        case "applied": return "Applied";
        case "interview": return "Interview";
        case "offer": return "Offer";
        case "rejected": return "Rejected";
        default: return "Not Applied";
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

/* ---------------- INIT ---------------- */

loadTracker();
