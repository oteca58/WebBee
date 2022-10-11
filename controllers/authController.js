const {promisify} = require('util');
const user = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync'); 
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { decode } = require('punycode');
const User = require('./../models/userModel');


const singToken = id=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await user.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = singToken(newUser._id)
    res.status(201).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
});

exports.login = catchAsync( async (req, res, next)=>{
    const {email, password} = req.body;

    //1)check if email and password exist
    if (!email || !password){
        return next(new AppError('Please provide email and password', 400))
    };
    //2) check if user exist && password is correct
    //-select- makes the password visible because it is set in the schema: select : false
    const user = await User.findOne({email: email}).select('+password')
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        console.log (password, user.password)
       return next(new AppError('Incorrect email or password', 401))
    }
    // 3) if everthing is ok send token to cient
    const token = singToken(user._id)
    res.status(201).json({
        status: "success",
        token,
    })
});

exports.protect =  catchAsync(async  (req, res, next)=>{
    //1) getting token and check of it's there
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new Error('You are not logged in!! Please login to get access.', 401)
        )
    }
    //2)verificatione token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3)check if user still exist
    const currentUser = await user.findById(decoded.id)
    if(!currentUser) {
        return next(new AppError('the token belonging to this token does no longer exist', 401))
    }
    //4)check if user changed password after the token was issued
    if(currentUser.changePasswordAfter(decode.iat)) {
        return next(new AppError('user recently changed password! Please log in again', 401)
        )
    }
    //GRANT ACESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();    
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new AppError('you do not have permission to performe this action', 403)
                )
        };
        next();

    }
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
    //1) get usedr based on POSTed email
    const user = await User.find({email: req.body.email});
    if(!user) {
        return next(new AppError('there is no user whit email address', 404))
    }
    //2) generete the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();
    //3) send it to user's email
})

// exports.resetPassword = (req, res, next) => {}