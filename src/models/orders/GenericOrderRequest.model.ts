import {Schema} from 'mongoose';
import {BaseOrder} from './BaseOrder.model';
import {Item} from './Item.model';

const GenericOrderRequestSchema = new Schema({
    tax: {type: Number},
    isOrdered: {type: Boolean, default: false},
    orderedBy: {type: String},
    dateOrdered: {type: Date},
    needDate: {type: Date, default: Date.now},
    item: Item
},{
    discriminatorKey: "kind"
});

export const GenericOrderRequest = BaseOrder.discriminator('GenericOrderRequest', GenericOrderRequestSchema);

