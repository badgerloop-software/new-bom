import Budgets from '../models/Budget.model';


export const getEdit = (req, res) => {
  if(!req.user || (!req.user.isFSC && !req.user.isAdmin)) {
    req.flash('error', {msg: 'You are not authorized to do this'});
    return res.redirect('back');
  }
  Budgets.findOne({}, (err, budget) => {
    if (err) throw err;
    console.log(budget);
    res.render('bom/editBudget', {
      user: req.user,
      settings: mongoObjectToHBS(budget),
      numTeams: budget.teamList.length
    });
  });
}
function mongoObjectToHBS(mongoObject) {
  let obj = {};
  let len = mongoObject.teamList.length;
  let teamList = mongoObject.teamList;
  let budgetList = mongoObject.setBudgets;
  for(let i=0;i<len;i++) {
    obj[i] = {"name" : teamList[i], "budget":budgetList[i]};
  }
  return obj;
}
export const postEdit = (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    req.flash('error', {msg: 'You are not authorized to do this'});
    return res.redirect('back');
  }
    const NUMTEAMS = req.body.numTeams;
    let namesArray = [];
    let budgetsArray = [];
    for (let i = 0; i < NUMTEAMS; i++) {
      namesArray[i] = req.body[`name${i}`];
      budgetsArray[i] = req.body[`budget${i}`]
    }
    return updateMongoBudget(req, res, namesArray, budgetsArray)
}
function updateMongoBudget(req, res, teamList, budgetList) {
  if (req.user.isFSC || req.user.isAdmin) {
    let options = {
      setBudgets: budgetList
    }

    Budgets.findOneAndUpdate({},options, (err, budget) => {
      if (err) throw err;
      req.flash('success', { msg: 'Budget Updated, Systems updated' });
      return res.redirect('/admin/dashboard');
    });
  } else {
    req.flash('error', { msg: 'You are not authorized to do this' });
    return res.redirect('/');
  }
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

export const createBudgets = (req, res) => {
  const NUMTEAMS = req.body.numTeams;
  let namesArray = [];
  let budgetsArray = [];
  for (let i = 0; i < NUMTEAMS; i++) {
    namesArray[i] = req.body[`name${i}`];
    budgetsArray[i] = req.body[`budget${i}`]
  }
  return createMongoBudget(req, res, namesArray, budgetsArray)
}

export const getDelete = (req, res) => {
  Budgets.remove({}, () => {
    req.flash('success', {msg: 'Budget Deleted'});
    res.redirect('/admin/dashboard');
  })
}
