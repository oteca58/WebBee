const express = require("express");
const beehiveController = require("./../controllers/beehiveController");
const authController = require("../controllers/authController");

const router = express.Router();

//methods for route /beehive
router
  .route("/")
  .get(authController.protect, beehiveController.getAllBeehives)
  .post(authController.protect, beehiveController.createBeehive);

router
  .route("/:id")
  .get(authController.protect, beehiveController.getBeehive)
  .patch(authController.protect, beehiveController.updateBeehive)
  .delete(authController.protect, authController.restrictTo("admin", "beekeeper"), beehiveController.deleteBeehive);

module.exports = router;
