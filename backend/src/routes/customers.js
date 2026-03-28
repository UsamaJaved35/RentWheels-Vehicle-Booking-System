const router = require("express").Router();
const customerController = require("../controllers/customerController");
const protect = require("../middleware/auth");
const { customerRules } = require("../validators");

router.use(protect);

router.get("/", customerController.getAll);
router.get("/:id", customerController.getById);
router.post("/", customerRules, customerController.create);
router.put("/:id", customerRules, customerController.update);
router.delete("/:id", customerController.remove);

module.exports = router;
