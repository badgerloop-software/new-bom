import {Schema, createConnection} from 'mongoose';
import {BaseOrder} from './BaseOrder.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

const GenericReimbursementSchema = new Schema({
    isReimbursed: {type: Boolean, default: false},
    reimbursedBy: {type: String},
    dateReimbursed: {type: Date},
    totalCost: {type: Number}
},
{
    discriminatorKey: "kind"
});

export const GenericReimbursement = BaseOrder.discriminator('GenericReimbursement', GenericReimbursementSchema);
