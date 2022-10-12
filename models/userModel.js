const mongoose = require("mongoose");
const crypto = require ("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Insert your name:"]
  },
  email: {
      type: String,
      required: [true, "Insert your email:"],
      unique: true,
      lowercase: true,
      validation: [validator.isEmail, "Enter a valid Email"]
    },
  role: {
      type:String,
      enum: ['user', 'admin', 'beekeeper'],
      default: 'user',
  },
  password: {
      type: String,
      required: [true, "Please, insert your password:"],
      minlenght: 8,
      select: false
  },
  passwordConfirm: {
      type: String,
      required: [true, "Please, confirm your password:"],
      validate: {
        //this only word on SAVE, el===password in data
        validator: function(el) {
          return el === this.password; //password1 === password2
        },
        message: "The passwords are incorrect"
      },
  },
  passwordChangedAt: { type: Date, default: Date.now },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Date, default: Date.now },

});

userSchema.pre("save", async function(next) {
  //run this only if the password is modify
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//compare if the encripting password is the same of user password 
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if(this.passwordChangedAt) {
    //confert data in seconds
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }
  
  //false means NOT  changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    console.log({resetToken}, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;//10 min

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;