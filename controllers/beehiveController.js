const Beehive = require("./../models/beehiveModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBeehives = catchAsync(async (req, res, next) => {
    const allBeehives = await Beehive.find(req.query);

    if(!allBeehives){
      return next(new AppError('no Beehives found with that ID'))
    };

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: allBeehives.length,
      data: {
        allBeehives,
      },
    });
});


exports.createBeehive = catchAsync(async (req, res, next) => {
    const newBeehive = await Beehive.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        beekeeper: newBeehive,
      },
});
});

exports.getBeehive = catchAsync(async (req, res, next) => {
    const myBeehive = await Beehive.findById(req.params.id);

    // if Id is grammatical correct but doesn't exist 
    if(!myBeehive){
      return next(new AppError('no Beehives found with that ID'))
    };

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        myBeehive,
      },
    });
});

//Insert message to header/response : deleted beehive
exports.deleteBeehive = catchAsync(async (req, res, next) => {
    const myBeehive = await Beehive.findByIdAndDelete(req.params.id);

    // if ID is grammatical correct but doesn't exist 
    if (!myBeehive) {
      return next(new AppError("No Beehive found", 404))
    }

    res.status(200).json({
      status: "success",
      message: `your beehive with id: ${myBeehive.id}, is deleted.`,
      requestedAt: req.requestTime,
    });
});

//implementation morgan
exports.updateBeehive = catchAsync(async (req, res) => {
    const myBeehive = await Beehive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // if Id is grammatical correct but doesn't exist 
    if (!myBeehive) {
      return next(new AppError("No Beehive found", 404))
    }

    res.status(200).json({
      status: "success",
      data: myBeehive,
    });
});
