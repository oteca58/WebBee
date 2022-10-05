const Beekeeper = require("./../models/beekeeperModel");
const catchAsync = require('../utils/catchAsync'); 
const AppError = require("../utils/appError");

exports.getAllBeekeepers = catchAsync(async (req, res, next) => {
  const allBeekeepers = await Beekeeper.find(req.query);
  if(!allBeekeepers){
    return next(new AppError('no Beekeepers  found with that ID'))
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
exports.createBeekeeper = catchAsync(async (req, res) => {
  const newBeekeeper = await Beekeeper.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        beekeeper: newBeekeeper,
      },
    });  
});

exports.getBeekeeper  = catchAsync(async (req, res, next) => {
  
  const myBeekeepers  = await Beekeeper.findById(req.params.id);
  if(!myBeekeepers ){
    return next(new AppError('no Beekeepers  found with that ID'))
  };
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      myBeekeepers ,
    },
  });
});

//Insert message to header/response : deleted beehive
exports.deleteBeekeeper = catchAsync(async (req, res, next) => {
  
  const beekeeper =  await Beekeeper.findByIdAndDelete(req.params.id);
  if(!beekeeper){
    return next(new AppError('no beekeeper found with that ID'))
  };
  res.status(204).json({
    status: "success",
    requestedAt: req.requestTime,
    data: null,
  });
});

//implementation morgan
exports.updateBeekeeper = catchAsync(async (req, res, next) => {
  const beekeeper = await Beekeeper.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true  // Update validators validate the update operation against the model's schema
  });
  if(!beekeeper){
    return next(new AppError('no Beekeeper found with that ID'))
  };
  res.status(200).json({
    status: "success",
    data: beekeeper,
  });
});