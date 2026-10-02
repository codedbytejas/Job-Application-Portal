const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploaded resume files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// Root endpoint test
app.get("/", (req, res) => {
  res.send("Job Application Portal API is running...");
});

// Multer and general error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
