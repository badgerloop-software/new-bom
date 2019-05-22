const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  requestor: String,
  item: String,
  subteam: String,
  suplier: String,
  productNum: String,
  quantity: Number,
  cost: Number
});

module.exports = mongoose.model('Orders', OrderSchema);
