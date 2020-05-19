import {Schema} from 'mongoose';
import {BaseBatch} from './BaseBatch.model';

const BatchReimbursementSchema = new Schema({
    isReimbursed: {type: Boolean, default: false},
    reimbursedBy: {type: String},
    dateReimbursed: {type: Date}
},
{
    discriminatorKey: 'kind'
});

export const BatchReimbursement = BaseBatch.discriminator('BatchReimbursement', BatchReimbursementSchema);