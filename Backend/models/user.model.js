const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");  
const userSchema = new mongoose.Schema({
fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  language:{
    type: String,
    required: true
  }

});

 userSchema.methods.comparePassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
    };


  userSchema.statics.hashPassword = async function(password){
        return await bcrypt.hash(password,10);
    };

module.exports = mongoose.model('User', userSchema);
