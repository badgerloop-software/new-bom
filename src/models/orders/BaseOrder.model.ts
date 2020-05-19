import {Schema, model, createConnection} from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';

const bomDB = createConnection(mongoConfig.BOM_URL);

const BaseOrderSchema = new Schema({
    requestor: {type: String, required: true},
    Subteam: {type: String, required: true},
    Supplier: {type: String, required: true},
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
});

export const BaseOrder = bomDB.model("BaseOrder", BaseOrderSchema);