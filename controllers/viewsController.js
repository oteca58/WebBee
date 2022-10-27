const Beehive = require("../models/beehiveModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
  const beehives = await Beehive.find();

  res.status(200).render("overview", {
    title: "All beehives",
    beehives,
  });
});

exports.getBeehive = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested beehive (including reviews and guides)
  const beehive = await Beehive.findOne({ _id: req.params._id }).populate({
    path: "beeadopter",
    fields: "beeadopter",
  });

  if (!beehive) {
    return next(new AppError("There is no beehive with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)

  res.status(200).render("beehive", {
    title: "First beehive",
    beehive,
  });
});

exports.getLogininForm = (req, res) => {
  res.status(200).render("login", {
    title: "log into your account",
  });
};
