import express from 'express';
import * as passportConfig from '../config/passport.config';
import * as adminController from '../controllers/admin.controller';
let AdminRouter = express.Router();

AdminRouter.get('/admin/dashboard', passportConfig.isAuthenticated, adminController.getDash);
AdminRouter.get('/admin/set', passportConfig.isAuthenticated, adminController.setUser);
AdminRouter.get('/admin/createbudget', passportConfig.isAuthenticated, adminController.createBudget);

export default AdminRouter;