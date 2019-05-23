const Order = require('../models/order');
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

  order.save((err) => {
    if (err) return next(err);
    return res.redirect('/');
  });
}
