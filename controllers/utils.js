exports.getCal = (req, res) => {
  res.render('calendar', {
    user: req.user,
    activeCalendar: true
  });
}
