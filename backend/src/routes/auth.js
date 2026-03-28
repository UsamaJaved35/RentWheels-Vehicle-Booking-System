const router = require("express").Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/auth");
const { signupRules, loginRules } = require("../validators");

router.post("/signup", signupRules, authController.signup);
router.post("/login", loginRules, authController.login);
router.get("/me", protect, authController.getMe);

module.exports = router;
