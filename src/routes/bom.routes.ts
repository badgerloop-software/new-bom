import express from 'express';
import {bomController} from '../controllers'
import * as passportConfig from '../config/passport.config';
let BomRouter = express.Router();

BomRouter.get('/', passportConfig.isAuthenticated, bomController.getTableView);
BomRouter.post('/', passportConfig.isAuthenticated, bomController.postTableView);

export default BomRouter;