const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const bomDB = mongoose.createConnection(mongoConfig.bomURL);

const BudgetSchema = new mongoose.Schema({
  totalAllocated: {type: Number, default: 0},
  totalSpent: {type: Number, default: 0},
  totalLeft: {type: Number, default: 0},
  currentLeft: [Number],
  currentSpent: [Number],
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

BudgetSchema.methods.formatAllNumbers = function(fixed = 2) {
  console.log('HERE');
  let budget = this;
  for (let i = 0; i < budget.currentSpent.length; i++) {
    budget.currentSpent[i] = Number(budget.currentSpent[i]).toFixed(fixed);
  }
}
BudgetSchema.methods.findCurrentLeft = function(query = -1) {
    if (query == -1) { // If no team specified
        for(let i = 0; i < this.teamList.length; i++) {
            this.currentLeft[i] = Number(this.setBudgets[i] - this.currentSpent[i]).toFixed(2);
            return;
        }
    }else {
        this.currentLeft[query] = Number(this.setBudgets[i] - this.currentSpent[i]).toFixed(2);
        return this.currentLeft[query];
    }
}

module.exports = bomDB.model('Budgets', BudgetSchema);
