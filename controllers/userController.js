const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { resetPassword } = require("./authController");
const APIFeatures = require("./../utils/apiFeatures");

//loop the obj
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}; 

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //execute query
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const allUsers = await features.query;
  console.log(allUsers);

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered only fields that are allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const myUser = await User.findById(req.params.id).populate({
    path: "beehives",
    select: "-__v -price -state -honeycomb -propolis_net -pollin_trap"
  });

  // if Id is grammatical correct but doesn't exist 
  if(!myUser){
    return next(new AppError('no Users found with that ID'))
  };

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      myUser,
    },
  });
});

//delete and updated and getUserById user to be implemented
