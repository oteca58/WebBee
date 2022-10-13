const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();


router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.login);


router
  .route("/")
  .get(authController.protect, userController.getAllUsers);
  

router
  .route("/beekeepers")
  .get(authController.protect, userController.getAllBeekeepers)

  router
  .route("/beekeepers/:id")
  .post(authController.protect, userController.createBeekeeper)
  .delete(authController.protect, authController.restrictTo("admin", "beekeeper"), userController.deleteBeekeeper);

// Here below the routes that we are going to implement

//.post(beekeeperController.createBeekeper);

// router
//   .route("/:id")
//   .get(beekeeperController.getBeekeeper)
//   .patch(beekeeperController.updateBeekeper)
//   .delete(beekeeperController.deleteBeekeeper);

module.exports = router;
