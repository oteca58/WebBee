const express = require("express");
const beehiveController = require("./../controllers/beehiveController");

const router = express.Router();

//methods for route /beehive
router
  .route("/")
  .get(beehiveController.getAllBeehives)
  .post(beehiveController.createBeehive);

module.exports = router;
