import {Schema} from 'mongoose';
import {GenericOrderRequest} from './GenericOrderRequest.model';

const OnlineOrderRequestSchema = new Schema({
    shipping: {type: Number},
    trackingNum: {type: String},
    link: {type: String}
},{
    discriminatorKey: 'kind'
});

export const OnlineOrderRequest = GenericOrderRequest.discriminator('OnlineOrderRequest', OnlineOrderRequestSchema)