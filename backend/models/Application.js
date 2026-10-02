const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", applicationSchema);
