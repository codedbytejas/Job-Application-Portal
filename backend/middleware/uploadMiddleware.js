const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate clean unique filename
    const uniqueSuffix = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueSuffix);
  }
});

// File filter - Only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  }
});

module.exports = upload;
