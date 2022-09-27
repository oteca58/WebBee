const express = require("express");
const beekeeperController = require("./../controllers/beekeeperController");

const router = express.Router();

router.route("/").get(beekeeperController.getAllBeekeepers);

router.route("/create-beekeeper").post(beekeeperController.createBeekeeper);

// Here below the routes that we are going to implement

//.post(beekeeperController.createBeekeper);

// router
//   .route("/:id")
//   .get(beekeeperController.getBeekeeper)
//   .patch(beekeeperController.updateBeekeper)
//   .delete(beekeeperController.deleteBeekeeper);

module.exports = router;
