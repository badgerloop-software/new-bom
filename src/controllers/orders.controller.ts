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
    if (!err && res.statusCode == 200) {
      console.log(body.id);
    }
  })
}

function redirectToMain(req, res) {
  req.flash('errors', { msg: 'You are not authorized to view that!' });
  res.redirect('/');
}

export const getMakeOrder = (req, res) => {
  res.render('makeOrder', {
    user: req.user,
    activePurchase: true
  })
}

export const postMakeOrder = (req, res, next) => {
  let totalCost = req.body.cost * req.body.quantity;
  let notARequest = req.body.notARequest;
  let order = new Order({
    requestor: req.body.requestor,
    item: req.body.item,
    subteam: req.body.subteam,
    supplier: req.body.supplier,
    productNum: req.body.productNum,
    quantity: req.body.quantity,
    cost: totalCost,
    link: req.body.link
  });

  if(notARequest) {
    order.purchaser = req.body.requestor;
    order.dateOrdered = new Date();
    order.isOrdered = true;
    order.isApproved = true;
  }

  let orderObj = {
    requestor: req.body.requestor,
    item: req.body.item,
    subteam: req.body.subteam,
    cost: totalCost
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

export const getViewOrders = (req, res) => {
  if (req.query.search) {
    console.log(`Recieved serch term ${req.query.search}`);
    Order.find(
      { $text : {$search : req.query.search} },
      { score: {$meta: "textScore"} },
    ).sort({score: {$meta : 'textScore'}}).exec((err, results) => {
      if (err) throw err;
      console.log(results);
      res.render('viewOrders', {
        user: req.user,
        orders: results,
        activeView: true
      });
    });
  } else {
    console.log(req.user);
    Order.find({}, (err, orders) => {
      if (err) throw err;
      res.render('viewOrders', {
        user: req.user,
        orders: orders,
        activeView: true
      })
    });
  }
}

export const postViewOrders = (req, res) => {
  let searchQuery = req.body.search;
  console.log(`searching for ${req.body.search}`);
  res.redirect(`/orders/view?search=${searchQuery}`);
}

export const getEditOrders = (req, res) => {
  if (!req.user) {
    return redirectToMain(req, res);
  }
  let orderID = req.params.id;
  Order.findById(orderID, (err, selectedOrder) => {
    if (err || selectedOrder === undefined) {
      res.redirect('/');
    } else {
      if(!req.user) {
        return redirectToMain(req, res);
      }
      if(!req.user.isFSC && !req.user.isAdmin) {
        if (req.user.name !== selectedOrder.requestor) {
         return redirectToMain(req, res);
        } else {
          res.render('editOrder', {
            user: req.user,
            order: selectedOrder,
            activeView: true
          });
          return;       
        }
      }
      // console.log(`Order ${order._id} selected`);
      res.render('editOrder', {
        user: req.user,
        order: selectedOrder,
        activeView: true
      });
    }
  });
}

export const postEditOrder = (req, res) => {
  let orderID = req.body.id;
  let totalCost = req.body.cost * req.body.quantity;
  Order.findById(orderID, (err, order) => {
    if (err) throw err;
    order.requestor = req.body.requestor;
    order.item = req.body.item;
    order.subteam = req.body.subteam;
    order.supplier = req.body.supplier;
    order.productNum = req.body.productNum;
    order.quantity = req.body.quantity;
    order.cost = totalCost,
    order.trackingNum = req.body.trackingNum;
    order.comments = req.body.comments;
    order.link = req.body.link;
    order.save((err) => {
      if (err) throw err;
    });
  });
  req.flash('success', { msg: 'Order Sucessfully Updated' });
  res.redirect('back');
}

export const getCancelOrder = (req, res) => {
  console.log(`params = ${req.query.q}`);
  Order.deleteOne({'_id': req.query.q}, (err, order) => {
    if (err) throw err;
    req.flash('success', {msg: 'Order Cancelled'});
    res.redirect('/orders/view');
  })
}

export const getOrdering = (req, res) => {
  let user = req.user;
  let orderID = req.params.id;
  if (!user || !user.isFSC) {
    req.flash('errors', { msg: 'You are not authorized to place an order' });
    res.redirect('/');
  }
  Order.findById(orderID, (err, order) => {
    if (err) throw err;
    if (!order) {
      req.flash('errors', { msg: 'Order ID does not exist' });
      res.redirect('back');
    }
    order.purchaser = user.name;
    order.dateOrdered = new Date();
    order.isOrdered = true;
    order.save((err) => {
      if (err) throw err;
      req.flash('success', {msg: 'Item Updated'});
      res.redirect('/orders/view');
    });
  });
}

export const getApproving = (req, res) => {
  let user = req.user;
  let orderID = req.params.id;
  if(!user || !user.isAdmin) {
    req.flash('errors', {msg : 'You are not authorized to approve an order'});
    res.redirect('back');
  }
  Order.findById(orderID, (err, order) => {
    order.isApproved = true;
    order.save((err) => {
      req.flash('success', {msg: 'Order Approved'});
      res.redirect('/orders/view');
    });
  });
};
