const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Beehive = require("./beehiveModel");
const slugify = require("slugify");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Insert your name:"],
  },
  email: {
    type: String,
    required: [true, "Insert your email:"],
    unique: true,
    lowercase: true,
    validation: [validator.isEmail, "Enter a valid Email"],
  },
  role: {
    type: String,
    enum: ["beeadopter", "admin", "beekeeper"],
    default: "beeadopter",
  },
  password: {
    type: String,
    required: [true, "Please, insert your password:"],
    minlenght: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please, confirm your password:"],
    validate: {
      //this only word on SAVE, el===password in data
      validator: function (el) {
        return el === this.password; //password1 === password2
      },
      message: "The passwords are incorrect",
    },
  },
  passwordChangedAt: {type: Date},
  passwordResetToken: { type: String},
  passwordResetExpires: { type: Date},
  active: {
    type: Boolean,
    default: true,
    select: false,
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

//populate virtual myBeehives
userSchema.virtual("beehives", {
  ref: "Beehive",
  foreignField: "serial_beekeeper",
  localField: "_id"
});

userSchema.pre("save", async function (next) {
  //run this only if the password is modify
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});


userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  //this method (- 1000) to skip some problem if the token is created a little bit early
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//regex (/^=find/ = starts with find)
userSchema.pre(/^find/, function(next) {
  //this point to the current query and $ne= not equal to
  this.find({ active: {$ne: false} });
  next();
});

//compare if the encripting password is the same of user password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    //confert data in seconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  //false means NOT  changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min

  return resetToken;
};

// QUERY MIDDLEWARE
//populate the beehives id's inside the beehive's field of beekeeper model

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     localField: "beehives",
//     foreignField: "serial_beekeer",
//   });
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
