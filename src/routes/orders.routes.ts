import express from 'express';
import * as passportConfig from '../config/passport.config'
import * as ordersController from '../controllers/orders.controller';
let OrderRouter = express.Router();

OrderRouter.get('/purchase',passportConfig.isAuthenticated,  ordersController.getMakeOrder);
OrderRouter.post('/purchase', ordersController.postMakeOrder);
OrderRouter.get('/view', passportConfig.isAuthenticated, ordersController.getViewOrders);
OrderRouter.post('/view', passportConfig.isAuthenticated, ordersController.postViewOrders);
OrderRouter.get('/edit/:id', ordersController.getEditOrders);
OrderRouter.post('/edit', ordersController.postEditOrder);
OrderRouter.get('/cancel', ordersController.getCancelOrder);
OrderRouter.get('/place/:id', ordersController.getOrdering);
OrderRouter.get('/approve/:id', ordersController.getApproving);
OrderRouter.get('/delivered/:id', passportConfig.isAuthenticated, ordersController.getDelivered);

export default OrderRouter;