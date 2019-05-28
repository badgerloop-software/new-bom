const Order = require('../models/order');
const webhookURL = process.env.WEBHOOK_URL;
const request = require('request');

function createSlackMessage(order) {
  let options = {
    uri: webhookURL,
    method: 'POST',
    json: {
      "text": `====${order.subteam}==== \n *Requestor*: ${order.requestor} \n *Items*: ${order.item} \n *Cost*: $${order.cost} \n ==== ==== ====`
    }
  };
  request(options, (err, res, body) => {
    if(!err && res.statusCode == 200) {
      console.log(body.id);
    }
  })
}
exports.getMakeOrder = (req, res) => {
  res.render('makeOrder', {
    user: req.user
  })
}

exports.postMakeOrder = (req, res, next) => {
  let order = new Order({
    requestor: req.body.requestor,
    item: req.body.item,
    subteam: req.body.subteam,
    supplier: req.body.supplier,
    productNum: req.body.productNum,
    quantity: req.body.quantity,
    cost: req.body.cost
  });

  let orderObj = {
    requestor: req.body.requestor,
    item: req.body.item,
    subteam: req.body.subteam,
    cost: req.body.cost
  }

  order.save((err) => {
    if (err) return next(err);
    req.flash('success', {
      msg: 'Order Submitted'
    })
    return res.redirect('/');
  });

  createSlackMessage(orderObj);
}

exports.getViewOrders = (req, res) => {
  console.log(req.user)
  Order.find({}, (err, orders) => {
    if(err) throw err;
    res.render('viewOrders', {
      user: req.user,
      orders: orders
    })
  });
}

exports.getEditOrders = (req, res) => {
  let orderID = req.params.id;
  Order.findById(orderID, (err, order) => {
    if(err) { 
      req.flash('errors', {
        msg: 'Order ID Not Found'
      });
      res.redirect('/');
    }
    console.log(`Order ${order._id} selected`)
    res.render('editOrder' , {
      user: req.user,
      order: order
    })
  });
}

exports.postEditOrder = (req, res) => {
  let orderID = req.body.id;
  Order.findById(orderID, (err, order) => {
    if (err) throw err;
    order.requestor = req.body.requestor;
    order.item = req.body.item;
    order.subteam = req.body.subteam;
    order.supplier = req.body.supplier;
    order.productNum = req.body.productNum;
    order.quantity = req.body.quantity;
    order.cost = req.body.cost;
  });
  req.flash('success', {msg: 'Order Sucessfully Updated'});
}
