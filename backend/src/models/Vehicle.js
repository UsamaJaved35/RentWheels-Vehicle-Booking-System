const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, "Make is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    licensePlate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    dailyRate: {
      type: Number,
      required: [true, "Daily rate is required"],
      min: [0, "Daily rate cannot be negative"],
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
