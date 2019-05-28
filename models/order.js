const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  requestor: String,
  item: String,
  subteam: String,
  supplier: String,
  productNum: String,
  quantity: Number,
  cost: Number,
  isApproved: {type: Boolean, default: false},
  trackingNum: String,
  dateRequested: {type: Date, default: Date.now},
  isOrdered: {type: Boolean, default: false},
  dateOrdered: Date,
  purchaser: String
});

module.exports = mongoose.model('Orders', OrderSchema);
