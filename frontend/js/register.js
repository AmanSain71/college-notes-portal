const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {

        const response = await fetch("https://college-notes-portal-b79p.vercel.app/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration Failed");
            return;
        }

        alert("Registration Successful");

        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
});