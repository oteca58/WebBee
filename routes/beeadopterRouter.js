const express = require("express");
const beeadopterController = require("./../controllers/beeadopterController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, authController.restrictTo("admin"), beeadopterController.getAllBeeadopters);

router
  .route("/:id")
  .get(authController.protect, authController.restrictTo("user", "admin"), beeadopterController.getBeeadopter);

module.exports = router;