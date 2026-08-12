# 📚 College Notes Sharing Portal

A cloud-based web application that allows students to upload, manage, and share academic notes securely using AWS Cloud Services.

---

# 📖 Project Overview

The **College Notes Sharing Portal** is a cloud-based platform developed to help students share study materials efficiently. Users can register, log in securely, upload notes, search available notes, edit or delete their own uploads, and download notes uploaded by others.

The application stores note metadata in **Amazon DynamoDB** while files are securely stored in **Amazon S3**. Authentication is implemented using **JWT**, making the platform secure and scalable.

---

# ✨ Features

* User Registration
* User Login (JWT Authentication)
* Secure Password Hashing (bcrypt)
* Upload Notes (PDF, DOC, DOCX, PPT, PPTX)
* Store Files in Amazon S3
* Store Metadata in DynamoDB
* View All Notes
* Search Notes
* Filter by Branch
* Filter by Semester
* View My Uploaded Notes
* Edit Uploaded Notes
* Delete Uploaded Notes
* Download/Open Notes

---

# ☁ AWS Services Used

## Amazon S3

* Stores uploaded notes securely
* Generates public file URLs
* Scalable cloud storage

## Amazon DynamoDB

* Stores note metadata
* Stores user information
* Fast NoSQL database

## AWS IAM

* Manages permissions
* Provides secure access to AWS resources

## Amazon EC2 *(Deployment)*

* Hosts the backend application

---

# 🛠 Technology Stack

### Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* Amazon DynamoDB

### Cloud Storage

* Amazon S3

### Authentication

* JWT
* bcrypt

### File Upload

* Multer

### AWS SDK

* AWS SDK v3

---

# 📂 Project Structure

```
College-Notes-Sharing-Portal/

│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── notes.html
│   ├── upload.html
│   ├── myNotes.html
│   └── editNote.html
│
└── README.md
```

---

# 🔄 Project Workflow

1. User registers an account.
2. User logs in and receives a JWT token.
3. User uploads a note.
4. Backend stores the file in Amazon S3.
5. Metadata is saved in DynamoDB.
6. Users can search, view, download, edit, or delete notes.

---

# 🔐 Authentication

* JWT Authentication
* Protected Routes
* Password Hashing using bcrypt

---

# 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create a `.env` file and add the required environment variables.

Start the backend:

```bash
npm run dev
```

Open the frontend pages in your browser.

---

# 🔑 Environment Variables

```
PORT=5000

JWT_SECRET=your_secret_key

AWS_REGION=your_region

AWS_ACCESS_KEY_ID=your_access_key

AWS_SECRET_ACCESS_KEY=your_secret_key

AWS_BUCKET_NAME=your_bucket

USERS_TABLE=Users

NOTES_TABLE=Notes
```

---

# 📡 API Endpoints

## Authentication

* POST /api/auth/register
* POST /api/auth/login

## Notes

* GET /api/notes
* GET /api/notes/my
* GET /api/notes/:noteId
* POST /api/notes/upload
* PUT /api/notes/:noteId
* DELETE /api/notes/:noteId

---

# 📸 Screenshots

Add screenshots of:

* Login Page
* Register Page
* Dashboard
* Upload Notes
* All Notes
* My Notes
* Edit Note

---

# 🚀 Future Enhancements

* Admin Panel
* User Profile
* Like & Rating System
* Comments on Notes
* Email Notifications
* Mobile Responsive Improvements

---

# 👨‍💻 Author

**Aman Sain**

B.Tech Project

College Notes Sharing Portal

---

# 📄 License

This project is developed for educational purposes as a university capstone project.


### AWS Lambda

AWS Lambda is integrated with Amazon S3 using Event Notifications.

Whenever a student uploads a note:

1. The file is stored in Amazon S3.
2. S3 automatically triggers the Lambda function.
3. Lambda processes the uploaded file.
4. Execution logs are stored in Amazon CloudWatch for monitoring and debugging.