import { Request, Response } from 'express';
import { Users, IUserSchema } from '../models/User.model';
import { Budget, BudgetList } from '../models/Budget.model';
import Orders from '../models/orders/OrderRequest.model';


export class AdminController {
  public async getDash(req: Request, res: Response): Promise<void> {
    let numOrders: any[] = await Orders.getNumOrders();
    let pendingOrders: any[] = await Orders.getPendingOrders();
    let numPendingOrders: number = pendingOrders.length;
    let users: IUserSchema[] = await Users.getAllUsers();
    let numUsers = users.length;
    let budget = null;
    let budgetingTable = null;
    let totalSpent;
    let hasBudget = await BudgetList.hasActiveBudget()
    if(hasBudget) {
      budget = await BudgetList.getActiveBudget();
      budgetingTable = await AdminController.setTable(budget);
      totalSpent = await BudgetList.calculateTotal();
  }
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
  private static async setTable(budgetList: any): Promise<object> {
    if (!budgetList) {
      console.log('[Warning] Attempting to load table with no budget')
      return {}
    }
    let table: (string|number)[][] = [];
    await budgetList.populate('budgets').execPopulate();
    console.log(budgetList.budgets);
    budgetList.budgets.forEach(async (budget) => {
      let totalSpent = await budget.getTotalSpent();
      let amountLeft = await budget.getAmountLeft();
      let teamArray: [string, number, number, number]  = [budget.name, budget.allocatedBudget, totalSpent, 
        amountLeft]
      table.push(teamArray);
    });
    return table;
  }
}