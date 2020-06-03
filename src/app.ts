require('dotenv').config();
import {ExpressConfiguration} from './config/express.config';
import * as passportConfig from './config/passport.config';
import * as utilsController from './controllers/utils.controller';
import {GenericReimbursement } from './models/orders/';
import * as ordersController from './controllers/orders.controller';

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
    user: req.user,
    teamList: "testTeam"
  });
});

app.post('/orders/request', ordersController.postNewRequest);

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
