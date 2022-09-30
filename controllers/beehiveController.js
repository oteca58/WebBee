const Beehive = require("./../models/beehiveModel");

exports.getAllBeehives = async (req, res) => {
  try {
    const allBeehives = await Beehive.find(req.query);
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: allBeehives.length,
      data: {
        allBeehives,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createBeehive = async (req, res) => {
  try {
    const newBeehive = await Beehive.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        beekeeper: newBeehive,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getBeehive = async (req, res) => {
  try {
    const myBeehive = await Beehive.findById(req.params.id);
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        myBeehive,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//Insert message to header/response : deleted beehive
exports.deleteBeehive = async (req, res) => {
  try {
    await Beehive.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      requestedAt: req.requestTime,
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//implementation morgan
exports.updateBeehive = async (req, res) => {
  try {
    const beehive = await Beehive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: beehive,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
