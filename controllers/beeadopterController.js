const Beeadopter = require("./../models/beeadopterModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBeeadopters = catchAsync(async (req, res, next) => {
  const allBeeadopters = await Beeadopter.find(req.query);

  if (!allBeeadopters) {
    return next(new AppError("no Beeadopters found"));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: allBeeadopters.length,
    data: {
      allBeeadopters,
    },
  });
});

exports.getBeeadopter = catchAsync(async (req, res, next) => {
    const myBeeadopter = await Beeadopter.findById(req.params.id);

    // if Id is grammatical correct but doesn't exist 
    if(!myBeeadopter){
      return next(new AppError('no Beeadopters found with that ID'))
    };

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        myBeeadopter,
      },
    });
});