const { validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

exports.getAll = async (_req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone")
      .populate("vehicle", "make model licensePlate dailyRate")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("vehicle", "make model licensePlate dailyRate");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer, vehicle, startDate, endDate } = req.body;

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicleDoc.status !== "available") {
      return res.status(400).json({ message: "Vehicle is not available for booking" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const totalAmount = days * vehicleDoc.dailyRate;

    const booking = await Booking.create({
      customer,
      vehicle,
      startDate: start,
      endDate: end,
      totalAmount,
    });

    vehicleDoc.status = "booked";
    await vehicleDoc.save();

    const populated = await booking.populate([
      { path: "customer", select: "name email phone" },
      { path: "vehicle", select: "make model licensePlate dailyRate" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const { status } = req.body;

    if (status === "completed" || status === "cancelled") {
      const vehicle = await Vehicle.findById(booking.vehicle);
      if (vehicle) {
        vehicle.status = "available";
        await vehicle.save();
      }
    }

    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("customer", "name email phone")
      .populate("vehicle", "make model licensePlate dailyRate");

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const vehicle = await Vehicle.findById(booking.vehicle);
    if (vehicle && booking.status !== "completed" && booking.status !== "cancelled") {
      vehicle.status = "available";
      await vehicle.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    next(error);
  }
};
