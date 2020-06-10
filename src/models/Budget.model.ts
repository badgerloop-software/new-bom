import { createConnection, Schema, Types, connection } from 'mongoose';
import * as mongoConfig from '../config/mongo.config';

const bomDB = createConnection(mongoConfig.BOM_URL);

const BudgetSchema = new Schema({
  name: {type: String, required: true},
  allocatedBudget: {type: Number ,required: true},
  orders: [{type: Types.ObjectId, ref: 'Order'}]
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
  BudgetList.findOne({}, (err, list) => {
    if (err) {
      console.log('[ERROR] Error finding Budget' + err.message);
    }
    list.addTeam(doc);
    next();
  });
});

const BudgetListSchema = new Schema({
  budgets: [{type: Types.ObjectId, default: [], ref: 'Budget'}],
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

BudgetListSchema.statics.getListOfNames = async function(): Promise<string[]> {
  let hasBudget = await this.hasActiveBudget();
  if (!hasBudget) throw new Error("[ERROR] Can not get list of names from a non existant budget");
  let budget = await this.getActiveBudget();
  await budget.populate('budgets').execPopulate();
  let list = []
  budget.budgets.forEach((budget) => list.push(budget.name));
  return list;
}

BudgetListSchema.statics.getStringOfNames = async function(): Promise<string> {
  let list = await this.getListOfNames();
  return list.join(',')
}

BudgetListSchema.pre('remove', async function(next) {
  await this.populate('budgets').execPopulate()
  this.budgets.forEach((budget) => {
    budget.remove()
  });
  next();
});

export const Budget = bomDB.model('Budget', BudgetSchema);
export const BudgetList = bomDB.model('BudgetList', BudgetListSchema);
