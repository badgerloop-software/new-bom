exports.getMakeOrder = (req, res) => {
  res.render('makeOrder', {
    user: req.user
  })
}

exports.postMakeOrder = (req, res) => {
  
}
