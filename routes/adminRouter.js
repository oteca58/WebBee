const express = require("express");
const authController = require("../controllers/authController");
const beehiveController = require("./../controllers/beehiveController");
const router = express.Router();

router
    .route("/")
    .get(authController.protect, authController.restrictTo("admin"), beehiveController.getAllBeehives)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        beehiveController.createBeehive
      );

router
    .route("/:id")
    .get(authController.protect, beehiveController.getBeehive)
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
    
module.exports = router;