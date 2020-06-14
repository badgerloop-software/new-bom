import { Request, Response } from 'express';
import { Budget, BudgetList } from '../models/Budget.model';

export class BudgetsController {
  public getEdit(req: Request, res: Response): void {
    if (!req.user || (!req.user.isFSC && !req.user.isAdmin)) {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('back');
    }
    BudgetList.findOne({}, (err, budget) => {
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
    mongoObject.budgets.forEach((budget) => {
      console.log(budget)
    })
    
    let obj = {};
    let len = mongoObject.teamList.length;
    let teamList = mongoObject.teamList;
    let budgetList = mongoObject.setBudgets;
    for (let i = 0; i < len; i++) {
      obj[i] = { "name": teamList[i], "budget": budgetList[i] };
    }
    return obj;
  }
  public async getDelete(req: Request, res: Response) {
    let budgetList = await BudgetList.getActiveBudget();
    budgetList.remove({}, (err: Error) => {
      if (err) {
        console.log('[ERROR] Can not delete budget list: ' + err.message)
        req.flash('errors', 'Can not delete budget ' + err.message)
      } else {
      req.flash('success', 'Budget Deleted');
      }
      res.redirect('/admin/dashboard');
    });
  }

  public createBudgets(req: Request, res: Response) {
    const NUMTEAMS = req.body.numTeams;
    let namesArray = [];
    let budgetsArray = [];
    for (let i = 0; i < NUMTEAMS; i++) {
      namesArray[i] = req.body[`name${i}`];
      budgetsArray[i] = req.body[`budget${i}`]
    }
    return BudgetsController.createBudgetList(req, res, NUMTEAMS, namesArray, budgetsArray)
  }

  private static updateMongoBudget(req: Request, res: Response, teamList: string[], budgetList: number[]) {
    if (req.user.isFSC || req.user.isAdmin) {
      let options = {
        setBudgets: budgetList
      }

      Budget.findOneAndUpdate({}, options, (err, budget) => {
        if (err) throw err;
        req.flash('success', "Budget Systems Updated");
        return res.redirect('/admin/dashboard');
      });
    } else {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('/');
    }
  }

  private static async createBudgetList(req: Request, res: Response, numTeams: number, teamList: string[], allocationList: number[]) {
    if (!(req.user.isFSC || req.user.isAdmin)) {
      req.flash('error', "You are not authorized to do this");
      return res.redirect('/');
    }
    if (await BudgetList.hasActiveBudget()) {
      let budgetList = await BudgetList.getActiveBudget();
      BudgetsController.fillBudgetList(req, res, budgetList, numTeams, teamList, allocationList)
    } else {
     let budgetList = new BudgetList({
        year: new Date().getFullYear()
      });
      budgetList.save((err: Error) => {
        if (err) {
          console.log('[ERROR] Error creating BudgetList ' + err.message);
        }
        BudgetsController.fillBudgetList(req, res, budgetList, numTeams, teamList, allocationList)
      });
    }
  }

    private static fillBudgetList(req: Request, res: Response, budgetList: any, numTeams: number, teamList: string[], allocationList: number[]): any {
      let budgets = [];
      for (let i: number = 0; i < numTeams; i++) {
        let newTeamBudget = {
          name: teamList[i],
          allocatedBudget: allocationList[i]
        };
        budgets.push(newTeamBudget);
      }
      Budget.insertMany(budgets, function(err: Error, budgetDocs) {
          if (err) {
            console.log('[ERROR] Error saving new team budget: ' + err.message);
          } else {
            budgetDocs.forEach(doc => {
              budgetList.addTeam(doc);
            });
            req.flash('success', 'Budget sucessfully initialized!');
            return res.redirect('/admin/dashboard');
          }
        });
    }
  }
