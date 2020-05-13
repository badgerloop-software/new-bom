import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const bomDB = mongoose.createConnection(mongoConfig.BOM_URL);

let vendorSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String
});

export default bomDB.model('Vendor', vendorSchema);
