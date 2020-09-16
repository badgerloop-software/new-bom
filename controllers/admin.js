const Users = require('../models/user');
const Orders = require('../models/order');
const Budgets = require('../models/budget');

function getNumOrders(totalOrders) {
  return totalOrders.length;
}

function getNumUsers(totalUsers) {
  return totalUsers.length;
}

function setTable(budgets) {
  let budget = budgets[0];
  let table = [];
  if (budget !== undefined) {
    for (let i = 0; i < budget.teamList.length; i++) {
      let spent = budget.currentSpent[i];
      let left = Number(budget.setBudgets[i] - budget.currentSpent[i]).toFixed(2);
      let teamArray = [budget.teamList[i], budget.setBudgets[i], spent, left]
      table.push(teamArray);
    }
  }
  return table;
}

function findSum(orders) {
  let sum = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].isOrdered) {
      sum += orders[i].totalCost;
    }
  }
  return sum.toFixed(2);
}

function handleError(err) {
  console.error(err);
  req.flash('errors', { msg: 'Order Error occured, see console' });
  return res.redirect('/');
}

exports.getDash = (req, res) => {
  Budgets.find({}, (err, budgets) => {
    if (err) handleError(err);
    budgets[0].formatAllNumbers();
    Orders.find({}, (err, orders) => {
      if (err) handleError(err);
      Users.find({}, (err, users) => {
        if (err) handleError(err);
        Orders.find({ isApproved: false }).exec((err, list) => {
          if (err) handleError(err);
          res.render('bom/adminDash', {
            user: req.user,
            users: users,
            orders: orders,
            activeAdmin: true,
            awaitingApproval: String(list.length),
            numUsers: getNumUsers(users),
            numOrders: getNumOrders(orders),
            totalDollars: findSum(orders),
            budget: budgets[0],
            table: setTable(budgets)
          });
        });
      });
    });
  });
};

exports.setUser = (req, res) => {
  let userQuery = { slackID: `${req.query.u}` };
  let role = req.query.r;
  let value = req.query.v;
  let change;
  if (role === 'f') {
    if (value === 't') {
      change = { isFSC: true }
    } else {
      change = { isFSC: false }
    }
  } else if (role === 'e') {
    if (value === 't') {
      change = { isAdmin: true }
    } else {
      change = { isAdmin: false }
    }
  }

  Users.findOneAndUpdate(userQuery, change, { new: true }, (err, user) => {
    if (err) {
      req.flash('errors', { msg: 'Something went wrong' });
      return res.redirect('back');
    }
    req.flash('success', { msg: 'User privilages modified' });
    return res.redirect('back');
  });
}

exports.createBudget = (req, res) => {
  res.render('bom/createBudget', {
    user: req.user
  })
}
