const express = require("express");
const beekeeperController = require("./../controllers/beekeeperController");
const authController = require("../controllers/authController");
const router = express.Router();
  

router
  .route("/")
  .get(authController.protect, authController.restrictTo("admin"), beekeeperController.getAllBeekeepers)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    beekeeperController.createBeekeeper
  );

router
  .route("/:id")
  .get(authController.protect, authController.restrictTo("admin", "beekeeper"), beekeeperController.getBeekeeperById)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "beekeeper"),
    beekeeperController.updateBeekeeper
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "beekeeper"),
    beekeeperController.deleteBeekeeper
  );

module.exports = router;