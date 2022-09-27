const mongoose = require("mongoose");
//const slugify = require("slugify");

const beehiveSchema = new mongoose.Schema({
  serial_beehive: {
    type: Number,
    unique: true,
    required: true,
  },
  serial_beekeeper: {
    type: Number,
    unique: true,
    required: true,
  },
  place: {
    type: String,
    required: true,
    trim: true,
    maxlength: [40, "Place must have less or equal 40 characters"],
  },
  state: {
    type: String,
    required: true,
    enum: {
      values: [
        "production",
        "fever",
        "quarantene",
        "orphane",
        "virgin_queen",
        "desease",
        "treatment",
        "winterization",
      ],
      message:
        "Choose can be: production, fever, quarantene, orphane, virgin_queen, desease, treatment,winterization",
    },
  },
  honeycomb: {
    type: Number,
    required: true,
  },
  pollin_trap: {
    type: Boolean,
    default: false,
  },
  propolis_net: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, "a beehive must have a price"],
  },
});

const Beehive = mongoose.model("Beehive", beehiveSchema);

module.exports = Beehive;
