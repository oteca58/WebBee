const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const beehiveRouter = require("./beehiveRouter");
const router = express.Router();

router.use("/bee/:userId", beehiveRouter);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateMe", authController.protect, userController.updateMe);

router.route("/:id").get(authController.protect, userController.getUser);

router
  .route("/getAll/test")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

module.exports = router;
