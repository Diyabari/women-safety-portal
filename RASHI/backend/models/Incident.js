const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["harassment", "stalking", "assault", "unsafe_area", "other"],
      default: "other",
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    isAnonymous: { type: Boolean, default: false },
    evidenceFiles: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "under_review", "verified", "resolved", "rejected"],
      default: "pending",
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
