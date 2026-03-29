const { validationResult } = require("express-validator");
const Customer = require("../models/Customer");
const Booking = require("../models/Booking");

exports.getAll = async (_req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
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

    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const activeBookings = await Booking.countDocuments({
      customer: req.params.id,
      status: { $in: ["active", "pending"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: "Cannot delete customer with active or pending bookings",
      });
    }

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted" });
  } catch (error) {
    next(error);
  }
};
