import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const bomDB = mongoose.createConnection(mongoConfig.BOM_URL);

let userSchema = new mongoose.Schema({
  name : String,
  displayName: String,
  slackID : String,
  picture: String,
  isAdmin: {type: Boolean, default: false},
  isFSC: {type: Boolean, default: false},
  isTeamLead: {type: Boolean, default: false}
});

export default bomDB.model('User', userSchema);
