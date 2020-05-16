// /admin
import {Router} from 'express';
import * as passportConfig from '../config/passport.config';
import {adminController}from '../controllers/';
let AdminRouter = Router();

AdminRouter.get('/dashboard', passportConfig.isAuthenticated, adminController.getDash);
AdminRouter.get('/set', passportConfig.isAuthenticated, adminController.setUser);
AdminRouter.get('/createbudget', passportConfig.isAuthenticated, adminController.createBudget);

export default AdminRouter;