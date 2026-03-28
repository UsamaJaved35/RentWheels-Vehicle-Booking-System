const router = require("express").Router();
const vehicleController = require("../controllers/vehicleController");
const protect = require("../middleware/auth");
const { vehicleRules } = require("../validators");

router.use(protect);

router.get("/", vehicleController.getAll);
router.get("/:id", vehicleController.getById);
router.post("/", vehicleRules, vehicleController.create);
router.put("/:id", vehicleRules, vehicleController.update);
router.delete("/:id", vehicleController.remove);

module.exports = router;
