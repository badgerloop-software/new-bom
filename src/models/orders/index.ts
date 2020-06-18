// This file is just syntaxical sugar for importing from other modules
import {createConnection, Schema, Document} from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';
import { BudgetList, Budget } from '../Budget.model';
const bomDB = createConnection(mongoConfig.BOM_URL);

/**
 * The OrderFunctionsSchema only works for STATIC METHODS
 * Due to the inability of mongoose to do schema inheritance more than 2 levels
 * and the way I've chosen to implement my own inheritance system any instance methods
 * must created and treated as generic functions elsewhere or static functions here
 */
let OrderFunctionsSchema = new Schema({});

OrderFunctionsSchema.statics.findAllPendingOrders = function(): any[] {
    return this.find({$or: [{'isOrdered': false}, {'isReimbursed': false}]});
}

OrderFunctionsSchema.statics.addBudget = async function(order: any, subteam: string, successResponse: () => void, failureResponse: (msg: string) => void): Promise<void> {
    let hasBudget = await BudgetList.hasActiveBudget();
    if (!hasBudget) return failureResponse('Budget does not exist');
    let budget = await Budget.findByTeamName(subteam);
    order.budget = budget;
    order.save((err: Error) =>{
        if (err) {
            return failureResponse(err.message);
        }
        successResponse();
    });
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


