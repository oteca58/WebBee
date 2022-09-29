const Beehive = require("./../models/beehiveModel");

exports.getAllBeehives = async (req, res) => {
  try {
    console.log(req);
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
