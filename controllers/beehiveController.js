const Beehive = require("./../models/beehiveModel");
const catchAsync = require("./../utils/catchAsync");


exports.getAllBeehives = catchAsync(async (req, res, next) => {
    const allBeehives = await Beehive.find(req.query);
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
    await Beehive.findByIdAndDelete(req.params.id);
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
    });
    res.status(200).json({
      status: "success",
      data: beehive,
    });
});
