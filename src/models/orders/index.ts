// This file is just syntaxical sugar for importing from other modules
import { createConnection, Schema, Document } from 'mongoose';
import * as mongoConfig from '../../config/mongo.config';
import { IUserSchema } from '../User.model';
import { IOrderMessage, OrderMessage } from '../OrderMessage.model';
import { ObjectId } from 'mongodb';
import { resolve } from 'path';
import { rejects } from 'assert';
const bomDB = createConnection(mongoConfig.BOM_URL);
const MongoClient = require('mongodb').MongoClient;


/**
 * The OrderFunctionsSchema only works for STATIC METHODS
 * Due to the inability of mongoose to do schema inheritance more than 2 levels
 * and the way I've chosen to implement my own inheritance system any instance methods
 * must created and treated as generic functions elsewhere or static functions here
 */
let OrderFunctionsSchema = new Schema({});

OrderFunctionsSchema.statics.findAllPendingOrders = function (): any[] {
    return this.find({ $or: [{ 'isOrdered': false }, { 'isReimbursed': false }] });
}

OrderFunctionsSchema.statics.approveOrderByID = function (orderID, approvingUser: IUserSchema): Promise<number> {
    return new Promise(function (resolve, reject) {
        Order.queryApproval(orderID, approvingUser.name).then((order) => {
            console.log(order);
            OrderMessage.findOne({ _id: order.slackMessage }, async (err, slackMessage) => {
                if (err) reject(err);
                await slackMessage.editStatus('Approved', approvingUser.slackID, order.requestor);
                resolve(1);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

OrderFunctionsSchema.statics.queryApproval = async function (orderID: string, approvingUserName: string): Promise<any> {
    return await this.updateOrder(orderID, { isApproved: true, approvedBy: approvingUserName });
}

OrderFunctionsSchema.statics.queryOrdering = async function (orderID: string, orderingUserName: string): Promise<any> {
    return await this.updateOrder(orderID, { isOrdered: true, orderedBy: orderingUserName });
}

/**
 * Must use native MongoDB here likely due to an issue with Mongoose, I can not for the fucking
 * life of me get an order to update via mongoose. If someone can fix it, more power to ya.
 * @param orderID The ID of the order
 * @param update An object containing the fields and values to modify
 * @returns A promise that will resolve into the newly updated order
 */
OrderFunctionsSchema.statics.updateOrder = function (orderID: string, update: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoConfig.BASE_URL, (err, db) => {
            if (err) reject(err);
            var dbo = db.db('devBLBOM');
            let query = { _id: new ObjectId(orderID) };
            let modify = { $set: update };
            dbo.collection('orders').findOneAndUpdate(query, modify, { upsert: true, returnNewDocument: true }, (err, res) => {
                if (err) reject(err);
                dbo.collection('orders').findOne(query, (err, order) => {
                    if (err) reject(err)
                    resolve(order);
                    db.close();
                });
            });
        });
    });
}

OrderFunctionsSchema.statics.IDexists = function (orderID): Promise<boolean> {
    return this.findOne({ _id: orderID }).select("_id").lean().then(exists => {
        return exists;
    });
}

export const Order = bomDB.model('Order', OrderFunctionsSchema);


export { GenericBatchRequest } from './GenericBatchRequest.model';
export { GenericOrderRequest } from './GenericOrderRequest.model';
export { GenericReimbursement } from './GenericReimbursement.model';
export { BatchReimbursement } from './BatchReimbursement.model'
export { OnlineBatchRequest } from './OnlineBatchRequest.model';
export { OnlineOrderRequest } from './OnlineOrderRequest.model';
export { OrderReimbursement } from './OrderReimbursement.model'
export { Item } from './Item.model'


