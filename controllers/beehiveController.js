const Beehive = require("./../models/beehiveModel");
const catchAsync = require('../utils/catchAsync'); 
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

exports.createBeehive = catchAsync(async (req, res) => {
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
  
    const beehive =  await Beehive.findByIdAndDelete(req.params.id);
    if(!beehive){
      return next(new AppError('no Beehives found with that ID'))
    };
    res.status(204).json({
      status: "success",
      requestedAt: req.requestTime,
      data: null,
    });
});
  

//implementation morgan
exports.updateBeehive = catchAsync(async (req, res, next) => {
    const beehive = await Beehive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true  // Update validators validate the update operation against the model's schema
    });
    if(!beehive){
      return next(new AppError('no Beehives found with that ID'))
    };
    res.status(200).json({
      status: "success",
      data: beehive,
    });
});
