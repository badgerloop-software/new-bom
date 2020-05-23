import {Request, Response} from 'express';
import Budgets from '../models/Budget.model';
import Orders from '../models/orders/OrderRequest.model';

export class BOMController {
  public async getTableView(req: Request, res: Response): Promise<void> {
    if (!Budgets.hasActiveBudget()) {
      req.flash('errors', 'The budget has not been initalized, contact the finance lead');
      return res.redirect('back');
    }
    let budget = await Budgets.getActiveBudget();
    if (req.query.q) { // If someone searched
      Orders.find(
        { isOrdered: true,
          $text : {$search : req.query.q} },
        { score: {$meta: "textScore"} },
      ).sort({score: {$meta : 'textScore'}}).exec((err, results) => {
        if (err) throw err;
        res.render('bom/tableView', {
          user: req.user,
          orders: results,
          activeBOM: true
        });
      });
    } else { // If visiting the page without a search
      Orders.find({ isOrdered: true }, null, { sort: { subteam: 1 } }, (err, orders) => {
        if (err) throw err;
        res.render('bom/tableView', {
          user: req.user,
          orders: orders,
          budget: budget,
          activeBOM: true
        });
      });
    }
  }

  public postTableView(req: Request, res: Response): void {
    let query = req.body.search;
    return res.redirect(`/bom?q=${query}`);
  }
}