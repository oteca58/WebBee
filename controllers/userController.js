const Beekeeper = require("./../models/beekeeperModel");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find(req.query);

  if(!allUsers){
    return next(new AppError('no Users found with that ID'))
  };

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: allUsers.length,
    data: {
      allUsers,
    },
  });
});

exports.getAllBeekeepers = catchAsync(async (req, res, next) => {
  const allBeekeepers = await Beekeeper.find(req.query);

  if(!allBeekeepers){
    return next(new AppError('no Beekeepers found with that ID'))
  };

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: allBeekeepers.length,
    data: {
      allBeekeepers,
    },
  });
});

exports.createBeekeeper = catchAsync(async (req, res, next) => {
    const newBeekeeper = await Beekeeper.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        beekeeper: newBeekeeper,
      },
    });
});

exports.deleteBeekeeper = catchAsync(async (req, res, next) => {
  const myBeekeeper = await Beekeeper.findByIdAndDelete(req.params.id);

  // if ID is grammatical correct but doesn't exist 
  if (!myBeekeeper) {
    return next(new AppError("No Beekeeper found", 404))
  }

  res.status(200).json({
    status: "success",
    message: `your Beekeeper with id: ${myBeekeeper.id}, is deleted.`,
    requestedAt: req.requestTime,
  });
});
