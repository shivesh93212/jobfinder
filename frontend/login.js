// console.log("login.js loaded ✅");



const BACKEND = "https://jobfinder-ncq4.onrender.com";


const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", loginUser);

async function loginUser() {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    try {
        const resp = await fetch(`${BACKEND}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!resp.ok) {
            const err = await resp.text();
            console.error(err);
            alert("Invalid email or password");
            return;
        }

        const data = await resp.json();

        // ✅ STORE JWT
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);

        alert("Login successful ✅");

        // ✅ Redirect to home
        window.location.href = "index.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}
