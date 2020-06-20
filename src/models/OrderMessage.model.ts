import {Schema, Model, Document, createConnection, ObjectID, model} from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const bomDB = createConnection(mongoConfig.BOM_URL);
import {SlackService} from '../services/SlackService';
import Orders from './orders/OrderRequest.model';
import {Item} from './orders'
import {Users, IUserSchema} from '../models/User.model';
import NewsArticleModel from './NewsArticle.model';
const PURCHASING_CHANNEL: string = process.env.PURCHASING_CHANNEL;
const EXECUTITIVE_IDS: string[] = String(process.env.EXECUTITIVES_IDS).split(',');
const URL: string = process.env.LOCAL_URL;




const OrderMessageSchema = new Schema({
    slackTS: {type:String},
    replies: {},
    order: {type: Schema.Types.ObjectId, required: [true, 'OrderMessage must be created with Order']},
    reactions: {},
    message: {type: String}
});

interface IOrderMessageSchema extends Document {
    slackTS: string;
    replies?: string[];
    order: ObjectID;
    reactions: JSON;
}

export interface IOrderMessage extends IUserSchema {
    checkApproved(): void;
    approveCorrespondingOrder(): void; 
}

OrderMessageSchema.statics.createFromOrder = async function(order): Promise<IOrderMessage> {
    let user: IUserSchema = await Users.findByName(order.requestor);
    let userID: string = user.slackID;
    let message: string = createMessageFromOrder(order, userID);
    try {
    let newMsg = new OrderMessage({
        order: order,
        message: message
    });
    let savedMessage: IOrderMessage = await newMsg.save();
    console.log(savedMessage);
    return savedMessage;
} catch(err) {
    console.log('[ERROR] Can not save OrderMessage' + err.message);
    throw err;
}
}

function createMessageFromOrder(order: any, userSlackID: string): string {
return `====${order.subteam}====
*Requestor*: <@${userSlackID}>
*Items*: ${order.title}
*Cost*: $${order.totalCost}
*Link*: http://${URL}/orders/edit/${order._id}
==== ==== ====`;
}


export interface IOrderMessageModel extends Model<IOrderMessage> {
    createFromOrder(order: any): Promise<IOrderMessage>;
}

OrderMessageSchema.methods.checkApproved = function (): void {
    console.log(EXECUTITIVE_IDS);
    SlackService.checkOneThumbsUp(PURCHASING_CHANNEL, this.slackTS, EXECUTITIVE_IDS).then((user) => {
        if (user == -1) return //console.log(`${this.slackTS} doesn't have any reactions`);
        if (user == -2) return //console.log(`${this.slackTS} has not been reacted by an authorized user`);
        console.log(`${this.slackTS} is approved by ${user}`);
        this.approveCorrespondingOrder(user);
    }).catch((err) => {
        console.log(`${this.slackTS} has encountered error ${err}`);
    })
}

OrderMessageSchema.pre('save', async function(next) {
    SlackService.sendMessage(process.env.PURCHASING_CHANNEL, this.message, null,  (body) => {
        this.slackTS = body.ts;
        next();
        
    })
})

OrderMessageSchema.methods.approveCorrespondingOrder = function (userID: number) {
    Orders.findById(this.order, (err, order) => {
        if (err) throw err;
        if (order.isApproved) return;
        order.isApproved = true;
        Users.findOne({ slackID: userID }, (err, user) => {
            if (err) throw err;
            order.approvedBy = user.name;
            order.save((err) => {
                if (err) throw err;
                // orderController.sendApprovedResponse(order, user);
                this.editStatus("Approved", userID);
            });
        });
    });
}

OrderMessageSchema.methods.editStatus = function (status: string, authorizingUser: any) {
    Orders.findById(this.order, (err, order) => {
        if (err) throw err;
        if (order.reimbusement) return;
        Users.findOne({ name: order.requestor }, (err, user) => {
            if (err) throw err;
            let currentMsg =
                `====${order.subteam}====
    *Requestor*: <@${user.slackID}>
    *Items*: ${order.item}
    *Cost*: $${order.totalCost}
    *Link*: http://${URL}/orders/edit/${order.id}
==== ==== ====`;
            let newMsg = currentMsg + `\n *Status: ${status}*`
            SlackService.editMessage(PURCHASING_CHANNEL, this.slackTS, newMsg, null);
            let threadedMsg = `<@${user.slackID}>, your order has been ${status}`;
            if (authorizingUser) threadedMsg += ` by <@${authorizingUser}>`;
            if (status === "Approved") threadedMsg += `CC: <@${process.env.FSC_LEAD}>`
            let attachments = null;
            if (status === "Ordered") attachments = [
                {
                    "fallback": "Please log into finance.badgerloop.com to mark delivered",
                    "actions": [
                        {
                            "text": "Mark as Delivered",
                            "type": "button",
                            "url": `http://${URL}/orders/delivered/${order.id}`
                        }
                    ]
                }
            ]
            SlackService.sendThread(PURCHASING_CHANNEL, threadedMsg, attachments, this.slackTS, null);
        });
    });
}

OrderMessageSchema.statics.checkAllMessages = function() {
    this.find({}, (err, messages) => {
        if (err) console.log("[Error] Error finding Order Messages: " + err);
        messages.forEach(message => message.checkApproved());
    })
}
export const OrderMessage =  bomDB.model<IOrderMessage, IOrderMessageModel>('OrderMessages', OrderMessageSchema);
