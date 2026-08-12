const container = document.getElementById("notesContainer");

const search = document.getElementById("search");
const branchFilter = document.getElementById("branchFilter");
const semesterFilter = document.getElementById("semesterFilter");

let allNotes = [];

async function loadNotes() {

    try {

        const res = await fetch("http://localhost:5000/api/notes");

        allNotes = await res.json();

        displayNotes(allNotes);

    } catch (err) {

        console.log(err);

    }

}

function displayNotes(notes) {

    container.innerHTML = "";

    if(notes.length===0){

        container.innerHTML="<h3>No Notes Found</h3>";
        return;

    }

    const loggedInUser = localStorage.getItem("email");

    notes.forEach(note => {

    container.innerHTML += `

    <div class="card">

        <h2>${note.title}</h2>

        <p><b>Subject:</b> ${note.subject}</p>

        <p><b>Semester:</b> ${note.semester}</p>

        <p><b>Branch:</b> ${note.branch}</p>

        <p>${note.description}</p>

        <button
        class="btn"
        onclick="downloadNote('${note.noteId}')">
        Download PDF
        </button>

        ${note.uploadedBy === loggedInUser ? `
        <button
        class="deleteBtn"
        onclick="deleteNote('${note.noteId}')">
        Delete
        </button>
        ` : ""}
    </div>

    `;

});
    

}

function filterNotes(){

    let filtered = allNotes.filter(note=>{

        const matchSearch = note.title.toLowerCase().includes(search.value.toLowerCase());

        const matchBranch = branchFilter.value==="" || note.branch===branchFilter.value;

        const matchSemester = semesterFilter.value==="" || note.semester===semesterFilter.value;

        return matchSearch && matchBranch && matchSemester;

    });

    displayNotes(filtered);

}

search.addEventListener("input",filterNotes);

branchFilter.addEventListener("change",filterNotes);

semesterFilter.addEventListener("change",filterNotes);

loadNotes();

async function deleteNote(noteId) {

    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {

        const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        alert(data.message);

        loadNotes();

    } catch (err) {
        console.log(err);
    }
}

async function downloadNote(noteId) {

    try {

        const res = await fetch(
            `http://localhost:5000/api/notes/${noteId}/download`
        );

        const data = await res.json();

        if(data.downloadUrl){
            window.open(data.downloadUrl, "_blank");
        }else{
            alert("Download failed");
        }

    } catch (err) {

        console.log(err);

    }

}