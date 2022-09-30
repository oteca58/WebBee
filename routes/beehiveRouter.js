const express = require("express");
const beehiveController = require("./../controllers/beehiveController");

const router = express.Router();

//methods for route /beehive
router
  .route("/")
  .get(beehiveController.getAllBeehives)
  .post(beehiveController.createBeehive);

router
  .route("/:id")
  .get(beehiveController.getBeehive)
  .patch(beehiveController.updateBeehive)
  .delete(beehiveController.deleteBeehive);

module.exports = router;
