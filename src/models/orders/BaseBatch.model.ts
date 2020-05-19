import {Schema} from 'mongoose';
import {BaseOrder} from './BaseOrder.model';
import {Item} from './Item.model';

const BaseBatchSchema = new Schema({
    tax: {type: Number},
    items: [Item]
},
{
    discriminatorKey: "kind"
});

BaseBatchSchema.virtual('totalCost').get('')

export const BaseBatch = BaseOrder.discriminator('BaseBatch', BaseBatchSchema);