const Users = require('../models/user');
const Orders = require('../models/order');
const Budgets = require('../models/budget');

exports.getTableView = (req, res) => {
  let user = req.user;
  if (!user.isFSC && !user.isAdmin) {
    req.flash('errors', {msg: 'You are not authorized to view that'});
    return res.redirect('/');
  }
  Budgets.find({}, (err, budgets) => {
    if (err) throw err;
    if (budgets === {}) {
      req.flash('errors', {msg: 'The Budget has not been initalized'});
      return res.redirect('/');
    }
    let budget = budgets[0];
    Orders.find({isOrdered: true},null, {sort: {subteam: 1}},(err, orders) => {
      if (err) throw err;
      res.render('tableView', {
        user: req.user,
        orders: orders,
        budget: budget,
        activeBOM: true
      });
    });
  });
}
