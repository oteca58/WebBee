const express = require("express");
const beekeeperController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();


router.post("/signup", authController.signup);
//methods for route /beekeepers
router
  .route("/")
  .get(beekeeperController.getAllBeekeepers)
  .post(beekeeperController.createBeekeeper);

// Here below the routes that we are going to implement

//.post(beekeeperController.createBeekeper);

// router
//   .route("/:id")
//   .get(beekeeperController.getBeekeeper)
//   .patch(beekeeperController.updateBeekeper)
//   .delete(beekeeperController.deleteBeekeeper);

module.exports = router;
