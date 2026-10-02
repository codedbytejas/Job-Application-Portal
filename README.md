# Job Application Portal (Full-Stack Recruitment Platform)

A modern, production-deployed recruitment platform connecting Job Candidates with Enterprise Recruiters. Features secure JWT authentication, role-based access control, Multer PDF resume uploads, duplicate application prevention, recruiter job ownership checks, and MongoDB Atlas cloud database integration.

---

## 🌐 Live Deployment & Production Links

| Component | Platform / Host | Live Production URL |
| :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** (Global Edge CDN) | [https://job-application-portal-psi.vercel.app/](https://job-application-portal-psi.vercel.app/) |
| **Backend REST API** | **Render** (Cloud Web Service) | [https://job-portal-backend-nkp4.onrender.com](https://job-portal-backend-nkp4.onrender.com) |
| **Cloud Database** | **MongoDB Atlas** (Dedicated Cluster) | `mongodb+srv://...` (AWS Cloud) |

### 🚀 Deployment Architecture & Infrastructure
- **Frontend (Vercel)**: Built with **React.js & Vite**, deployed on Vercel's Edge Network for sub-second global asset delivery. Includes client-side routing rewrites (`vercel.json`) to prevent 404s on browser reloads.
- **Backend (Render)**: Hosted as a cloud **Node.js & Express** service. Handles API routing, secure bcrypt password hashing, JWT session signing/verification, and Multer file upload storage.
- **Database (MongoDB Atlas)**: Remote database cluster storing Candidates, Recruiters, Job Openings, and Application records with Mongoose relational population.
- **Security & Networking**: Configured with strict CORS policies, environment variable encryption, and bearer token authorization across all sensitive endpoints.

---

## 📌 Project Overview & Key Features

### 👤 Candidate (Job Seeker)
- **Register & Login**: Password hashing using `bcryptjs` (10 salt rounds) with JWT session tokens.
- **Browse & Filter Openings**: Dynamic search by keywords, location, employment type, experience level, and compensation.
- **Role Details**: Rich view of responsibilities, requirements, qualifications, and company background.
- **1-Click PDF Resume Application**: Direct multipart resume file upload powered by Multer.
- **Automated Duplicate Prevention**: System automatically checks prior submissions and rejects duplicates with HTTP 400 (*"You have already applied for this job."*).
- **Candidate Workspace**: Track real-time status of submitted applications, saved bookmarks, and profile details.

### 👔 Recruiter (Employer)
- **Dedicated Recruiter Authentication**: Separate recruiter onboarding and session management.
- **Job Publishing**: Create verified job postings with location, tech stack requirements, and description.
- **Recruiter Hub**: Manage only jobs created by the authenticated recruiter.
- **ATS Candidate Pipeline**: Review applicants per position, view/download submitted PDF resumes, and transition applicant hiring stages (Submitted, Reviewing, Shortlisted, Interview, Hired).
- **Strict Ownership Verification**: Enforces authorization checks ensuring recruiters cannot access applicant data belonging to other employers (returns HTTP 403: *"You are not authorized to view these applicants."*).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Modern Responsive CSS, Custom SVG Icon Suite
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose ODM, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `multer`, `cors`, `dotenv`
- **Deployment & DevOps**: Vercel (Frontend), Render (Backend), MongoDB Atlas (Database), Git & GitHub CI/CD

---

## 📂 Repository Structure

```text
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
│   ├── seed.js                   # MongoDB Atlas sample data seeder
│   ├── server.js                 # Express app entry point
│   ├── postman_collection.json   # Ready-to-import Postman API collection
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Role-aware navigation bar
│   │   │   ├── JobCard.jsx       # Job display card
│   │   │   ├── Icons.jsx         # Clean SVG icon suite
│   │   │   ├── CompanyModal.jsx  # Employer details modal
│   │   │   ├── ShareModal.jsx    # Social & direct link sharing
│   │   │   ├── Toast.jsx         # Notification alerts
│   │   │   └── Footer.jsx        # Footer component
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero search, sectors, featured roles
│   │   │   ├── Jobs.jsx          # Public/candidate jobs list with filters
│   │   │   ├── JobDetails.jsx    # Job info + PDF resume upload
│   │   │   ├── CandidateDashboard.jsx # Applied jobs tracker & bookmarks
│   │   │   ├── RecruiterDashboard.jsx # Recruiter posted jobs hub
│   │   │   ├── Applicants.jsx    # ATS candidate pipeline & resume viewer
│   │   │   ├── AddJob.jsx        # Post job form with live preview
│   │   │   ├── Login.jsx         # Role selection login
│   │   │   └── Register.jsx      # Role selection registration
│   │   ├── utils/
│   │   │   ├── appliedJobs.js    # Application synchronization helper
│   │   │   ├── recruiterStorage.js # Candidate ATS stage override storage
│   │   │   └── savedJobs.js      # Bookmarked jobs local helper
│   │   ├── data/
│   │   │   └── demoJobs.js       # Curated market data & company profiles
│   │   ├── App.jsx               # React Router config
│   │   ├── main.jsx              # Vite entry point
│   │   └── App.css               # Clean professional styling
│   ├── vercel.json               # SPA rewrites config for Vercel
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── README.md
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed sample data to MongoDB Atlas
npm run seed

# Start development server
npm run dev
```
*Backend runs locally on `http://localhost:5001`.*

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs locally on `http://localhost:3000`.*

---

## 🔐 Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/job_portal?retryWrites=true&w=majority
JWT_SECRET=mysecretkey123456
UPLOAD_PATH=uploads
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://job-portal-backend-nkp4.onrender.com/api
# Or for local development:
# VITE_API_URL=http://localhost:5001/api
```

---

## 📡 API Endpoints Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/candidate/register` | Register Candidate account | No |
| `POST` | `/api/auth/candidate/login` | Login Candidate & receive JWT | No |
| `POST` | `/api/auth/recruiter/register` | Register Recruiter account | No |
| `POST` | `/api/auth/recruiter/login` | Login Recruiter & receive JWT | No |

### 2. Jobs (`/api/jobs`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/jobs` | Post new job opening | Yes (Recruiter) |
| `GET` | `/api/jobs` | Get all active job listings | No / Public |
| `GET` | `/api/jobs/recruiter/my-jobs` | Get jobs posted by logged-in recruiter | Yes (Recruiter) |
| `GET` | `/api/jobs/:id` | Get single job details by ID | No / Public |
| `GET` | `/api/jobs/:id/applicants` | View applicants for job (Ownership verified) | Yes (Recruiter Owner) |
| `POST` | `/api/jobs/:id/apply` | Apply to job with PDF resume upload | Yes (Candidate) |

### 3. Applications (`/api/applications`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/applications/my-applications` | Get candidate's submitted applications | Yes (Candidate) |

---

## 🧪 Testing with Postman
Import the file [`backend/postman_collection.json`](file:///Users/tejaschavan1907/Desktop/BACKEND%20SEM3/backend/postman_collection.json) into Postman:
1. Register/Login as **Recruiter** $\rightarrow$ copy `token`.
2. Create Job via `POST /api/jobs` with `Authorization: Bearer <recruiter_token>`.
3. Register/Login as **Candidate** $\rightarrow$ copy `token`.
4. Apply via `POST /api/jobs/:id/apply` (form-data: `resume` file in PDF format).
5. Verify duplicate restriction: Re-send application $\rightarrow$ receives `400 Bad Request`.
6. Inspect applicants: Call `GET /api/jobs/:id/applicants` with Recruiter token $\rightarrow$ verify candidate info & resume path are returned.
