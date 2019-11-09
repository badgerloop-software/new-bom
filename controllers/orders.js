const Order = require('../models/order');
const Budget = require('../models/budget');
const webhookURL = process.env.WEBHOOK_URL;
const URL = process.env.LOCAL_URL;
const request = require('request');

exports.getMakeOrder = (req, res) => {
  Budget.find({}, (err, budgets) => {
    if (err) throw err;
    if (!budgets[0]) {
      req.flash('errors', { msg: 'The budget has not been initalized yet, contact the finance lead' });
      return res.redirect('/');
    } else {
      let budget = budgets[0];
      let teamList = budget.teamList;
      return res.render('bom/makeOrder', {
        user: req.user,
        activePurchase: true,
        teamList: teamList
      });
    }
  });
}

exports.postMakeOrder = (req, res, next) => {
  let notARequest = req.body.notARequest;
  console.log(req.body.cost);
  if (req.body.link && !isURL(req.body.link)) {
    req.flash('errors', { msg: 'That is not a valid link, be sure to include http://' });
    return res.redirect('back')
  }
  let podCost = false;
  if (req.body.podCost === 'on') {
    podCost = true
  }
  let needDate = req.body.date.toString();
  let isDigikey = false; // Innocent until proven guilty
  let indvPrice = req.body.cost;
  let totalCost;
  if (req.body.isDigikeyOrder) {
    console.log('Here');
    isDigikey = true; // Guilty
    console.log(req.body.cost);
    totalCost = Number(req.body.isDigikeyOrder).toFixed(2);
  } else totalCost = Number(req.body.cost) * Number(req.body.quantity);
  let order = new Order({
    requestor: req.body.requestor,
    item: req.body.item,
    subteam: req.body.subteam,
    supplier: req.body.supplier,
    productNum: req.body.productNum,
    quantity: req.body.quantity,
    totalCost: totalCost,
    indvPrice: indvPrice,
    link: req.body.link,
    comments: req.body.comments,
    project: req.body.project,
    countsTowardPodCost: podCost,
    needDate: needDate,
    isDigikey: isDigikey,
  });

  if (notARequest) {
    order.purchaser = req.body.requestor;
    order.dateOrdered = new Date();
    order.isApproved = true;
    Budget.find({}, (err, budgets) => {
      if (err) throw err;
      if (budgets === {}) {
        req.flash('errors', { msg: 'The Budget has not been initalized yet' });
        return res.redirect('back');
      }
      updateBudget(budgets[0], order);
    });
  }
  order.save((err) => {
    if (err) return next(err);
    let orderObj = {
      requestor: req.body.requestor,
      item: req.body.item,
      subteam: req.body.subteam,
      cost: totalCost,
      id: order._id
    }
    createSlackMessage(orderObj, req.user);
    req.flash('success', {
      msg: 'Order Submitted'
    })
    return res.redirect('/');
  });
}



exports.getViewOrders = (req, res) => {
  if (req.query.search) {
    console.log(`Recieved serch term ${req.query.search}`);
    Order.find(
      {
        isOrdered: false,
        $text: { $search: req.query.search }
      },
      { score: { $meta: "textScore" } },
    ).sort({ score: { $meta: 'textScore' } }).exec((err, results) => {
      if (err) throw err;
      console.log(results);
      res.render('bom/viewOrders', {
        user: req.user,
        orders: results,
        activeView: true
      });
    });
  } else {
    console.log(req.user);
    Order.find({ isOrdered: false }, (err, orders) => {
      if (err) throw err;
      res.render('bom/viewOrders', {
        user: req.user,
        orders: orders,
        activeView: true
      })
    });
  }
}

exports.postViewOrders = (req, res) => {
  let searchQuery = req.body.search;
  console.log(`searching for ${req.body.search}`);
  res.redirect(`/orders/view?search=${searchQuery}`);
}

exports.getEditOrders = (req, res) => {
  if (!req.user) {
    return redirectToMain(req, res);
  }
  let orderID = req.params.id;
  Budget.find({}, (err, budgets) => {
    if (err) throw err;
    if (budgets === {}) {
      req.flash('errors', { msg: 'Budget has been deleted, contact the Finance Lead' });
      return res.redirect('/');
    }
    let budget = budgets[0];
    let teamList = budget.teamList;

    Order.findById(orderID, (err, selectedOrder) => {
      if (err || selectedOrder === undefined) {
        res.redirect('/');
      } else {
        if (!req.user) {
          return redirectToMain(req, res);
        }
        if (!req.user.isFSC && !req.user.isAdmin) {
          return redirectToMain(req, res);
        } else {
          res.render('bom/editOrder', {
            user: req.user,
            order: selectedOrder,
            activeView: true,
            teamList: teamList,
          });
          return;
        }
      }
    });
  });
}

exports.postEditOrder = (req, res) => {
  let orderID = req.body.id;
  let podCost = false;
  console.log(req.body.podCost)
  if (req.body.podCost === 'on') {
    podCost = true
  }
  let needDate = req.body.date.toString()
  Order.findById(orderID, (err, order) => {
    if (err) throw err;
    let oldCost = order.totalCost;
    let totalCost;
    if (!order.isDigikey) {
      totalCost = (req.body.cost * req.body.quantity) + Number(req.body.shipping) + Number(req.body.tax);
    } else {
      totalCost = 0;
    }
    order.requestor = req.body.requestor;
    order.item = req.body.item;
    order.subteam = req.body.subteam;
    order.supplier = req.body.supplier;
    order.productNum = req.body.productNum;
    order.quantity = req.body.quantity;
    order.totalCost = totalCost;
    order.indvPrice = req.body.cost;
    order.shipping = Number(req.body.shipping);
    order.tax = Number(req.body.tax);
    order.trackingNum = req.body.trackingNum;
    order.comments = req.body.comments;
    order.link = req.body.link;
    order.invoice = req.body.invoice;
    order.project = req.body.project;
    order.countsTowardPodCost = podCost;
    order.needDate = needDate;
    if (order.isApproved) {
      Budget.find({}, (err, list) => {
        updateBudget(list[0], order, oldCost, (err) => {
          if (err) throw err;
          order.save((err) => {
            if (err) throw err;
            req.flash('success', { msg: 'Order Sucessfully Updated' });
            return res.redirect('back');
          });
        });
      });
    } else {
      order.save((err) => {
        if (err) throw err;
        req.flash('success', { msg: 'Order Sucessfully Updated' });
        return res.redirect('back');
      });
    }
  });
}

exports.getCancelOrder = (req, res) => {
  console.log("Cancel Recieved");
  if (!req.user || (!req.user.isAdmin && req.user.isFSC)) {
    return redirectToMain(req, res);
  }
  Order.findOne({ _id: req.query.q }).select("_id").lean().then(exists => {
    if (!exists) {
      req.flash('errors', { msg: 'That order no longer exists' });
      return res.redirect('/');
    }
    Order.findById(req.query.q, (err, order) => {
      if (err) throw err;
      if (order.isPurchased || order.isApproved) {
        Budget.find({}, (err, list) => {
          deleteOrderFromBudget(list[0], order, () => {
            Order.deleteOne({ '_id': req.query.q }, (err) => {
              if (err) throw err;
              req.flash('success', { msg: 'Order Cancelled' });
              res.redirect('/orders/view');
            });
          });
        });
      } else {
        Order.deleteOne({ '_id': req.query.q }, (err) => {
          if (err) throw err;
          req.flash('success', { msg: 'Order Cancelled' });
          res.redirect('/orders/view');
        });
      }
    });
  });
}

exports.getOrdering = (req, res) => {
  let user = req.user;
  let orderID = req.params.id;
  if (!user || !user.isFSC) {
    req.flash('errors', { msg: 'You are not authorized to place an order' });
   return res.redirect('/');
  }
  Order.findById(orderID, (err, order) => {
    if (err) throw err;
    if (!order) {
      req.flash('errors', { msg: 'Order ID does not exist' });
      return res.redirect('back');
    }
    if (!order.isDigikey) {
    if (order.shipping === undefined) order.shipping = 0;
    if (order.tax === undefined) order.tax = 0;
    order.purchaser = user.name;
    order.dateOrdered = new Date();
    order.isOrdered = true;
    order.save((err) => {
      if (err) throw err;
      req.flash('success', { msg: 'Item Updated' });
     return res.redirect('/orders/view');
    });
  } else {
    let numParts = order.item.split(',').length;
    let partNames = order.item.split(',');
    let partQuantities = order.quantity.split(',');
    let partNumbers = order.productNum.split(',');
    let partCosts = order.indvPrice.split(',');
    for (let i=0; i< numParts; i++) {
      let newPart;
      let totalCost = Number(partCosts[i] * partQuantities[i]).toFixed(2);
      if (i == 0) {
         newPart = new Order({
          isApproved: true,
          isOrdered: true,
          purchaser: user.name,
          dateOrdered: new Date(),
          supplier: 'Digikey',
          item: partNames[i],
          quantity: partQuantities[i],
          productNum: partNumbers[i],
          trackingNum: order.trackingNum,
          subteam: order.subteam,
          requestor: order.requestor,
          dateRequested: order.dateRequested,
          invoice: order.invoice,
          tax: order.tax,
          shipping: order.shipping,
          indvPrice: partCosts[i],
          totalCost: totalCost,
          link: order.link
        });
      } else {
       newPart = new Order({
        isApproved: true,
        isOrdered: true,
        purchaser: user.name,
        dateOrdered: new Date(),
        supplier: 'Digikey',
        item: partNames[i],
        quantity: partQuantities[i],
        productNum: partNumbers[i],
        trackingNum: order.trackingNum,
        subteam: order.subteam,
        requestor: order.requestor,
        dateRequested: order.dateRequested,
        invoice: order.invoice,
        tax: 0,
        shipping: 0,
        indvPrice: partCosts[i],
        totalCost: totalCost
      });
    }
      newPart.save((err) => {
        console.log('New Part Made');
      });
    }
    Order.findOneAndDelete({'_id': orderID}, (err) => {
      console.log('Order Deleted');
      req.flash('success', {msg: 'Item Updated'});
      return res.redirect('/orders/view');
    });
  }
  });
}

exports.getApproving = (req, res) => {
  let user = req.user;
  let orderID = req.params.id || req.query.q;
  if (!user || !user.isAdmin) {
    req.flash('errors', { msg: 'You are not authorized to approve an order' });
    return res.redirect('back');
  }
  Order.findOne({ _id: orderID }).select("_id").lean().then(exists => {
    if (!exists) {
      req.flash('errors', { msg: 'That order no longer exists' });
      return res.redirect('/');
    }
    Order.findById(orderID, (err, order) => {
      order.isApproved = true;
      let budgetID = null;
      let update;
      let teamIndex = null
      Budget.find({}, (err, budgets) => {
        if (err) throw err;
        if (budgets === {}) {
          req.flash('errors', { msg: 'The Budget has not been initalized' });
          return res.redirect('/');
        }
        updateBudget(budgets[0], order, null, (err, doc) => {
          if (err) throw err;
          order.save((err) => {
            if (err) throw err;
            createSlackResponse(order, user);
            createSlackReminder(order, user);
            req.flash('success', { msg: 'Order Approved' });
            return res.redirect('/orders/view');
          });
        });
      });
    });
  });
}

function updateBudget(budget, order, oldCost, callback) {
  budgetID = budget._id;
  teamIndex = budget.findTeamIndex(order.subteam);
  let newCurrentSpent = budget.currentSpent;
  if (oldCost) newCurrentSpent[teamIndex] -= oldCost;
  newCurrentSpent[teamIndex] += order.totalCost;
  let update = { currentSpent: newCurrentSpent };
  Budget.findByIdAndUpdate(budgetID, update, { new: true }, callback);
}

function deleteOrderFromBudget(budget, order, callback) {
  budgetID = budget._id;
  teamIndex = budget.findTeamIndex(order.subteam);
  let newCurrentSpent = budget.currentSpent;
  newCurrentSpent[teamIndex] -= order.totalCost;
  let update = { currentSpent: newCurrentSpent };
  Budget.findByIdAndUpdate(budgetID, update, { new: true }, callback);
}

function isURL(str) {
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}

function createSlackMessage(order, user) {
  let msg;
  if (order.reimbursement) {
    msg =
      `====${order.subteam}====
    *Requestor*: <@${user.slackID}>
    *Items*: ${order.item}
    *Cost*: $${order.cost}
    *This is a reimbursement*
    *Link*: http://${URL}/orders/edit/${order.id}
  ==== ==== ====`
  } else {
    msg =
      `====${order.subteam}====
  *Requestor*: <@${user.slackID}>
  *Items*: ${order.item}
  *Cost*: $${order.cost}
  *Link*: http://${URL}/orders/edit/${order.id}
==== ==== ====`
  }
  let options = {
    uri: webhookURL,
    method: 'POST',
    json: {
      "text": msg,
      "attachments": [
        {
          "fallback": `View this order at http://${URL}/orders/edit/${order.id}`,
          "actions": [
            {
              "type": "button",
              "text": "Approve Order 💵",
              "url": `http://${URL}/orders/approve/${order.id}`,
              "style": 'primary',
            },
            {
              "type": "button",
              "text": "Deny Order 🚫",
              "url": `http://${URL}/orders/cancel?q=${order.id}`,
              "style": 'danger'
            }
          ]
        }
      ]
    }
  };
  request(options, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body.id);
    }
  })
}

function createSlackResponse(order, user) {
  let msg;
  msg =
    `Request for ${order.item} has been approved by <@${user.slackID}>!`
  let options = {
    uri: webhookURL,
    method: 'POST',
    json: {
      "text": msg,
    }
  };
  request(options, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body.id);
    }
  })
}
function createSlackReminder(order, user) {
  let msg;
  msg =
    `Request for ${order.item} needs approval in purchasing chanel!!`
  let options = {
    uri: 'https://hooks.slack.com/services/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',
    method: 'POST',
    json: {
      "text": msg,
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
