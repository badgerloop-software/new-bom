import {Schema, createConnection} from 'mongoose';
import {BaseBatchBlueprint} from './BaseBatch.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

export const GenericBatchRequestBlueprint = {
    type: {type: String, default: "GenericBatchRequest"},
    ...BaseBatchBlueprint,
    needDate: {type: Date, default: Date.now},
    isOrdered: {type: Boolean, default: false},
    orderedBy: {type: String},
    dateOrdered: {type: Date}


}

const GenericBatchRequestSchema = new Schema(GenericBatchRequestBlueprint);

export const GenericBatchRequest = bomDB.model('Order', GenericBatchRequestSchema);