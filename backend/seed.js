const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const Candidate = require("./models/Candidate");
const Recruiter = require("./models/Recruiter");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    // Clear existing collections
    console.log("Clearing existing data...");
    await Candidate.deleteMany({});
    await Recruiter.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // Hash common password
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("Password@123", salt);

    // 1. Create Sample Recruiters
    console.log("Seeding Recruiters...");
    const recruiters = await Recruiter.insertMany([
      {
        name: "Sarah Miller (Google)",
        email: "sarah.recruiter@google.com",
        password: defaultPassword,
        role: "recruiter"
      },
      {
        name: "David Chen (Microsoft)",
        email: "david.chen@microsoft.com",
        password: defaultPassword,
        role: "recruiter"
      },
      {
        name: "Elena Rostova (Stripe)",
        email: "elena@stripe.com",
        password: defaultPassword,
        role: "recruiter"
      }
    ]);

    // 2. Create Sample Candidates
    console.log("Seeding Candidates...");
    const candidates = await Candidate.insertMany([
      {
        name: "Alex Johnson",
        email: "alex.johnson@gmail.com",
        password: defaultPassword,
        role: "candidate"
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        password: defaultPassword,
        role: "candidate"
      },
      {
        name: "Michael Brown",
        email: "michael.brown@gmail.com",
        password: defaultPassword,
        role: "candidate"
      }
    ]);

    // 3. Create Sample Jobs
    console.log("Seeding Jobs...");
    const jobs = await Job.insertMany([
      {
        title: "Senior Full Stack Engineer",
        company: "Google",
        location: "Mountain View, CA (Hybrid)",
        description: "We are looking for a Senior Full Stack Engineer proficient in React, Node.js, and Cloud Infrastructure to build scalable web applications.",
        recruiter: recruiters[0]._id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Frontend React Developer",
        company: "Microsoft",
        location: "Seattle, WA (Remote)",
        description: "Join our core product team building high-performance design systems, modern responsive interfaces, and accessible web experiences.",
        recruiter: recruiters[1]._id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Backend Platform Engineer",
        company: "Stripe",
        location: "San Francisco, CA (On-site)",
        description: "Design and implement resilient microservices, payment processing pipelines, and REST/GraphQL APIs with high availability requirements.",
        recruiter: recruiters[2]._id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: "DevOps & Cloud Engineer",
        company: "Google",
        location: "New York, NY (Hybrid)",
        description: "Manage Kubernetes clusters, CI/CD pipelines, and multi-region cloud deployments with a focus on observability and security.",
        recruiter: recruiters[0]._id,
        createdAt: new Date()
      }
    ]);

    // 4. Create Sample Applications
    console.log("Seeding Applications...");
    await Application.insertMany([
      {
        job: jobs[0]._id,
        candidate: candidates[0]._id,
        resume: "sample-resume-alex.pdf",
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        job: jobs[1]._id,
        candidate: candidates[0]._id,
        resume: "sample-resume-alex.pdf",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        job: jobs[3]._id,
        candidate: candidates[0]._id,
        resume: "sample-resume-alex.pdf",
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        job: jobs[1]._id,
        candidate: candidates[1]._id,
        resume: "sample-resume-priya.pdf",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        job: jobs[2]._id,
        candidate: candidates[2]._id,
        resume: "sample-resume-michael.pdf",
        appliedAt: new Date()
      }
    ]);

    console.log("\n==========================================");
    console.log("✅ Sample Data Seeded Successfully!");
    console.log("==========================================");
    console.log("Credentials for testing (Password: Password@123 for all):");
    console.log("------------------------------------------");
    console.log("Recruiters:");
    recruiters.forEach(r => console.log(` - ${r.name}: ${r.email}`));
    console.log("Candidates:");
    candidates.forEach(c => console.log(` - ${c.name}: ${c.email}`));
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
