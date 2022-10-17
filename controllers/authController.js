const User = require("./../models/userModel");
const util = require("util");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check email a& password exist
  if (!email || !password) {
    return next(new AppError("Insert email and password", 400));
  }

  //2) check if user exists & password correct
  const user = await User.findOne({ email }).select("+password");
  //compare if the encripting password is the same of user password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3)if everything ok, send token to  client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token and check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }
  //2) validate token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3) check user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("the user belonging to token doesn't exist", 401));
  }

  //4) check if user changed pass after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("the password is changed! login in again!", 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ["admin", "beekeeper"]. role="user"
    if (!roles.includes(req.user.role)) {
      return next(new AppError("don't have permission for this", 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on POST email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there isn't user whit email address", 404));
  }
  //2) generete the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send it to user's emails
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forgot password? Do a PATCH request with your new password and passConfirm to: ${resetURL}.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "reset your password",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Impossible to send the email!"), 500);
  }
});

exports.resetPassword = (req, res, next) => {};
