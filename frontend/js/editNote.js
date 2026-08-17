const editForm = document.getElementById("editForm");

const token = localStorage.getItem("token");
const noteId = localStorage.getItem("editNoteId");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

if (!noteId) {
    alert("No note selected.");
    window.location.href = "myNotes.html";
}

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const semester = document.getElementById("semester").value.trim();
    const branch = document.getElementById("branch").value.trim();
    const description = document.getElementById("description").value.trim();

    try {

        const res = await fetch(
            `https://college-notes-portal-b79p.vercel.app/api/notes/${noteId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    subject,
                    semester,
                    branch,
                    description
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Update failed");
            return;
        }

        alert("Note updated successfully");

        localStorage.removeItem("editNoteId");

        window.location.href = "myNotes.html";

    } catch (err) {
        console.error(err);
        alert("Server Error");
    }

});