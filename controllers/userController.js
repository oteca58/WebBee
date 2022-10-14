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