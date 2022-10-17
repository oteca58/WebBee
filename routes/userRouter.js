const express = require("express");
const beehiveController = require("../controllers/beehiveController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.login);


router.route("/:id").get(authController.protect, beehiveController.getBeehive);

module.exports = router;
