const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

exports.getStats = async (_req, res, next) => {
  try {
    const [totalBookings, totalCustomers, totalVehicles, revenueResult] =
      await Promise.all([
        Booking.countDocuments(),
        Customer.countDocuments(),
        Vehicle.countDocuments(),
        Booking.aggregate([
          { $match: { status: { $in: ["active", "completed"] } } },
          { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
        ]),
      ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const availableVehicles = await Vehicle.countDocuments({ status: "available" });

    const recentBookings = await Booking.find()
      .populate("customer", "name")
      .populate("vehicle", "make model")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBookings,
      totalCustomers,
      totalVehicles,
      availableVehicles,
      totalRevenue,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};
