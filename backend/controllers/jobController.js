const Job = require("../models/Job");
const Application = require("../models/Application");

// Create a new job (Recruiter only)
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs." });
    }

    const { title, description, company, location } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      recruiter: req.user.userId
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate("recruiter", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get jobs created by logged-in recruiter
const getMyPostedJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied. Recruiters only." });
    }

    const jobs = await Job.find({ recruiter: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get applicants for a specific job (Recruiter Ownership Verified)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found."
      });
    }

    // Ownership check: logged in recruiter must match the job's recruiter
    if (job.recruiter.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to view these applicants."
      });
    }

    const applications = await Application.find({
      job: req.params.id
    }).populate("candidate", "name email");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getMyPostedJobs,
  getJobById,
  getJobApplicants
};
