const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name : String,
  displayName: String,
  slackID : String,
  isAdmin: {type: Boolean, default: false},
  isFSC: {type: Boolean, default: false},
  isTeamLead: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);
