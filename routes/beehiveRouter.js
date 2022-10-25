const express = require("express");
const authController = require("../controllers/authController");
const beehiveController = require("../controllers/beehiveController");
const userController = require("../controllers/userController");

const router = express.Router({ mergeParams: true });

router
  .route("/beehives")
  .get(authController.protect, beehiveController.getAllBeehives)
  .post(
    authController.protect,
    authController.restrictTo("beekeeper", "admin"),
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
  .route("/:userId/mybeehives")
  .get(
    authController.protect,
    userController.getMe,
    beehiveController.getAllBeehives
  )
  .post(
    authController.protect,
    userController.getMe,
    authController.restrictTo("beekeeper", "admin"),
    beehiveController.setBeehiveBeekeeperId,
    beehiveController.createBeehive
  );

router
  .route("/:userId/mybeehives/:id")
  .get(
    authController.protect,
    userController.getMe,
    beehiveController.getBeehive
  )
  .patch(
    authController.protect,
    userController.getMe,
    beehiveController.setUpdatefromRole,
    beehiveController.updateBeehive
  )
  .delete(
    authController.protect,
    userController.getMe,
    authController.restrictTo("beekeeper"),
    beehiveController.deleteBeehive
  );

module.exports = router;
