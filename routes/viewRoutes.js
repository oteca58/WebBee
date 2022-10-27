const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/", viewsController.getOverview);
router.get("/beehive/:_id", viewsController.getBeehive);
router.get("/login", viewsController.getLogininForm);

module.exports = router;
