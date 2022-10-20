const mongoose = require("mongoose");
const User = require("./userModel");
const slugify = require("slugify");

//schema for beehive
const beehiveSchema = new mongoose.Schema({
  serial_beehive: {
    type: Number,
    unique: true,
    required: true,
  },
  serial_beekeeper:
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  beeadopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

beehiveSchema.pre(/^find/, function (next) {
  this.populate({
    path: "serial_beekeeper",
    select: "-__v -email -role"
    }).populate({
      path: "beeadopter",
      select: "-__v"
    });
  next();
}); 



//implement beekeeper ID in beehive
// beehiveSchema.pre("save", async function(next) {
//   const beekeeperPromises = this.beekeeper.map(async id => await User.findById(id));
//   this.beekeeper = await Promise.all(beekeeperPromises)
//   next();
// });



const Beehive = mongoose.model("Beehive", beehiveSchema);

module.exports = Beehive;
