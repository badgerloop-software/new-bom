const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name : String,
  slackID : String,
  admin: Boolean
});

module.exports = mongoose.model('User', userSchema);
