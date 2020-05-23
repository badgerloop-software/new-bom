import {Schema, model, createConnection, connect} from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';

const bomDB = createConnection(mongoConfig.BOM_URL);
connect(mongoConfig.BOM_URL);

export const BaseOrderBlueprint = {
    type: {type: String, default: "Base", required: true},
    requestor: {type: String, required: true},
    subteam: {type: String, required: true},
    supplier: {type: String, required: true},
    isApproved: {type: Boolean, default: false},
    approvedBy: {type: String},
    dateRequested: {type: Date, default: Date.now},
    comments: {type: String},
    invoice: {type: String},
    countsTowardsPodCost: {type: Boolean, default: false},
    slackMessage: {
        type: Schema.Types.ObjectID,
        ref: "SlackMessage",

    }
}

const BaseOrderSchema = new Schema(BaseOrderBlueprint);
export const BaseOrder = bomDB.model('Order', BaseOrderSchema);
