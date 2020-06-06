// This file is just syntaxical sugar for importing from other modules
import {createConnection, Schema, Document} from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
const bomDB = createConnection(mongoConfig.BOM_URL);


let OrderFunctionsSchema = new Schema({});

OrderFunctionsSchema.statics.findAllPendingOrders = function(): any[] {
    return this.find({$or: [{'isOrdered': false}, {'isReimbursed': false}]});
}

export const Order = bomDB.model('Order', OrderFunctionsSchema);


export {GenericBatchRequest} from './GenericBatchRequest.model';
export {GenericOrderRequest} from './GenericOrderRequest.model';
export {GenericReimbursement} from './GenericReimbursement.model';
export {BatchReimbursement} from './BatchReimbursement.model'
export {OnlineBatchRequest} from './OnlineBatchRequest.model';
export {OnlineOrderRequest} from './OnlineOrderRequest.model';
export {OrderReimbursement} from './OrderReimbursement.model'
export {Item} from './Item.model'


