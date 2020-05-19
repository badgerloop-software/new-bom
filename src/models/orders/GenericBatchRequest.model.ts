import {Schema} from 'mongoose';
import {BaseBatch} from './BaseBatch.model';

const GenericBatchRequestSchema = new Schema({
    needDate: {type: Date, default: Date.now},
    isOrdered: {type: Boolean, default: false},
    orderedBy: {type: String},
    dateOrdered: {type: Date}
},
{
    discriminatorKey: 'kind'
});

GenericBatchRequ

export const GenericBatchRequest = BaseBatch.discriminator('GenericBatchRequest', GenericBatchRequestSchema);
