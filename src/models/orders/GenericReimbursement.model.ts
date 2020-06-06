import { Schema, createConnection } from 'mongoose';
import { BaseOrderBlueprint } from './BaseOrder.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

export const GenericReimbursementBlueprint = {
    ...BaseOrderBlueprint,
    type: {type: String, default: "SingleReimbursement"},
    isReimbursed: { type: Boolean, default: false },
    reimbursedBy: { type: String },
    dateReimbursed: { type: Date },
    project: {type: String}
};

const GenericReimbursementSchema = new Schema(GenericReimbursementBlueprint);

export const GenericReimbursement = bomDB.model('Order', GenericReimbursementSchema);
