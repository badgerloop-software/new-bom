import {Schema, createConnection} from 'mongoose';
import {BaseBatchBlueprint} from './BaseBatch.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

export const BatchReimbursementBlueprint = {
        ...BaseBatchBlueprint,
        type: {type: String, default: "BatchReimbursement"},
        isReimbursed: {type: Boolean, default: false},
        reimbursedBy: {type: String},
        dateReimbursed: {type: Date}
}

const BatchReimbursementSchema = new Schema(BatchReimbursementBlueprint);

export const BatchReimbursement = bomDB.model('Order', BatchReimbursementSchema);