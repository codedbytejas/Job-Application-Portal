const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMyApplications } = require("../controllers/applicationController");

// Get logged-in candidate's applications
router.get("/my-applications", authMiddleware, getMyApplications);

module.exports = router;
