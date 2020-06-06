import { Schema, createConnection } from 'mongoose';
import { BaseOrderBlueprint } from './BaseOrder.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);


export const OrderReimbursementBlueprint = {
    ...BaseOrderBlueprint,
    type: {type: String, default: "ItemReimbursement"},
    item: Schema.Types.Mixed,
    isReimbursed: { type: Boolean, default: false },
    reimbursedBy: { type: String },
    dateReimbursed: { type: Date },
};

const OrderReimbursementSchema = new Schema(OrderReimbursementBlueprint);

export const OrderReimbursement = bomDB.model('Order', OrderReimbursementSchema);
