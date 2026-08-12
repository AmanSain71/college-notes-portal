const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login Failed");
            return;
        }

        // Save user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.userId);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);

        alert("Login Successful");

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
});