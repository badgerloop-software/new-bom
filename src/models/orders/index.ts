// This file is just syntaxical sugar for importing from other modules
import {createConnection, Schema, Document} from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);


let OrderFunctionsSchema = new Schema({});

OrderFunctionsSchema.statics.findAllPendingOrders = function(): any[] {
    return this.find({$or: [{'isOrdered': false}, {'isReimbursed': false}]});
}

export const Order = bomDB.model('Order', OrderFunctionsSchema);


export {GenericBatchRequest} from './GenericBatchRequest.model';
export {GenericOrderRequest} from './GenericOrderRequest.model';
export {GenericReimbursement} from './GenericReimbursement.model';
export {OnlineBatchRequest} from './OnlineBatchRequest.model';
export {OnlineOrderRequest} from './OnlineOrderRequest.model';


