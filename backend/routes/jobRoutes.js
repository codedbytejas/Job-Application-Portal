const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createJob,
  getAllJobs,
  getMyPostedJobs,
  getJobById,
  getJobApplicants
} = require("../controllers/jobController");

const { applyToJob } = require("../controllers/applicationController");

// Create a new job (Recruiter only)
router.post("/", authMiddleware, createJob);

// Get all jobs
router.get("/", getAllJobs);

// Get jobs posted by logged-in recruiter
router.get("/recruiter/my-jobs", authMiddleware, getMyPostedJobs);

// Get single job details
router.get("/:id", getJobById);

// Get applicants for a job (Recruiter ownership checked)
router.get("/:id/applicants", authMiddleware, getJobApplicants);

// Apply to a job (Candidate only + PDF upload)
router.post("/:id/apply", authMiddleware, upload.single("resume"), applyToJob);

module.exports = router;
