const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo');
const bomDB = mongoose.createConnection(mongoConfig.bomURL);

const OrderMessageSchema = new mongoose.Schema({
    slackTS: String,
    replies: {},
    order: mongoose.ObjectId,
    reactions: {}
});
let orderModel = bomDB.model('OrderMessages', OrderMessageSchema);
module.exports = orderModel;