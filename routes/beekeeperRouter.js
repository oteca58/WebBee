const express = require("express");
const beekeeperController = require("./../controllers/beekeeperController");
const authController = require("./../controllers/authController");


const router = express.Router();

//methods for route /beekeepers
router
  .route("/")
  .get(authController.protect, beekeeperController.getAllBeekeepers)
  .post(beekeeperController.createBeekeeper);

// Here below the routes that we are going to implement

//.post(beekeeperController.createBeekeper);

router
  .route("/:id")
  .get(beekeeperController.getBeekeeper)
  .patch(beekeeperController.updateBeekeeper)
  .delete(beekeeperController.deleteBeekeeper);

module.exports = router;
