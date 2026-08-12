const container = document.getElementById("notesContainer");

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

async function loadMyNotes() {

    try {

        const res = await fetch("http://localhost:5000/api/notes/my", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const notes = await res.json();

        displayNotes(notes);

    } catch (err) {
        console.error(err);
        alert("Unable to load notes.");
    }

}

function displayNotes(notes) {

    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = "<h2>No Notes Uploaded Yet</h2>";
        return;
    }

    notes.forEach(note => {

        container.innerHTML += `
        <div class="card">

            <h2>${note.title}</h2>

            <p><b>Subject:</b> ${note.subject}</p>

            <p><b>Semester:</b> ${note.semester}</p>

            <p><b>Branch:</b> ${note.branch}</p>

            <p>${note.description}</p>

            <a class="btn"
               href="${note.s3Url}"
               target="_blank">
               Download
            </a>

            <button
                class="editBtn"
                onclick="editNote('${note.noteId}')">
                Edit
            </button>

            <button
                class="deleteBtn"
                onclick="deleteNote('${note.noteId}')">
                Delete
            </button>

        </div>
        `;

    });

}

async function deleteNote(noteId) {

    if (!confirm("Delete this note?")) return;

    try {

        const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await res.json();

        alert(data.message);

        loadMyNotes();

    } catch (err) {

        console.error(err);

    }

}

function editNote(noteId) {

    localStorage.setItem("editNoteId", noteId);

    window.location.href = "editNote.html";

}

loadMyNotes();