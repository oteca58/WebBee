const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();


router.post("/signup", authController.signup);
router.post("/login", authController.login);
//methods for route /beekeepers
router
  .route("/")
  .get(authController.protect, userController.getAllUsers);
  

router
  .route("/beekeepers")
  .get(authController.protect, userController.getAllBeekeepers)
  .post(authController.protect, userController.createBeekeeper);

// Here below the routes that we are going to implement

//.post(beekeeperController.createBeekeper);

// router
//   .route("/:id")
//   .get(beekeeperController.getBeekeeper)
//   .patch(beekeeperController.updateBeekeper)
//   .delete(beekeeperController.deleteBeekeeper);

module.exports = router;
