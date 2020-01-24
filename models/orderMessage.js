const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo');
const slackService = require('../services/slack');
const Orders = require('../models/order');
const Users = require('../models/user');
const bomDB = mongoose.createConnection(mongoConfig.bomURL);
const PURCHASING_CHANNEL = process.env.PURCHASING_CHANNEL;
const EXECUTITIVE_IDS = String(process.env.EXECUTITIVES_IDS).split(',');


const OrderMessageSchema = new mongoose.Schema({
    slackTS: String,
    replies: {},
    order: mongoose.ObjectId,
    reactions: {}
});

OrderMessageSchema.methods.checkApproved = function () {
    slackService.checkOneThumbsUp(PURCHASING_CHANNEL, this.slackTS, EXECUTITIVE_IDS).then((user) => {
        console.log(`${this.slackTS} is approved by ${user}`);
        this.approveCorrespondingOrder(user);
    }).catch((err) => {
        console.log(`${this.slackTS} has encountered error ${err}`);
    })
}

OrderMessageSchema.methods.approveCorrespondingOrder = function (userID) {
    let message = this;
    Orders.findById(this.order, (err, order) => {
        if (err) throw err;
        order.isApproved = true;
        Users.findOne({ slackID: userID }, (err, user) => {
            if (err) throw err;
            order.approvedBy = user.name;
            order.save((err) => {
                if (err) throw err;
            });
        });
    });
}
let orderModel = bomDB.model('OrderMessages', OrderMessageSchema);
module.exports = orderModel;