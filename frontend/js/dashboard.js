// Check Login
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

// Welcome User
const name = localStorage.getItem("name");
const welcomeUser = document.getElementById("welcomeUser");

if (welcomeUser) {
    welcomeUser.innerText = `Welcome, ${name}`;
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    alert("Logged out successfully.");

    window.location.href = "login.html";

});

async function loadDashboardStats() {

    try {

        const res = await fetch("http://localhost:5000/api/notes");

        const notes = await res.json();

        const email = localStorage.getItem("email");

        document.getElementById("totalNotes").innerText = notes.length;

        const myNotes = notes.filter(note => note.uploadedBy === email);
        document.getElementById("myNotes").innerText = myNotes.length;

        const subjects = [...new Set(notes.map(note => note.subject))];
        document.getElementById("totalSubjects").innerText = subjects.length;

        const branches = [...new Set(notes.map(note => note.branch))];
        document.getElementById("totalBranches").innerText = branches.length;

    } catch (err) {
        console.log(err);
    }

}

loadDashboardStats();