require('dotenv').config();

const PORT = process.env.PORT || 7001;
console.log(process.env.CLIENT_ID);
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const multer = require('multer');

const ordersController = require('./controllers/orders');
const authController = require('./controllers/auth');
const eventsController = require('./controllers/events');
const adminController = require('./controllers/admin');
const budgetController = require('./controllers/budgets');
const bomController = require('./controllers/bom');
const crudController = require('./controllers/crud');
const sponsorsController = require('./controllers/sponsors');
const teamleadscontroller = require('./controllers/teamleads');
const utilsController = require('./controllers/utils');

const passportConfig = require('./config/passport');

const app = module.exports.app = express();
const server = http.createServer(app);
server.listen(PORT);
console.log(`The party is happening on ${PORT}, who do you know here?`)


app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

app.get('/', (req, res) => {
  res.render('homePage', {
    user: req.user,
    activeDashboard: true
  });
});


// Orders Routes
app.get('/orders/purchase',passportConfig.isAuthenticated,  ordersController.getMakeOrder);
app.post('/orders/purchase', ordersController.postMakeOrder);
app.get('/orders/view', passportConfig.isAuthenticated, ordersController.getViewOrders);
app.post('/orders/view', passportConfig.isAuthenticated, ordersController.postViewOrders);
app.get('/orders/edit/:id', ordersController.getEditOrders);
app.post('/orders/edit', ordersController.postEditOrder);
app.get('/orders/cancel', ordersController.getCancelOrder);
app.get('/orders/place/:id', ordersController.getOrdering);
app.get('/orders/approve/:id', ordersController.getApproving);

// Crud Routes
app.get('/crud', crudController.getCrud);
//app.get('/crud/sponsors/delete/:id', crudController.getDeleteSponsor);


// Slack and User Control Routes
app.get('/slack/auth', passport.authenticate('slack'));
app.get('/slack/auth/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
app.get('/logout', authController.getLogout);

app.post('/slack/events', (req, res) => {
  console.log(req);
  return res.status(200).send();
})
app.get('/slack/reaction?challenge=:event', eventsController.getEvent);

// Admin Routes
app.get('/admin/dashboard', passportConfig.isAuthenticated, adminController.getDash);
app.get('/admin/set', passportConfig.isAuthenticated, adminController.setUser);
app.get('/admin/createbudget', passportConfig.isAuthenticated, adminController.createBudget);

// Budget Routes
app.get('/budget/edit', passportConfig.isAuthenticated, budgetController.getEdit);
app.post('/budget/createBudget', budgetController.createBudgets);
app.get('/budget/delete', passportConfig.isAuthenticated, budgetController.getDelete);

// Utilities Routes
app.get('/calendar', passportConfig.isAuthenticated, utilsController.getCal);

// Table View Routes
app.get('/bom', passportConfig.isAuthenticated, bomController.getTableView);
app.post('/bom', passportConfig.isAuthenticated, bomController.postTableView);

// Sponsor Routes
app.post('/sponsors/create', sponsorsController.sponsors_create);
app.get('/sponsors/:id', sponsorsController.sponsors_details);
app.get('/sponsors/', sponsorsController.sponsors_list);
app.post('/sponsors/:id/update', sponsorsController.sponsors_update);
app.post('/sponsors/:id/delete', sponsorsController.sponsors_delete);
app.post('/sponsors/upload', sponsorsController.sponsors_upload);

// TeamLead Routes
app.post('/teamleads/create', teamleadscontroller.teamleads_create);
app.get('/teamleads/:id', teamleadscontroller.teamleads_details);
app.get('/teamleads/', teamleadscontroller.teamleads_list);
app.post('/teamleads/:id/update', teamleadscontroller.teamleads_update);
app.post('/teamleads/:id/delete', teamleadscontroller.teamleads_delete);
app.post('/teamleads/upload', teamleadscontroller.teamleads_upload);
