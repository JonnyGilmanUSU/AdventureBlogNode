const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
});

// Pre-save hook for setting user password
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method for checking the user password
userSchema.methods.validatePassword = function (enteredPassword) {
  // bcrypt.compare returns true if the passwords match, false otherwise
  return bcrypt.compare(enteredPassword, this.password);
};


// Static method for checking if email is unique
userSchema.statics.checkEmailUnique = async function (email) {
  const user = await this.findOne({email: email});
  // Return true if we don't find an existing user with the email address, false otherwise
  return !Boolean(user);
};

module.exports = mongoose.model('User', userSchema, 'users');  // 'users' is the collection name
