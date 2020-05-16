import express from 'express';
import * as passportConfig from '../config/passport.config';
import {budgetsController} from '../controllers';
let BudgetRouter = express.Router();

BudgetRouter.get('/edit', passportConfig.isAuthenticated, budgetsController.getEdit);
BudgetRouter.post('/createBudget', budgetsController.createBudgets);
BudgetRouter.get('/delete', passportConfig.isAuthenticated, budgetsController.getDelete);
BudgetRouter.get('/editBudget', budgetsController.getEdit);
BudgetRouter.post('/editBudget', budgetsController.postEdit);

export default BudgetRouter;