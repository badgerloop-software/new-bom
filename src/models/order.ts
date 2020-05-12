const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

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
  purchaser: String,
  comments: String,
  link: String
});

OrderSchema.index({'$**': 'text'}, {
weights: {
  requestor: 5,
  item: 4,
  subteam: 3,
  supplier: 2,
  productNum: 5,
  purchaser: 4
}
});

export default mongoose.model('Orders', OrderSchema);
