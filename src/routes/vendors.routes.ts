// /vendors
import express from 'express';
import * as passportConfig from '../config/passport.config';
import * as vendorsController from '../controllers/vendors.controller';
let VendorRouter = express.Router();

VendorRouter.get('/list', passportConfig.isAuthenticated, vendorsController.getListVendors);
VendorRouter.post('/add', passportConfig.isAuthenticated, vendorsController.postAddVendor);
VendorRouter.get('/delete', passportConfig.isAuthenticated, vendorsController.getDeleteVendor);
VendorRouter.get('/getPass', passportConfig.isAuthenticated, vendorsController.getPassword);
VendorRouter.post('/edit', passportConfig.isAuthenticated, vendorsController.postEditVendor);

export default VendorRouter;