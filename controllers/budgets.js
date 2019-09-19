const Budgets = require('../models/budget');

exports.getEdit = (req, res) => {
  res.send('Edit Budget');
}

function createMongoBudget(req, res, teamList, budgetList) {
  if (req.user.isFSC || req.user.isAdmin) {
    let currentSpent = [];
    for (let i = 0; i < teamList.length; i++) {
      currentSpent[i] = 0;
    }
    let options = {
      teamList: teamList,
      currentSpent: currentSpent,
      setBudgets: budgetList
    }

    Budgets.create(options, (err, budget) => {
      if (err) throw err;
      req.flash('success', { msg: 'Budget Deployed, Welcome to the Badgerloop BOM Boss' });
      return res.redirect('/admin/dashboard');
    });
  } else {
    req.flash('error', { msg: 'You are not authorized to do this' });
    return res.redirect('/');
  }
}

exports.createBudgets = (req, res) => {
  const NUMTEAMS = req.body.numTeams;
  console.log(NUMTEAMS)
  let namesArray = [];
  let budgetsArray = [];
  for (let i = 0; i < NUMTEAMS; i++) {
    namesArray[i] = req.body[`name${i}`];
    budgetsArray[i] = req.body[`budget${i}`]
  }
  return createMongoBudget(req, res, namesArray, budgetsArray)
}

exports.getDelete = (req, res) => {
  Budgets.remove({}, () => {
    req.flash('success', {msg: 'Budget Deleted'});
    res.redirect('/admin/dashboard');
  })
}
