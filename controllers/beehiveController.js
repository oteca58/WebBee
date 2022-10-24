const Beehive = require("./../models/beehiveModel");
const factory = require("./handlerFactory");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");

exports.setBeehiveBeekeeperId = (req, res, next) => {
  //Allow nested routes
  if(!req.body.serial_beekeeper) req.body.serial_beekeeper = req.params.userId;
  next(); 
}

exports.createBeehive = factory.createOne(Beehive);
exports.deleteBeehive = factory.deleteOne(Beehive);
exports.updateBeehive = factory.updateOne(Beehive);
exports.getBeehive = factory.getOne(Beehive);
exports.getAllBeehives = factory.getAll(Beehive);