const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    // if ID is grammatical correct but doesn't exist
    if (!doc) {
      return next(new AppError("No doc found with that Id", 404));
    }

    res.status(200).json({
      status: "success",
      message: `your doc with id: ${doc.id}, is deleted.`,
      requestedAt: req.requestTime,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // if Id is grammatical correct but doesn't exist
    if (!doc) {
      return next(new AppError("No document found with that Id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

//popOptions for populate method
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    console.log(doc);
    // if Id is grammatical correct but doesn't exist
    if (!doc) {
      return next(new AppError("no doc found with that ID"));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET Id beehives on beekeeper
    let filter = {};
    if (req.params.userId) filter = { serial_beekeeper: req.params.userId };
    //execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    if (!doc) {
      return next(new AppError("no docs found"));
    }

    //send response
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
