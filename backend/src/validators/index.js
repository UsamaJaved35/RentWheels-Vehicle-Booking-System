const { body } = require("express-validator");

const signupRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const customerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
];

const vehicleRules = [
  body("make").trim().notEmpty().withMessage("Make is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
  body("year").isInt({ min: 1900, max: 2100 }).withMessage("Valid year is required"),
  body("licensePlate").trim().notEmpty().withMessage("License plate is required"),
  body("dailyRate")
    .isFloat({ min: 0 })
    .withMessage("Daily rate must be a positive number"),
];

const bookingRules = [
  body("customer").notEmpty().withMessage("Customer ID is required"),
  body("vehicle").notEmpty().withMessage("Vehicle ID is required"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("endDate").isISO8601().withMessage("Valid end date is required"),
];

module.exports = {
  signupRules,
  loginRules,
  customerRules,
  vehicleRules,
  bookingRules,
};
