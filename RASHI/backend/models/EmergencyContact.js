const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, trim: true },
    email: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);
