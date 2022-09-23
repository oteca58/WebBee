const fs = require("fs");

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
