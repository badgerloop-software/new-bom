// This file is just syntaxical sugar for importing from other modules
import {createConnection, Schema, Document} from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
const bomDB = createConnection(mongoConfig.BOM_URL);


let OrderFunctionsSchema = new Schema({});

OrderFunctionsSchema.statics.findAllPendingOrders = function(): any[] {
    return this.find({$or: [{'isOrdered': false}, {'isReimbursed': false}]});
}

OrderFunctionsSchema.pre('save', function(next): void {
    console.log('PRESAVING')
    let shipping = this.shipping || 0;
    let tax = this.tax || 0;
    if (this.item) { // If single
       this.totalCost = (this.item.cost * this.quantity) + shipping + tax;
       next()
    }
    if (this.items) {// If batch
        let sum = 0;
        this.items.forEach((item) => sum += (item.cost * item.quantity));
        this.totalCost = sum + tax + shipping;
        next()
    }
    if (this.totalCost) { // If reimbursement
     next()
    }
    console.log('[Error] Tried to calcuate total cost of order with no items');
});

export const Order = bomDB.model('Order', OrderFunctionsSchema);


export {GenericBatchRequest} from './GenericBatchRequest.model';
export {GenericOrderRequest} from './GenericOrderRequest.model';
export {GenericReimbursement} from './GenericReimbursement.model';
export {OnlineBatchRequest} from './OnlineBatchRequest.model';
export {OnlineOrderRequest} from './OnlineOrderRequest.model';
export {Item} from './Item.model'


