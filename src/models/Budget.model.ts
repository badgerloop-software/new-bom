import { createConnection, Schema, Types, connection } from 'mongoose';
import * as mongoConfig from '../config/mongo.config';
import {Order} from '../models/orders'

const bomDB = createConnection(mongoConfig.BOM_URL);

const BudgetSchema = new Schema({
  name: {type: String, required: true},
  allocatedBudget: {type: Number ,required: true},
  orders: [{type: Types.ObjectId, refPath: 'Order'}]
});

BudgetSchema.methods.getTotalSpent = async function(): Promise<number> {
  let totalSpent: number = 0;
  await this.populate('orders').execPopulate();
  this.orders.forEach(async (orderID) => {
    let order = await Order.findOne({_id: orderID}).exec();
    if (order) {
      let cost = Number(order._doc.totalCost);
      if (!isNaN(cost)) totalSpent += Number(order._doc.totalCost); // If Not not a number
    }
});
  return totalSpent;
}

BudgetSchema.methods.getAmountLeft = async function(): Promise<number> {
  let spent = await this.getTotalSpent();
  return this.allocatedBudget - spent;
}

BudgetSchema.methods.addOrder = function(newID: any): void{
  this.orders.push(newID);
  this.save((err: Error) => {
    if (err) {
      console.log('[ERROR] Can not add team to budget: ' + err.message);
    }
  })
}

BudgetSchema.statics.findByTeamName = async function(name: string): Promise<any> {
  let budget = await this.findOne({name: name});
  return budget;
}

BudgetSchema.post('create', async function(doc, next) {
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

BudgetListSchema.methods.addTeam = function(newTeam: any): void {
  this.budgets.push(newTeam);
  this.save((err: Error) => {
    if (err) {
      console.log('[ERROR] ' + err.message);
    }
  })
}

BudgetListSchema.statics.calculateTotal = async function(): Promise<number> {
  let sum: number = 0;
  let budgetList = await this.getActiveBudget();
  await budgetList.populate('budgets').execPopulate();
  this.budgets.forEach(async (budget) => sum += await budget.getTotalSpent());
  return sum;
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
