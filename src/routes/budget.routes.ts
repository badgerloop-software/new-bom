import express from 'express';
import * as passportConfig from '../config/passport.config';
import * as budgetController from '../controllers/budgets.controller';
let BudgetRouter = express.Router();

BudgetRouter.get('/edit', passportConfig.isAuthenticated, budgetController.getEdit);
BudgetRouter.post('/createBudget', budgetController.createBudgets);
BudgetRouter.get('/delete', passportConfig.isAuthenticated, budgetController.getDelete);
BudgetRouter.get('/editBudget', budgetController.getEdit);
BudgetRouter.post('/editBudget', budgetController.postEdit);

export default BudgetRouter;