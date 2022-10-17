const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { resetPassword } = require("./authController");
const APIFeatures = require("./../utils/apiFeatures");



exports.getAllUsers = catchAsync(async (req, res, next) => {
  //execute query
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const allUsers = await features.query;

  if (!allUsers) {
    return next(new AppError("no Users found with that ID"));
  }

  //send response
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: allUsers.length,
    data: {
      allUsers,
    },
  });
});

//delete and updated and getUserById user to be implemented
