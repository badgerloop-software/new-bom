import {Schema} from 'mongoose';
import {BaseOrder, BaseOrderBlueprint} from './BaseOrder.model';
import {Item} from './Item.model';

export const BaseBatchBlueprint = {
    ...BaseOrderBlueprint,
    type: {type: String, default: "BaseBatch"},
    tax: {type: Number},
    items: Schema.Types.Mixed // These will be instances of Item[]
}

const BaseBatchSchema = new Schema(BaseBatchBlueprint, {
    discriminatorKey: "kind"
});

export const BaseBatch = BaseOrder.discriminator('BaseBatch', BaseBatchSchema);