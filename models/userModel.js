const mongoose = require("mongoose");
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
    passwordChangedAt: Date
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
    console.log("sonoqui");
    console.log(this.passwordChangedAt, JWTTimestamp);
  }
  
  return false;
}

const User = mongoose.model("User", userSchema);

module.exports = User;