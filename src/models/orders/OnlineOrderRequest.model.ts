import {Schema, createConnection} from 'mongoose';
import {GenericOrderRequest, GenericOrderRequestBlueprint} from './GenericOrderRequest.model';
import * as mongoConfig from '../../config/mongo.config';
const bomDB = createConnection(mongoConfig.BOM_URL);


export const OnlineOrderRequestBlueprint = {
    ...GenericOrderRequestBlueprint,
    type: {type: String, default: "OnlineOrderRequest"},
    shipping: {type: Number},
    trackingNum: {type: String},
    link: {type: String}
}

const OnlineOrderRequestSchema = new Schema(OnlineOrderRequestBlueprint);

export const OnlineOrderRequest = bomDB.model('Order', OnlineOrderRequestSchema);