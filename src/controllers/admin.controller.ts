import { Request, Response } from 'express';
import {Users, IUserSchema}  from '../models/User.model';
import Budgets from '../models/Budget.model';
import Orders from '../models/Order.model';


export class AdminController {
  public async getDash(req: Request, res: Response): Promise<void> {
    let numOrders: any[] = await Orders.getNumOrders();
    let pendingOrders: any[] = await Orders.getPendingOrders();
    let numPendingOrders: number = pendingOrders.length;
    let users: IUserSchema[] = await Users.getAllUsers();
    let numUsers = users.length;
    let budget = await Budgets.getActiveBudget();
    budget.formatAllNumbers();
    let budgetingTable = AdminController.setTable(budget);
      let totalSpent: string = Number(budget.totalSpent).toFixed(2);
      res.render('bom/adminDash', {
        user: req.user,
        users: users,
        activeAdmin: true,
        awaitingApproval: numPendingOrders,
        numUsers: numUsers,
        numOrders: numOrders,
        totalDollars: totalSpent,
        budget: budget,
        table: budgetingTable
      });
  }

  public async setUser(req: Request, res: Response): Promise<void> {
    let value: boolean = (req.query.v === 't');
    let role = req.query.r;
    let user: IUserSchema;
    try {
      user = await Users.findBySlackID(req.query.u);
    } catch (e) {
      console.error(e);
      req.flash('errors', 'Error modifying the user!');
      return res.redirect('back');
    }
    if (role === 'f') user.setFSC(value);
    if (role === 'e') user.setAdmin(value);
    req.flash('info', "User privilages modified");
    return res.redirect('back');
  }

  public createBudget(req: Request, res: Response): void {
    return res.render('bom/createBudget', {
      user: req.user
    });
  }
  private static setTable(budget: any): object {
    let table = [];
    if (!budget.teamList) throw new Error("[Error] Budget does not include a teamlist");
    if (!budget.setBudgets) throw new Error("[Error] Budget does not include set budgets");
    if (!budget.currentSpent) throw new Error("[Error] Budget does not include a current spent array");
    for (let i = 0; i < budget.teamList.length; i++) {
      let spent = budget.currentSpent[i];
      let left = Number(budget.setBudgets[i] - budget.currentSpent[i]).toFixed(2);
      let teamArray = [budget.teamList[i], budget.setBudgets[i], spent, left]
      table.push(teamArray);
    }
    return table;
  }
}