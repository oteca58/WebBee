const express = require("express");
const beehiveController = require("./../controllers/beehiveController");
const authController = require('../controllers/authController')
const router = express.Router();

//methods for route /beehive

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassord', authController.forgotPassword)
router.post('/resetPassword', authController.login)


router
  .route("/")
  .get(authController.protect, beehiveController.getAllBeehives)
  .post(authController.protect, beehiveController.createBeehive)

router
  .route("/:id")
  .get(beehiveController.getBeehive)
  .patch(beehiveController.updateBeehive)
  .delete(authController.protect, authController.restrictTo('admin'), beehiveController.deleteBeehive)

module.exports = router;
