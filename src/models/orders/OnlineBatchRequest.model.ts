import {Schema} from 'mongoose';
import {GenericBatchRequest} from './GenericBatchRequest.model';

const OnlineBatchRequestSchema = new Schema({
    trackingNum: {type: String},
    link: {type: String},
    shipping: {type: Number}
}, {
    discriminatorKey: 'kind'
});

export const OnlineBatchRequest = GenericBatchRequest.discriminator('OnlineBatchRequest', OnlineBatchRequestSchema);