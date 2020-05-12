const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  name : String,
  slackID : String,
  isAdmin: {type: Boolean, default: false},
  isFSC: {type: Boolean, default: false}
});

export default mongoose.model('Users', UserSchema)
