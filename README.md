# Job Application Portal (College Backend Project)

A complete full-stack web application built for a college Backend Development project. It connects Job Candidates with Recruiters, featuring JWT authentication, role-based authorization, PDF resume uploads using Multer, duplicate application prevention, and secure recruiter job ownership checks.

---

## 📌 Project Overview & Features

### 👤 Candidate (Job Seeker)
- **Register & Login** with secure hashed passwords (bcryptjs).
- **Browse Jobs**: View all active job listings with company, location, and details.
- **Job Details**: Read full role descriptions.
- **Apply with PDF Resume**: Upload PDF resume directly via Multer (multipart/form-data).
- **Duplicate Prevention**: Cannot apply to the same job more than once (returns clear error: *"You have already applied for this job."*).
- **Candidate Dashboard**: Track submitted applications and application dates.

### 👔 Recruiter (Employer)
- **Register & Login** with dedicated recruiter credentials.
- **Post Jobs**: Create job openings with title, company, location, and description.
- **Recruiter Dashboard**: View only jobs posted by the logged-in recruiter.
- **View Applicants & Resumes**: Access applicants who applied to their posted jobs and inspect/download PDF resumes.
- **Ownership Authorization Check**: Cannot view applicants of jobs created by other recruiters (returns 403: *"You are not authorized to view these applicants."*).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `multer`, `dotenv`, `cors`
- **Frontend**: React.js (Vite), React Router v6, Axios, Plain CSS

---

## 📂 Project Structure

```
BACKEND SEM3/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # Register & Login for Candidate and Recruiter
│   │   ├── jobController.js      # Job CRUD & Recruiter ownership checks
│   │   └── applicationController.js # Apply to jobs & duplicate check
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token verification
│   │   └── uploadMiddleware.js   # Multer PDF file filter and storage
│   ├── models/
│   │   ├── Candidate.js          # Candidate schema (name, email, password, role)
│   │   ├── Recruiter.js          # Recruiter schema (name, email, password, role)
│   │   ├── Job.js                # Job schema (title, company, recruiter ObjectId)
│   │   └── Application.js        # Application schema (job, candidate ObjectId, resume)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── jobRoutes.js          # /api/jobs routes
│   │   └── applicationRoutes.js  # /api/applications routes
│   ├── uploads/                  # Uploaded PDF resumes directory
│   ├── .env                      # Environment config
│   ├── .env.example              # Example environment variables
│   ├── server.js                 # Express app entry point
│   ├── postman_collection.json   # Ready-to-import Postman collection
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Role-aware navigation bar
│   │   │   └── JobCard.jsx       # Job display card
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Role selection login
│   │   │   ├── Register.jsx      # Role selection registration
│   │   │   ├── Jobs.jsx          # Public/candidate jobs list
│   │   │   ├── JobDetails.jsx    # Job info + PDF resume upload
│   │   │   ├── CandidateDashboard.jsx # Applied jobs tracker
│   │   │   ├── RecruiterDashboard.jsx # Recruiter posted jobs
│   │   │   ├── AddJob.jsx        # Post job form
│   │   │   └── Applicants.jsx    # View applicants with resumes
│   │   ├── App.jsx               # React Router config
│   │   ├── main.jsx              # Vite entry point
│   │   └── App.css               # Clean styling
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── README.md
└── README.md
```

---

## ⚙️ Installation & Running the Project

### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
# Or standard run:
# npm start
```
*Backend runs on `http://localhost:5001`.*

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=mysecretkey123456
UPLOAD_PATH=uploads
```
*(For MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/job_portal?retryWrites=true&w=majority`)*

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📡 API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/candidate/register` | Register Candidate | No |
| `POST` | `/api/auth/candidate/login` | Login Candidate | No |
| `POST` | `/api/auth/recruiter/register` | Register Recruiter | No |
| `POST` | `/api/auth/recruiter/login` | Login Recruiter | No |

### 2. Jobs (`/api/jobs`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/jobs` | Post new job | Yes (Recruiter) |
| `GET` | `/api/jobs` | Get all jobs | Yes |
| `GET` | `/api/jobs/recruiter/my-jobs` | Get jobs posted by logged-in recruiter | Yes (Recruiter) |
| `GET` | `/api/jobs/:id` | Get job by ID | Yes |
| `GET` | `/api/jobs/:id/applicants` | View applicants for job (ownership verified) | Yes (Recruiter Owner) |
| `POST` | `/api/jobs/:id/apply` | Apply to job with PDF resume upload | Yes (Candidate) |

### 3. Applications (`/api/applications`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/applications/my-applications` | Get candidate's applications | Yes (Candidate) |

---

## 📄 Key Implementation Highlights

### 1. Duplicate Application Prevention
Before creating an application, the backend queries MongoDB:
```javascript
const existingApplication = await Application.findOne({
  job: req.params.id,
  candidate: req.user.userId
});

if (existingApplication) {
  return res.status(400).json({
    message: "You have already applied for this job."
  });
}
```

### 2. Recruiter Ownership Authorization
When a recruiter requests applicants for a job:
```javascript
const job = await Job.findById(req.params.id);

if (!job) {
  return res.status(404).json({ message: "Job not found." });
}

// Ensure logged-in recruiter matches job creator
if (job.recruiter.toString() !== req.user.userId) {
  return res.status(403).json({
    message: "You are not authorized to view these applicants."
  });
}

const applications = await Application.find({ job: req.params.id })
  .populate("candidate", "name email");
```

### 3. Multer PDF Resume Upload
Multer is configured to validate file types strictly for PDFs and store them in `backend/uploads/`:
```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};
```

---

## 🧪 Testing with Postman
Import the provided file `backend/postman_collection.json` into Postman:
1. Register and login as a **Recruiter** -> copy `token`.
2. Set header `Authorization: Bearer <recruiter_token>` on `POST /api/jobs` to create a job -> copy `_id`.
3. Register and login as a **Candidate** -> copy `token`.
4. Set header `Authorization: Bearer <candidate_token>` on `POST /api/jobs/<job_id>/apply`.
   - Body mode: `form-data`
   - Key: `resume` (File, select a `.pdf` file)
5. Test duplicate check: Send the apply request again -> verify `400 Bad Request: "You have already applied for this job."`.
6. Switch back to Recruiter token: Call `GET /api/jobs/<job_id>/applicants` -> verify candidate and resume are returned.
