import {Request, Response} from 'express';
import Budgets from '../models/Budget.model';

export class BudgetsController {
  public getEdit(req: Request, res: Response): void {
    if(!req.user || (!req.user.isFSC && !req.user.isAdmin)) {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('back');
    }
    Budgets.findOne({}, (err, budget) => {
      if (err) throw err;
      res.render('bom/editBudget', {
        user: req.user,
        settings: BudgetsController.convertToHandleBarsObj(budget),
        numTeams: budget.teamList.length
      });
    });
  }

  public postEdit(req: Request, res: Response): void {
    if (!req.user || !req.user.isAdmin) {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('back');
    }
      const NUMTEAMS = req.body.numTeams;
      let namesArray = [];
      let budgetsArray = [];
      for (let i = 0; i < NUMTEAMS; i++) {
        namesArray[i] = req.body[`name${i}`];
        budgetsArray[i] = req.body[`budget${i}`]
      }
      return BudgetsController.updateMongoBudget(req, res, namesArray, budgetsArray);
  }

  private static convertToHandleBarsObj(mongoObject): object {
    let obj = {};
    let len = mongoObject.teamList.length;
    let teamList = mongoObject.teamList;
    let budgetList = mongoObject.setBudgets;
    for(let i=0;i<len;i++) {
      obj[i] = {"name" : teamList[i], "budget":budgetList[i]};
    }
    return obj;
  }
  public getDelete(req: Request, res: Response) {
    Budgets.remove({}, () => {
      req.flash('success', 'Budget Deleted');
      res.redirect('/admin/dashboard');
    })
  }

  public createBudgets(req: Request, res: Response) {
    const NUMTEAMS = req.body.numTeams;
    let namesArray = [];
    let budgetsArray = [];
    for (let i = 0; i < NUMTEAMS; i++) {
      namesArray[i] = req.body[`name${i}`];
      budgetsArray[i] = req.body[`budget${i}`]
    }
    return BudgetsController.createMongoBudget(req, res, namesArray, budgetsArray)
  }

  private static updateMongoBudget(req: Request, res: Response, teamList: string[], budgetList: number[]) {
    if (req.user.isFSC || req.user.isAdmin) {
      let options = {
        setBudgets: budgetList
      }
  
      Budgets.findOneAndUpdate({},options, (err, budget) => {
        if (err) throw err;
        req.flash('success', "Budget Systems Updated");
        return res.redirect('/admin/dashboard');
      });
    } else {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('/');
    }
  }

  private static createMongoBudget(req: Request, res: Response, teamList: string[], budgetList: number[]) {
    if (!(req.user.isFSC || req.user.isAdmin)) {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('/');
    }
    let currentSpent = Budgets.createCurrentSpent();
      let options = {
        teamList: teamList,
        currentSpent: currentSpent,
        setBudgets: budgetList
      }
  
      Budgets.create(options, (err, _budget) => {
        if (err) throw err;
        req.flash('success',"Budget deployed, Boss. Welcome to the BOM");
        return res.redirect('/admin/dashboard');
      });
  }
}
