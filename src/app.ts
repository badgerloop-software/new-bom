require('dotenv').config();
import {ExpressConfiguration} from './config/express.config';
import * as passportConfig from './config/passport.config';
import * as utilsController from './controllers/utils.controller';
import {GenericReimbursement } from './models/orders/';
import * as ordersController from './controllers/orders.controller';
import { BudgetList } from './models/Budget.model';

const PORT = process.env.PORT || 7001;

const expressConfiguration = new ExpressConfiguration();
const app = expressConfiguration.app;

async function setupSlack() {
const checkSlackIntegration: boolean = await expressConfiguration.setupSlackIntegration();
if (!checkSlackIntegration) console.log("[Error] Failed to get channels, is slack setup correctly?");
else console.log("[INFO] Slack Integration Sucessful, Channels saved to SlackService.Channels");
}
setupSlack();


app.listen(PORT, () => {
  console.log('[INFO] Server running on ' + PORT);
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  
  res.render('homePage', {
    user: req.user,
    activeDashboard: true
  });
});

app.get('/newPlace', (req, res) => {
  res.render('bom/chooseOrder', {
    user: req.user
  });
});

app.get('/orders/request', (req, res) => {
  res.render('bom/makeOrder', {
    type: 'Request',
    isRequest: true,
    isReimbursement: false,
    user: req.user,
    teamList: "testTeam",
    post: "/orders/request"
  });
});

app.get('/orders/reimbursement', (req, res) => {
  res.render('bom/makeOrder', {
    type: 'Reimbursement',
    isRequest: false,
    isReimbursement: true,
    user: req.user,
    teamList: "testTeam",
    post: "/orders/reimbursement"
  })
});

app.get('/hasBudget',  async (req, res) => {
  let exists = await BudgetList.hasActiveBudget();
  res.send(exists);
});

app.get('/seeBudget', async (req, res) => {
  let list = await BudgetList.getActiveBudget();
  res.send(list);
})

app.post('/orders/request', ordersController.postNewRequest);
app.post('/orders/reimbursement', ordersController.postNewReimbursement);

app.get('/test', (req, res) => {
let testOrder = new GenericReimbursement({
  requestor: "Eric Udlis",
  totalCost: 100
});

testOrder.save((err) => {
  if (err) throw err;
  console.log('[Info] Saved');
  res.redirect('/');
})
});

app.get('/calendar', passportConfig.isAuthenticated, utilsController.getCal);
