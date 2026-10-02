const Candidate = require("../models/Candidate");
const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Candidate Registration
const registerCandidate = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    // Check if email already registered
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Candidate
    const candidate = new Candidate({
      name,
      email,
      password: hashedPassword,
      role: "candidate"
    });

    await candidate.save();

    res.status(201).json({
      message: "Candidate registered successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Candidate Login
const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find candidate by email
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: candidate._id, role: candidate.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        role: candidate.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Recruiter Registration
const registerRecruiter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    // Check if email already registered
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Recruiter
    const recruiter = new Recruiter({
      name,
      email,
      password: hashedPassword,
      role: "recruiter"
    });

    await recruiter.save();

    res.status(201).json({
      message: "Recruiter registered successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Recruiter Login
const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find recruiter by email
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: recruiter._id, role: recruiter.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        role: recruiter.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  registerCandidate,
  loginCandidate,
  registerRecruiter,
  loginRecruiter
};
