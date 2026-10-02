const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply to a job (Candidate only)
const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply for jobs." });
    }

    const jobId = req.params.id;

    // 1. Check that the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // 2. Check that a resume was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload your resume." });
    }

    // 3. Check whether candidate already applied (Duplicate application check)
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job."
      });
    }

    // 4. Create application
    const application = new Application({
      job: jobId,
      candidate: req.user.userId,
      resume: req.file.filename
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get candidate's applied jobs
const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Access denied. Candidates only." });
    }

    const applications = await Application.find({ candidate: req.user.userId })
      .populate("job")
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications
};
