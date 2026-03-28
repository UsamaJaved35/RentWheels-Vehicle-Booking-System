require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Customer = require("./models/Customer");
const Vehicle = require("./models/Vehicle");
const Booking = require("./models/Booking");

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Customer.deleteMany(),
    Vehicle.deleteMany(),
    Booking.deleteMany(),
  ]);

  console.log("Cleared existing data");

  // Admin user (password: admin123)
  const admin = await User.create({
    name: "Admin",
    email: "admin@rentwheels.com",
    password: "admin123",
  });
  console.log("Created admin user — email: admin@rentwheels.com / password: admin123");

  // Customers
  const customers = await Customer.insertMany([
    { name: "James Wilson", email: "james.wilson@email.com", phone: "+1 555-0101", address: "42 Oak Street, Austin, TX" },
    { name: "Sarah Chen", email: "sarah.chen@email.com", phone: "+1 555-0102", address: "118 Maple Ave, Denver, CO" },
    { name: "Michael Brown", email: "michael.brown@email.com", phone: "+1 555-0103", address: "7 Pine Road, Seattle, WA" },
    { name: "Emily Davis", email: "emily.davis@email.com", phone: "+1 555-0104", address: "230 Elm Street, Portland, OR" },
    { name: "Robert Martinez", email: "robert.martinez@email.com", phone: "+1 555-0105", address: "55 Cedar Lane, Miami, FL" },
    { name: "Lisa Thompson", email: "lisa.thompson@email.com", phone: "+1 555-0106", address: "901 Birch Blvd, Chicago, IL" },
    { name: "David Kim", email: "david.kim@email.com", phone: "+1 555-0107", address: "14 Walnut Court, San Francisco, CA" },
    { name: "Amanda Johnson", email: "amanda.johnson@email.com", phone: "+1 555-0108", address: "667 Spruce Way, New York, NY" },
  ]);
  console.log(`Created ${customers.length} customers`);

  // Vehicles
  const vehicles = await Vehicle.insertMany([
    { make: "Toyota", model: "Camry", year: 2024, licensePlate: "TX-1234", color: "White", dailyRate: 45, status: "available" },
    { make: "Honda", model: "Civic", year: 2023, licensePlate: "HN-5678", color: "Silver", dailyRate: 40, status: "available" },
    { make: "BMW", model: "3 Series", year: 2024, licensePlate: "BM-9012", color: "Black", dailyRate: 85, status: "available" },
    { make: "Ford", model: "Mustang", year: 2023, licensePlate: "FM-3456", color: "Red", dailyRate: 95, status: "available" },
    { make: "Tesla", model: "Model 3", year: 2024, licensePlate: "TS-7890", color: "Blue", dailyRate: 110, status: "available" },
    { make: "Mercedes", model: "C-Class", year: 2023, licensePlate: "MB-2345", color: "Gray", dailyRate: 90, status: "maintenance" },
    { make: "Hyundai", model: "Tucson", year: 2024, licensePlate: "HY-6789", color: "White", dailyRate: 55, status: "available" },
    { make: "Chevrolet", model: "Malibu", year: 2023, licensePlate: "CH-0123", color: "Black", dailyRate: 42, status: "available" },
    { make: "Audi", model: "A4", year: 2024, licensePlate: "AU-4567", color: "Navy", dailyRate: 88, status: "available" },
    { make: "Nissan", model: "Altima", year: 2023, licensePlate: "NS-8901", color: "Silver", dailyRate: 38, status: "available" },
  ]);
  console.log(`Created ${vehicles.length} vehicles`);

  // Bookings — mix of statuses
  const bookings = [
    { customer: customers[0]._id, vehicle: vehicles[0]._id, startDate: "2026-03-10", endDate: "2026-03-15", totalAmount: 5 * 45, status: "completed" },
    { customer: customers[1]._id, vehicle: vehicles[2]._id, startDate: "2026-03-12", endDate: "2026-03-18", totalAmount: 6 * 85, status: "completed" },
    { customer: customers[2]._id, vehicle: vehicles[3]._id, startDate: "2026-03-20", endDate: "2026-03-25", totalAmount: 5 * 95, status: "completed" },
    { customer: customers[3]._id, vehicle: vehicles[4]._id, startDate: "2026-03-25", endDate: "2026-04-01", totalAmount: 7 * 110, status: "active" },
    { customer: customers[4]._id, vehicle: vehicles[1]._id, startDate: "2026-03-28", endDate: "2026-04-02", totalAmount: 5 * 40, status: "active" },
    { customer: customers[5]._id, vehicle: vehicles[6]._id, startDate: "2026-03-29", endDate: "2026-04-03", totalAmount: 5 * 55, status: "active" },
    { customer: customers[6]._id, vehicle: vehicles[7]._id, startDate: "2026-04-01", endDate: "2026-04-05", totalAmount: 4 * 42, status: "pending" },
    { customer: customers[7]._id, vehicle: vehicles[8]._id, startDate: "2026-04-02", endDate: "2026-04-07", totalAmount: 5 * 88, status: "pending" },
    { customer: customers[0]._id, vehicle: vehicles[9]._id, startDate: "2026-03-05", endDate: "2026-03-08", totalAmount: 3 * 38, status: "completed" },
    { customer: customers[1]._id, vehicle: vehicles[0]._id, startDate: "2026-02-20", endDate: "2026-02-25", totalAmount: 5 * 45, status: "cancelled" },
  ];

  const createdBookings = await Booking.insertMany(bookings);
  console.log(`Created ${createdBookings.length} bookings`);

  // Mark vehicles with active/pending bookings as "booked"
  const bookedVehicleIds = bookings
    .filter((b) => b.status === "active" || b.status === "pending")
    .map((b) => b.vehicle);

  await Vehicle.updateMany(
    { _id: { $in: bookedVehicleIds } },
    { status: "booked" }
  );
  console.log("Updated booked vehicle statuses");

  console.log("\n--- Seed complete ---");
  console.log("Login: admin@rentwheels.com / admin123\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
