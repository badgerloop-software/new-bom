const Users = require('../models/user');
const Orders = require('../models/order');

function getNumOrders(totalOrders) {
  return totalOrders.length;
}

function getNumUnapprovedOrders() {
 
}


function getNumUsers(totalUsers) {
  return totalUsers.length;
}

exports.getDash = (req, res) => {
  Orders.find({}, (err, orders) => {
    if (err) {
      console.error(err);
      req.flash('errors', { msg: 'Order Error occured, see console' });
      res.redirect('/');
    }
    Users.find({}, (err, users) => {
      if (err) {
        console.error(err);
        req.flash('errors', { msg: 'Error Occured, see conosle' });
        res.redirect('/')
      }
      Orders.find({isApproved: false}).exec((err, list) => {
        if (err) throw err;
        console.log(`List is ${list.length}`);
        let unapprovedListLength = String(list.length);
        let sum = 0;
        for(let i=0; i< orders.length; i++) {
          if(orders[i].isApproved) {
            sum += orders[i].cost;
            console.log(`Sum is now ${sum} the current cost is ${orders[i].cost}`)
          }
        }
        sum = sum.toFixed(2);
        
      res.render('adminDash', {
        user: req.user,
        users: users,
        orders: orders,
        activeAdmin: true,
        awaitingApproval: unapprovedListLength,
        numUsers: getNumUsers(users),
        numOrders: getNumOrders(orders),
        totalDollars: sum
      });
    });
    });
  });
};

exports.setUser = (req, res) => {
  let userQuery = {slackID: `${req.query.u}`};
  let role = req.query.r;
  let value = req.query.v;
  let change;
  if (role === 'f') {
    if (value === 't') {
      change = {isFSC: true}
    } else {
      change = {isFSC: false}
    }
  } else if (role === 'e') {
    if (value === 't') {
      change = {isAdmin: true}
    } else {
      change = {isAdmin: false}
    }
  }

  Users.findOneAndUpdate(userQuery, change, {new: true}, (err, user) => {
    if (err) {
      req.flash('errors', {msg: 'Something went wrong'});
      return res.redirect('back');
    }
    req.flash('success', {msg: 'User privilages modified'});
    return res.redirect('back');
  });
}
