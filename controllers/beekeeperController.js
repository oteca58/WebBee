const Beekeeper = require("./../models/beekeeperModel");

exports.getAllBeekeepers = async (req, res) => {
  try {
    const allBeekeeper = await Beekeeper.find();
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: allBeekeeper.length,
      data: {
        allBeekeeper,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createBeekeeper = async (req, res) => {
  try {
    const newBeekeeper = await Beekeeper.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        beekeeper: newBeekeeper,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
