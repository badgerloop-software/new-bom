import {Schema} from 'mongoose';
import {BaseOrder} from './BaseOrder.model';
import {Item} from './Item.model';

export const BaseBatchBlueprint = {
    tax: {type: Number},
    items: Schema.Types.Mixed // These will be instances of Item
}

const BaseBatchSchema = new Schema({

},
{
    discriminatorKey: "kind"
});

BaseBatchSchema.virtual('totalCost').get('')

export const BaseBatch = BaseOrder.discriminator('BaseBatch', BaseBatchSchema);