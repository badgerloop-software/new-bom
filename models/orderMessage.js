const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo');
const slackService = require('../services/slack');
const orderController = require('../controllers/orders');
const Orders = require('../models/order');
const Users = require('../models/user');
const bomDB = mongoose.createConnection(mongoConfig.bomURL);
const PURCHASING_CHANNEL = process.env.PURCHASING_CHANNEL;
const EXECUTITIVE_IDS = String(process.env.EXECUTITIVES_IDS).split(',');
const URL = process.env.LOCAL_URL;


const OrderMessageSchema = new mongoose.Schema({
    slackTS: String,
    replies: {},
    order: mongoose.ObjectId,
    reactions: {}
});

OrderMessageSchema.methods.checkApproved = function () {
    console.log(EXECUTITIVE_IDS);
    slackService.checkOneThumbsUp(PURCHASING_CHANNEL, this.slackTS, EXECUTITIVE_IDS).then((user) => {
        if (user == -1) return //console.log(`${this.slackTS} doesn't have any reactions`);
        if (user == -2) return //console.log(`${this.slackTS} has not been reacted by an authorized user`);
        console.log(`${this.slackTS} is approved by ${user}`);
        this.approveCorrespondingOrder(user);
    }).catch((err) => {
        console.log(`${this.slackTS} has encountered error ${err}`);
    })
}

OrderMessageSchema.methods.approveCorrespondingOrder = function (userID) {
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

OrderMessageSchema.methods.editStatus = function (status, authorizingUser) {
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
                slackService.editMessage(PURCHASING_CHANNEL, this.slackTS, newMsg).then(() => {
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
                    slackService.sendThread(PURCHASING_CHANNEL, threadedMsg, attachments, this.slackTS);
            });
        });
    });
}
let orderModel = bomDB.model('OrderMessages', OrderMessageSchema);
module.exports = orderModel;
