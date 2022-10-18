const express = require("express");
const beehiveController = require("../controllers/beehiveController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/updateMe", authController.protect, userController.updateMe);




router.route("/:id").get(authController.protect, beehiveController.getBeehive);

module.exports = router;
