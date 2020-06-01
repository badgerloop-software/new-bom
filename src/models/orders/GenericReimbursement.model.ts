import { Schema, createConnection } from 'mongoose';
import { BaseOrderBlueprint } from './BaseOrder.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

export const GenericReimbursementBlueprint = {
    type: {type: String, default: "SingleReimbursement"},
    ...BaseOrderBlueprint,
    itemName: {type: String, required: true},
    isReimbursed: { type: Boolean, default: false },
    reimbursedBy: { type: String },
    dateReimbursed: { type: Date },
    totalCost: { type: Number }
};

const GenericReimbursementSchema = new Schema(GenericReimbursementBlueprint);

export const GenericReimbursement = bomDB.model('Order', GenericReimbursementSchema);
