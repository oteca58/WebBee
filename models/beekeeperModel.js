const mongoose = require("mongoose");
//const slugify = require("slugify");

const beekeeperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name must be enter"],
    unique: true,
    trim: true,
    maxlength: [40, "Name must have less or equal 40 characters"],
  },
});

const Beekeeper = mongoose.model("Beekeeper", beekeeperSchema);

module.exports = Beekeeper;
