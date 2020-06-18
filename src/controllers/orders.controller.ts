import {OnlineOrderRequest, Order, Item, OnlineBatchRequest, GenericReimbursement, OrderReimbursement, BatchReimbursement} from '../models/orders';
import {Budget} from '../models/Budget.model';
import OrderMessage from '../models/OrderMessage.model';
import {SlackService} from '../services/SlackService';
import {Request, Response} from 'express'
import { budgetsController } from '.';
const URL = process.env.LOCAL_URL;
const fscLead = "UG46HDHS7";

export const getMakeOrder = (req, res) => {
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

export const postMakeOrder = (req, res, next) => {
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
      updateBudget(budgets[0], order, null, null);
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
    sendOrderMessage(orderObj, req.user);
    req.flash('success', {
      msg: 'Order Submitted'
    })
    return res.redirect('/');
  });
}

export const postNewReimbursement = async (req: Request, res: Response) => {
  const SuccessResponse = () => { // What will happen on sucessful post
    req.flash('success', `Reimbursement Submitted!`);
    res.redirect('/orders/view');
  }
  const FailureResponse = (errMsg: string) => { // What will happen on failed post
    req.flash(`errors`, `Error creating your reimbursement request!`);
    req.flash('errors', errMsg)
    res.redirect('back');
  }
  if (req.body.numItems < 0) {
    req.flash('errors', 'Number of items can not be less than 0');
    return res.redirect('back');
  }
  if (req.body.numItems == 0) { // Process Generic Reimbursement
    return await createGenericReimbursement(req.body, SuccessResponse, FailureResponse);
  }
  if (req.body.numItems == 1) {
    return await createOrderReimbursement(req.body, SuccessResponse, FailureResponse);
  }
  if (req.body.numItems > 1) {
    return await createBatchReimbursement(req.body, SuccessResponse, FailureResponse);
  }
}

async function createBatchReimbursement(formBody: any, successResponse: () => void, failureResponse: (msg: string) => void): Promise<void> {
  let itemsList: Item[] = createItemsList(formBody, formBody.numItems);
  let totalCost = Item.calculateTotalCostOfItems(itemsList) + Number(formBody.tax);
  let orderTitle = Item.getListOfNames(itemsList).join(', ');
  let budget = await Budget.findByTeamName(formBody.subteam)
  let newBatchReimbursement = new BatchReimbursement({
    requestor: formBody.requestor,
    subteam: formBody.subteam,
    supplier: formBody.supplier,
    tax: formBody.tax,
    needDate: formBody.date,
    items: itemsList,
    shipping: formBody.shipping,
    link: formBody.link,
    totalCost: totalCost,
    title: orderTitle,
    comments: formBody.comments,
    budget: budget
  });

  newBatchReimbursement.save(async (err: Error, order: any) => {
    if (err) {
      console.log('[Error] ' + err.message);
      failureResponse(err.message);
    } else {
      budget.addOrder(newBatchReimbursement);
      successResponse()
    }
  });

}

async function createGenericReimbursement(formBody: any, successResponse: () => void, failureResponse: (msg: string) => void): Promise<void> {
  let budget = await Budget.findByTeamName(formBody.subteam);
  let newReimbursement = new GenericReimbursement({
    requestor: formBody.requestor,
    title: formBody.title,
    subteam: formBody.subteam,
    supplier: formBody.supplier,
    totalCost: formBody.totalCost,
    project: formBody.project,
    budget: budget
  });

  newReimbursement.save((err: Error) => {
    if (err) {
      console.log('[Error] ' + err.message);
      return failureResponse(err.message);
    }
    budget.addOrder(newReimbursement);
    successResponse();
  });
}

async function createOrderReimbursement(formBody: any, successResponse: () => void, failureResponse: (msg: string) => void): Promise<void> {
  let newItem: Item = new Item(formBody.item1Name, formBody.item1ProductNum, formBody.item1Price, formBody.item1Quantity, formBody.item1Project);
  let totalCost: number = newItem.getTotalCost() + Number(formBody.tax);
  let budget = await Budget.findByTeamName(formBody.subteam);
  let newReimbursement = new OrderReimbursement({
    requestor: formBody.requestor,
    subteam: formBody.subteam,
    supplier: formBody.supplier,
    tax: formBody.tax,
    item: newItem,
    totalCost: totalCost,
    title: newItem.name,
    comments: formBody.comments,
    budget: budget
  });

  newReimbursement.save((err: Error) => {
    if (err) {
      console.log('[Error] ' + err.message);
      return failureResponse(err.message);
    }
    budget.addOrder(newReimbursement);
    successResponse()
  })
}

async function createOrderRequest(formBody: any, successResponse: () => void, failureResponse: (errMsg: string) => void): Promise<void>{
  let requestedItem: Item = new Item(formBody.item1Name, formBody.item1ProductNum, formBody.item1Price, formBody.item1Quantity, formBody.item1Project);
  let totalCost: number = requestedItem.getTotalCost() + Number(formBody.shipping) + Number(formBody.tax);
  let orderTitle: string = requestedItem.name;
  let budget = await Budget.findByTeamName(formBody.subteam);
  let newRequest = new OnlineOrderRequest({
    requestor: formBody.requestor,
    subteam: formBody.subteam,
    supplier: formBody.supplier,
    tax: formBody.tax,
    needDate: formBody.date,
    item: requestedItem,
    shipping: formBody.shipping,
    link: formBody.link,
    totalCost: totalCost,
    title: orderTitle,
    comments: formBody.comments
  });

    newRequest.save((err: Error) => {
    if (err) {
      console.log('[Error] ' + err.message);
      failureResponse(err.message);
    } else {
      budget.addOrder(newRequest);
      successResponse()
    }
  });
}

async function createBatchRequest(formBody: any, successResponse: () => void, failureResponse: (errMsg: string) => void): Promise<void> {
  let itemsList: Item[] = createItemsList(formBody, formBody.numItems);
  let totalCost = Item.calculateTotalCostOfItems(itemsList) + Number(formBody.shipping) + Number(formBody.tax);
  let orderTitle = Item.getListOfNames(itemsList).join(', ');
  let budget = await Budget.findByTeamName(formBody.subteam);
  let slackMessage = await Slac
  let newBatchRequest = new OnlineBatchRequest({
    requestor: formBody.requestor,
    subteam: formBody.subteam,
    supplier: formBody.supplier,
    tax: formBody.tax,
    needDate: formBody.date,
    items: itemsList,
    shipping: formBody.shipping,
    link: formBody.link,
    totalCost: totalCost,
    title: orderTitle,
    comments: formBody.comments
  });

  newBatchRequest.save((err: Error) => {
    if (err) {
      console.log('[Error] ' + err.message);
      failureResponse(err.message);
    } else {
      budget.addOrder(newBatchRequest);
      successResponse();
    }
  });
}

export const postNewRequest = async (req: Request, res: Response) => {
  const SuccessResponse = () => { // What will happen on sucessful post
    req.flash('success', `Request created!`);
    res.redirect('/orders/view');
  }
  const FailureResponse = (errMsg: string) => { // What will happen on failed post
    req.flash(`errors`, `Error creating your request!`);
    req.flash('errors', errMsg)
    res.redirect('back');
  }
  if (req.body.numItems < 1) {
    req.flash('errors', 'Number of items can not be less than 1');
    res.redirect('back');
  }
  if (req.body.numItems == 1) {
   await createOrderRequest(req.body, SuccessResponse, FailureResponse);
  } 
  if (req.body.numItems > 1) {
    await createBatchRequest(req.body, SuccessResponse, FailureResponse);
  }
}


function createItemsList(formBody: any, numItems: number): Item[] {
  let items: Item[] = [];
  for(let i:number = 1; i <= numItems; i++) {
    let name: string = formBody[`item${i}Name`];
    let productNum: string = formBody[`item${i}ProductNum`];
    let price: number = Number(formBody[`item${i}Price`]);
    let quantity: number = Number(formBody[`item${i}Quantity`]);
    let project: string = formBody[`item${i}Project`];
    let newItem = new Item(name, productNum, price, quantity, project);
    items.push(newItem);
  }
  return items;
}


export const getViewOrders = async (req, res) => {
  if (req.query.search) {
    console.log(`Recieved serch term ${req.query.search}`);
    Order.find(
      {
        isOrdered: false,
        isReimbursed: false,
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
    let pendingOrders = await Order.findAllPendingOrders();
    pendingOrders = pendingOrders.map(x => x.toObject());
      res.render('bom/viewOrders', {
        user: req.user,
        orders: pendingOrders,
        activeView: true
      })
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

export const postEditOrder = (req, res) => {
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
    if (order.isOrdered) {
	    console.log("This item has already been ordered, updating BOM");
      Budget.find({}, (err, list) => {
        updateBudget(list[0], order, oldCost, (err) => {
		console.log("Made it");
          if (err) throw err;
          order.save((err) => {
		  console.log("Saved");
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

export const getCancelOrder = (req, res) => {
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
      if (order.isOrdered) {
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

export const getOrdering = (req, res) => {
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
    OrderMessage.findById(order.messageId, (err, msg) => {
      if (err) throw err;
      msg.editStatus("Ordered", req.user.slackID);
    })
    if (!order.isDigikey) {
      if (order.shipping === undefined) order.shipping = 0;
      if (order.tax === undefined) order.tax = 0;
      order.purchaser = user.name;
      order.dateOrdered = new Date();
      order.isOrdered = true;
      order.save((err) => {
        if (err) throw err;
        Budget.find({}, (err, list) => {
          if (err) throw new Error(err);
          updateBudget(list[0], order, null, (err, list) => {
            console.log("Updated Budget");
            req.flash('success', { msg: 'Order Updated' });
            return res.redirect('/orders/view');
          });
        });
      });
    } else {
      let numParts = order.item.split(',').length;
      let partNames = order.item.split(',');
      let partQuantities = order.quantity.split(',');
      let partNumbers = order.productNum.split(',');
      let partCosts = order.indvPrice.split(',');
      for (let i = 0; i < numParts; i++) {
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
        Budget.find({}, (err, list) => {
        if (err) throw new Error(err);
        updateBudget(list[0], order, null, (err, budget) => {
          console.log('budget updated')
        });
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
      Order.findOneAndDelete({ '_id': orderID }, (err) => {
        console.log('Order Deleted');
        req.flash('success', { msg: 'Item Updated' });
        return res.redirect('/orders/view');
      });
    }
  });
}

export const getApproving = (req, res) => {
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
      order.approvedBy = String(req.user.name);
      order.save((err) => {
        if (err) throw err;
        OrderMessage.findById(order.messageId, (err, msg) => {
          if (err) throw err;
          msg.editStatus("Approved", req.user.slackID);
        })
        req.flash('success', { msg: 'Order Approved' });
        return res.redirect('/orders/view');
      });
    });
  });
};

export const getDelivered = (req, res) => {
  if (!(req.user.isTeamLead || req.user.isAdmin || req.user.isFSC)) {
    return redirectToMain(req, res);
  }
  Order.findById(req.params.id, (err, order) => {
    if (err) throw err;
    if (!order) {
      req.flash('errors', {msg: 'This order does not exist'});
      res.redirect('/');
    }
    OrderMessage.findById(order.messageId, (err, msg) => {
      if (err) throw err;
      msg.editStatus("Delivered");
      req.flash('success', {msg: 'Order Status Updated'});
      res.redirect('/');
    });
  });
}


function updateBudget(budget, order, oldCost, callback) {
  let budgetID: number = budget._id;
	console.log(`${budgetID} is the budgetID`);
  let teamIndex: number = budget.findTeamIndex(order.subteam);
	console.log(`${teamIndex} is the teamIndex`);
  let newCurrentSpent = budget.currentSpent;
  if (oldCost) newCurrentSpent[teamIndex] -= oldCost;
  newCurrentSpent[teamIndex] += order.totalCost;
	console.log(`${oldCost} is oldCost ${order.totalCost} is new cost`);
    let update = { currentSpent: newCurrentSpent };
  Budget.findByIdAndUpdate(budgetID, update, { new: true }, callback);
}

function deleteOrderFromBudget(budget, order, callback) {
  let budgetID: Number = budget._id;
  let teamIndex: number = budget.findTeamIndex(order.subteam);
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

function sendOrderMessage(order, user) {
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
    SlackService.sendMessage(process.env.PURCHASING_CHANNEL, msg, null, (body) => {
      OrderMessage.create({
        slackTS: body.ts,
        order: order.id
      }, (err, msg) => {
        if (err) throw err;
        Order.findByIdAndUpdate(order.id,{messageId: msg._id}, {new: true}, (err, list) => {
          if (err) throw err;
        });
      });
    })
}

function createSlackResponse(order, user) {
  OrderMessage.findById(order.messageId, (err, thread) => {
    if (err) throw err;
    let msg =
    `<@${fscLead}>Request for ${order.item} has been approved by <@${user.slackID}>!`
  SlackService.sendThread(process.env.PURCHASING_CHANNEL, msg, null, thread.slackTS, (body) => {
  });
  }); 
}
export const sendApprovedResponse = createSlackResponse;
function redirectToMain(req, res) {
  req.flash('errors', { msg: 'You are not authorized to view that!' });
  res.redirect('/');
}
