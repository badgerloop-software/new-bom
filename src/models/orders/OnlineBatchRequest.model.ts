import {Schema, createConnection} from 'mongoose';
import {GenericBatchRequestBlueprint} from './GenericBatchRequest.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);

export const OnlineBatchRequestBlueprint = {
    type: {type:String, default: "OnlineBatchRequest"},
    ...GenericBatchRequestBlueprint,
    trackingNum: {type: String},
    link: {type: String},
    shipping: {type: Number}
}

const OnlineBatchRequestSchema = new Schema(OnlineBatchRequestBlueprint);

export const OnlineBatchRequest = bomDB.model('Order', OnlineBatchRequestSchema);