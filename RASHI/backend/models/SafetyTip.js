const mongoose = require("mongoose");

const safetyTipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "self_defense",
        "travel",
        "digital_safety",
        "workplace",
        "general",
      ],
      default: "general",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SafetyTip", safetyTipSchema);