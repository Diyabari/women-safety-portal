const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    message: { type: String, default: "Emergency! I need help." },
    contactsNotified: [{ type: mongoose.Schema.Types.ObjectId, ref: "EmergencyContact" }],
    status: { type: String, enum: ["active", "resolved", "cancelled"], default: "active" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOSAlert", sosAlertSchema);
