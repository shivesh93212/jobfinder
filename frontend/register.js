const BACKEND = "http://127.0.0.1:8000";

const registerBtn = document.querySelector("#registerBtn");

registerBtn.addEventListener("click", registerUser);

async function registerUser() {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
    const confirmPassword = document.querySelector("#confirmPassword").value.trim();

    if (!email || !password || !confirmPassword) {
        alert("All fields are required");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    try {
        const resp = await fetch(`${BACKEND}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!resp.ok) {
            const err = await resp.text();
            console.error(err);
            alert("Email already exists");
            return;
        }

        alert("Registration successful ✅ Please login");

        window.location.href = "login.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}
