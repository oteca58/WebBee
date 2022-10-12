const User = require("./../models/userModel");
const util = require("util");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup= catchAsync (async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync (async (req, res, next) => {
    const { email, password } = req.body;

    //1) check email a& password exist
    if(!email || !password) {
        return next(new AppError("Insert email and password", 400));
    }

    //2) check if user exists & password correct
    const user = await User.findOne({email }).select("+password");
    //compare if the encripting password is the same of user password 
    if(!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError("Incorrect email or password", 401));
    }

    //3)if everything ok, send token to  client
    const token = signToken(user._id);;
    res.status(200).json({
        status: "success",
        token
    }); 
});

exports.protect = catchAsync (async (req, res, next) => {
    //1) getting token and check if it exist
    let token;
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    };

    if(!token) {
        return next(new AppError("You are not logged in!", 401))
    }
    //2) validate token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) check user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next(new AppError("the user belonging to token doesn't exist"));
    }

    //4) check if user changed pass after the token was issued
    freshUser.changedPasswordAfter(decoded.iat);

    next();
});