const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const bomDB = mongoose.createConnection(mongoConfig.bomURL);

let vendorSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String
});

module.exports = bomDB.model('Vendor', vendorSchema);
