const mongoose = require("mongoose");

const safePlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["police_station", "hospital", "help_center", "ngo"],
      required: true,
    },
    address: { type: String, required: true },
    phone: { type: String },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    is24x7: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SafePlace", safePlaceSchema);
