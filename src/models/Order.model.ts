import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const bomDB = mongoose.createConnection(mongoConfig.BOM_URL);

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const OrderSchema = new mongoose.Schema({
  requestor: String,
  item: String,
  subteam: String,
  supplier: String,
  productNum: String,
  quantity: String,
  totalCost: Number,
  indvPrice: String,
  tax: Number,
  shipping: Number,
  isApproved: {type: Boolean, default: false},
  approvedBy: String,
  trackingNum: String,
  dateRequested: {type: Date, default: Date.now},
  isOrdered: {type: Boolean, default: false},
  dateOrdered: Date,
  purchaser: String,
  comments: String,
  link: String,
  invoice: String,
  project: String,
  countsTowardPodCost: {type: Boolean, default: false},
  needDate: String,
  isDigikey: {type: Boolean, default: false},
  messageId: mongoose.ObjectId
});

OrderSchema.index({'$**': 'text'}, {
// weights: {
//   requestor: 5,
//   item: 4,
//   subteam: 3,
//   supplier: 2,
//   productNum: 5,
//   purchaser: 4
// }
});

OrderSchema.statics.getNumOrders = async function(): Promise<number> {
  let orders =await this.find({}); // The find must be seperate from the .length
  return orders.length;
}

OrderSchema.statics.getPendingOrders = async function(): Promise<any[]> {
  let pendingOrders = await this.find({isApproved: false}); // Await call must be seperate than return
  return pendingOrders
}
export default bomDB.model('Orders', OrderSchema);


