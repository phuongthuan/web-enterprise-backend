const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create Schema
const UserSchema = new Schema({
  name: {
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
  register_date: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
  },
  phone_number: {
    type: String,
    unique: true
  },
  roles: {
    type: [String],
    default: ["student"]
  }
});

module.exports = User = mongoose.model('users', UserSchema);