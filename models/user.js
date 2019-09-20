const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const bomDB = mongoose.createConnection(mongoConfig.bomURL);

let userSchema = new mongoose.Schema({
  name : String,
  displayName: String,
  slackID : String,
  isAdmin: {type: Boolean, default: false},
  isFSC: {type: Boolean, default: false},
  isTeamLead: {type: Boolean, default: false}
});

module.exports = bomDB.model('User', userSchema);
