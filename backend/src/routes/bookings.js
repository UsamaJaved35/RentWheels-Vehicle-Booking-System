const router = require("express").Router();
const bookingController = require("../controllers/bookingController");
const protect = require("../middleware/auth");
const { bookingRules } = require("../validators");

router.use(protect);

router.get("/", bookingController.getAll);
router.get("/:id", bookingController.getById);
router.post("/", bookingRules, bookingController.create);
router.put("/:id", bookingController.update);
router.delete("/:id", bookingController.remove);

module.exports = router;
