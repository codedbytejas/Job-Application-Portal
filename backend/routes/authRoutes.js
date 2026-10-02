const express = require("express");
const router = express.Router();
const {
  registerCandidate,
  loginCandidate,
  registerRecruiter,
  loginRecruiter
} = require("../controllers/authController");

// Candidate Auth Routes
router.post("/candidate/register", registerCandidate);
router.post("/candidate/login", loginCandidate);

// Recruiter Auth Routes
router.post("/recruiter/register", registerRecruiter);
router.post("/recruiter/login", loginRecruiter);

module.exports = router;
