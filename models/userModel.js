const crypto = require ('crypto')
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { stringify } = require('querystring');

//schema for user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name'],
    }, 
    email:{
        type: String,
        required:[true, 'please tell us your email'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail, 'Please provide a valid email'],

    },
    photo:String, 
    role:{
        type:String,
        enum: ['beeadopter', 'admin', 'beekeeper'],
        default: 'beeadopter',
    },
    password:{
        type: String,
        required: [true, 'please provaide a password'],
        minlength: 8,
        select : false,
    
        
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only works on create and save!!!
            validator: function(el) {
               return el === this.password;
            },
            message: 'Passwords are not the same'
        }  
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

});

//to encrypt the password
userSchema.pre('save', async function(next){
    //only run this function if password was actually modified!!
    if(!this.isModified ('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    //delete passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

//correctPassword returns true if the passwords are the same
userSchema.methods.correctPassword = async function (
    candidatePassword, 
    userPassword
    ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp){
    if(this.passwordChangeAt){
        const changeTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        )
    console.log(changeTimestamp, JWTTimestamp);
    return JWTTimestamp < passwordChangeAt
    }
    // false means not change
    return false
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex'); //with hex I convert to hexadecimal
    //it will be encrypted and compared with the token provided to the user
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

      console.log({resetToken},this.passwordResetToken);
      
      this.passwordResetExpires = Date.now() *10*60*1000
      return resetToken;
  
}  


const User = mongoose.model('User', userSchema);

module.exports = User;
