const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  totalAllocated: {type: Number, default: 0},
  totalSpent: {type: Number, default: 0},
  totalLeft: {type: Number, default: 0},
  currentBudgets: [Number],
  setBudgets: [Number],
  teamList: {type: [String], default: ['Analysis', 'Battery', 'Braking', 'Controls', 'Electrical Reliability', 'Electrical Hardware', 'Executitive', 'Operations', 'Powertrain', 'Propulsion', 'Software', 'Stability', 'Structural', 'ToolsAndWorkshop']},

});

BudgetSchema.methods.calculateTotal = function() {
  let top = this;
  this.total = 0;
  let subteams = Object.keys(top.subteams);
  subteams.forEach((team) => {
    top.total += top.subteams[team];
  });
}

BudgetSchema.methods.findTeamIndex = function(query) {
  let budget = this;
  for(let i = 0; i < budget.teamList.length; i++ ) {
    if (query === budget.teamList[i]) {
      return i;
    }
  }
  return null;
}

module.exports = mongoose.model('Budgets', BudgetSchema);
