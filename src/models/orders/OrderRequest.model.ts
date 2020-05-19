import {Schema, createConnection, set} from 'mongoose';
import * as BaseOrder from './BaseOrder.model';
import * as mongoConfig from '../../config/mongo.config'
const bomDB = createConnection(mongoConfig.BOM_URL);

set('useCreateIndex', true);
set('useFindAndModify', false);

const OPTIONS = {discriminatorKey: 'type'};

const OrderRequestSchema = new Schema({
  shipping: {type: Number},
  trackingNum: {type: Number},
  isOrdered: {type: Boolean, default: false},
  dateOrdered: {type: Date},
  purchasedBy: {type: String},
  link: {type: String},
  needDate: {type: Date, default: Date.now}
});

const OrderRequest = BaseOrder.discriminator('OrderRequest', OrderRequestSchema, OPTIONS);

const OrderSchema = new Schema({
  requestor: String, // E
  item: String, // E
  subteam: String, // E
  supplier: String, // E
  productNum: String, // Online
  quantity: String, // E
  totalCost: Number, // virtual
  indvPrice: String, // E
  tax: Number, // E
  shipping: Number, // O
  isApproved: {type: Boolean, default: false}, // E
  approvedBy: String, // E
  trackingNum: String, // O
  dateRequested: {type: Date, default: Date.now}, // E
  isOrdered: {type: Boolean, default: false}, // O
  dateOrdered: Date, // O
  purchaser: String, // Requests
  comments: String, // E
  link: String, // E
  invoice: String, // E (not required)
  project: String, // E
  countsTowardPodCost: {type: Boolean, default: false}, // E
  needDate: String, // Requests
  isDigikey: {type: Boolean, default: false}, // Delete
  messageId: mongoose.ObjectId // E
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


