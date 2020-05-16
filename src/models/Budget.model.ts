import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config';
const bomDB = mongoose.createConnection(mongoConfig.BOM_URL);

const BudgetSchema = new mongoose.Schema({
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
        this.currentLeft[query] = Number(this.setBudgets[query] - this.currentSpent[query]).toFixed(2);
        return this.currentLeft[query];
    }
}

BudgetSchema.statics.getActiveBudget = function(): any {
  return this.findOne({});
}

BudgetSchema.virtual('totalSpent').get(function(): number {
  let totalSpent: number = 0;
  for(let i: number = 0; i < this.teamList.length; i++) {
    totalSpent += this.currentSpent[i];
  }
  return totalSpent;
});

export default bomDB.model('Budgets', BudgetSchema);
