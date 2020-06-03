import {Schema, createConnection} from 'mongoose';
import {BaseOrderBlueprint} from './BaseOrder.model';
import { GenericReimbursementBlueprint } from './GenericReimbursement.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

export const GenericOrderRequestBlueprint = {
    type: {type: String, default: "GenericOrderRequest"},
    ...BaseOrderBlueprint,
    tax: {type: Number, required: true},
    isOrdered: {type: Boolean, default: false},
    orderedBy: {type: String},
    dateOrdered: {type: Date},
    needDate: {type: Date, default: Date.now},
    item: Schema.Types.Mixed
}

const GenericOrderRequestSchema = new Schema(GenericReimbursementBlueprint);

export const GenericOrderRequest = bomDB.model('Order', GenericOrderRequestSchema);

