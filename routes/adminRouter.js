const express = require("express");
const authController = require("../controllers/authController");
const beehiveController = require("./../controllers/beehiveController");
const userController = require("./../controllers/userController");
const router = express.Router();

router
  .route("/beehives")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    beehiveController.getAllBeehives
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    beehiveController.createBeehive
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    beehiveController.getBeehive
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    beehiveController.updateBeehive
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    beehiveController.deleteBeehive
  );

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

module.exports = router;
