const Beehive = require("./../models/beehiveModel");
const factory = require("./handlerFactory");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");

exports.setBeehiveBeekeeperId = (req, res, next) => {
  //Allow nested routes
  if (!req.body.serial_beekeeper) req.body.serial_beekeeper = req.params.userId;
  next();
};

exports.setUpdatefromRole = async (req, res, next) => {
  let query = User.findById(req.params.userId);
  const doc = await query;

  if (doc.role === "beekeeper") {
    if (!req.body.beeadopter) {
      next();
    } else {
      res.status(401).json({
        message:
          "You are a beekeeper, don't have permission to modify 'beeadopter' field",
      });
    }
  } else if (doc.role === "beeadopter") {
    if (req.body.beeadopter) {
      next();
    } else {
      res.status(401).json({
        message:
          "You are a beeadopter, don't have permission to modify another fields",
      });
    }
  }
};

exports.createBeehive = factory.createOne(Beehive);
exports.deleteBeehive = factory.deleteOne(Beehive);
exports.updateBeehive = factory.updateOne(Beehive);
exports.getBeehive = factory.getOne(Beehive);
exports.getAllBeehives = factory.getAll(Beehive);
