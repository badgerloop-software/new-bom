exports.getMakeOrder = (req, res) => {
  console.log(req.user);
  res.render('makeOrder', {
    user: req.user
  })
}

exports.postMakeOrder = (req, res) => {
  
}
