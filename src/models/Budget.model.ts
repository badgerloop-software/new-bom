import { createConnection, Schema, Types, connection } from 'mongoose';
import * as mongoConfig from '../config/mongo.config';
import { runInNewContext } from 'vm';
const bomDB = createConnection(mongoConfig.BOM_URL);

const BudgetSchema = new Schema({
  name: {type: String, required: true},
  allocatedBudget: {type: Number ,required: true},
  orders: [Types.ObjectId]
});

BudgetSchema.methods.getTotalSpent = function(): number {
  let totalSpent: number = 0;
  this.orders.forEach((order) => totalSpent += order.totalCost);
  return totalSpent;
}

BudgetSchema.methods.getAmountLeft = function(): number {
  return this.allocatedBudget - this.getTotalSpent();
}

BudgetSchema.methods.addOrder = function(newID: Types.ObjectId): void {
  this.orders.push(newID);
}

BudgetSchema.post('save', async function(doc, next) {
  console.log('[INFO] Function post save is running');
  BudgetList.findOne({}, (err, list) => {
    if (err) {
      console.log('[ERROR] Error finding Budget' + err.message);
    }
    console.log(list);
    list.addTeam(doc._id);
    next();
  });
});

const BudgetListSchema = new Schema({
  budgets: {type: [Types.ObjectId], default: []},
  year: {type: Number}
});

BudgetListSchema.methods.calculateTotal = function(): number {
  let sum: number = 0;
  this.budgets.forEach((budget) => sum += budget.getTotalSpent());
  return sum;
}

BudgetListSchema.methods.addTeam = function(newTeam: any): void {
  this.budgets.push(newTeam);
  this.save((err: Error) => {
    if (err) {
      console.log('[ERROR] ' + err.message);
    }
  })
}

BudgetListSchema.statics.getActiveBudget = async function(): Promise<any> {
  let budget = await this.findOne({});
  return budget;
}

BudgetListSchema.statics.hasActiveBudget = async function(): Promise<boolean> {
  let count = await this.count({});
  return !(count === 0);
}

export const Budget = bomDB.model('Budget', BudgetSchema);
export const BudgetList = bomDB.model('BudgetList', BudgetListSchema);
