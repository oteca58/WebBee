const mongoose = require("mongoose");
//slugify will be use for future handling
//const slugify = require("slugify");

const beekeeperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name must be enter"],
    unique: true,
    trim: true,
    maxlength: [40, "Name must have less or equal 40 characters"],
  },
  beehives: [{ type: mongoose.Schema.ObjectId, ref: "Beehive" }],
});

// QUERY MIDDLEWARE
//populate the beehives id's inside the beehive's field of beekeeper model

beekeeperSchema.pre(/^find/, function (next) {
  this.populate({
    path: "beehives",
  });
  next();
});

const Beekeeper = mongoose.model("Beekeeper", beekeeperSchema);

module.exports = Beekeeper;
