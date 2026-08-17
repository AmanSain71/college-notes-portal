const form = document.getElementById("uploadForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    status.innerHTML = "❌ Please login first";
    status.style.color = "red";
    return;
  }

  const formData = new FormData();

  formData.append("title", document.getElementById("title").value);
  formData.append("subject", document.getElementById("subject").value);
  formData.append("semester", document.getElementById("semester").value);
  formData.append("branch", document.getElementById("branch").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("file", document.getElementById("file").files[0]);

  try {
    status.innerHTML = "Uploading...";
    status.style.color = "blue";

    const res = await fetch("https://college-notes-portal-b79p.vercel.app/api/notes/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      status.innerHTML = "✅ Note Uploaded Successfully";
      status.style.color = "green";
      form.reset();
      console.log(data);
    } else {
      status.innerHTML = "❌ " + data.message;
      status.style.color = "red";
    }

  } catch (err) {
    console.error(err);
    status.innerHTML = "❌ Server Error";
    status.style.color = "red";
  }
});