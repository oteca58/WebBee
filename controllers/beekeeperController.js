const fs = require("fs");
const Beekeeper = require("./../models/beekeeperModel");

const beekeepers = JSON.parse(
  fs.readFileSync(`${__dirname}/../public/data.json`)
);

exports.getAllBeekeepers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: beekeepers.length,
    data: {
      beekeepers,
    },
  });
};

exports.createBeekeeper = async (req, res) => {
  try {
    console.log(req.body);
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
