import express from 'express';
import * as bomController from '../controllers/bom.controller';
import * as passportConfig from '../config/passport.config';
let BomRouter = express.Router();

BomRouter.get('/bom', passportConfig.isAuthenticated, bomController.getTableView);
BomRouter.post('/bom', passportConfig.isAuthenticated, bomController.postTableView);

export default BomRouter;