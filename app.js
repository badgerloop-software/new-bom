require('dotenv').config();
let creds = require("./creds.json");

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

const passportConfig = require('./config/passport');

const multer = require('multer');
const uploadTeamlead = multer({ dest: './uploads/teamleads' });
const uploadSponsor = multer({ dest: './uploads/sponsors' });
const fs = require('fs');

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

app.get('/orders/purchase',passportConfig.isAuthenticated,  ordersController.getMakeOrder);
app.post('/orders/purchase', ordersController.postMakeOrder);
app.get('/orders/view', passportConfig.isAuthenticated, ordersController.getViewOrders);
app.post('/orders/view', passportConfig.isAuthenticated, ordersController.postViewOrders);
app.get('/orders/edit/:id', ordersController.getEditOrders);
app.post('/orders/edit', ordersController.postEditOrder);
app.get('/orders/cancel', ordersController.getCancelOrder);
app.get('/orders/place/:id', ordersController.getOrdering);
app.get('/orders/approve/:id', ordersController.getApproving);

app.get('/crud', crudController.getCrud);
//app.get('/crud/sponsors/delete/:id', crudController.getDeleteSponsor);

app.get('/slack/auth', passport.authenticate('slack'));
app.get('/slack/auth/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
app.get('/logout', authController.getLogout);

app.post('/slack/events', (req, res) => {
  console.log(req);
  return res.status(200).send();
})

app.get('/admin/dashboard', passportConfig.isAuthenticated, adminController.getDash);
app.get('/admin/set', passportConfig.isAuthenticated, adminController.setUser);
app.get('/admin/createbudget', passportConfig.isAuthenticated, adminController.createBudget);

app.get('/budget/edit', passportConfig.isAuthenticated, budgetController.getEdit);
app.post('/budget/createBudget', budgetController.createBudgets);
app.get('/budget/delete', passportConfig.isAuthenticated, budgetController.getDelete);
app.get('/slack/reaction?challenge=:event', eventsController.getEvent);

app.get('/bom', passportConfig.isAuthenticated, bomController.getTableView);
app.post('/bom', passportConfig.isAuthenticated, bomController.postTableView);

app.post('/sponsors/create', sponsorsController.sponsors_create);
app.get('/sponsors/:id', sponsorsController.sponsors_details);
app.get('/sponsors/', sponsorsController.sponsors_list);
app.post('/sponsors/:id/update', sponsorsController.sponsors_update);
app.post('/sponsors/:id/delete', sponsorsController.sponsors_delete);

app.post('/teamleads/create', teamleadscontroller.teamleads_create);
app.get('/teamleads/:id', teamleadscontroller.teamleads_details);
app.get('/teamleads/', teamleadscontroller.teamleads_list);
app.post('/teamleads/:id/update', teamleadscontroller.teamleads_update);
app.post('/teamleads/:id/delete', teamleadscontroller.teamleads_delete);

app.post('/sponsors/upload', uploadSponsor.single('sponsorImg'), (req, res) => {
  if (req.file) {
    console.log('Uploading file...');
    fs.rename('uploads/sponsors/' + req.file.filename, creds.IMAGES_FOLDER + '/sponsors/' + req.file.originalname, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    var filename = req.file.originalname;
    req.flash('success', { msg: `Sponsor Image Uploaded! Name of File: ${filename}` });
    return res.redirect('/crud');
  } else {
    console.log('No File Uploaded');
    var filename = 'FILE NOT UPLOADED';
    req.flash('success', { msg: `Sponsor image upload failed!` });
    return res.redirect('/crud');
  }
  /* ===== Add the function to save filename to database ===== */
});
app.post('/teamleads/upload', uploadTeamlead.single('teamleadImg'), (req, res) => {
  if (req.file) {
    console.log('Uploading file...');
    fs.rename('uploads/teamleads/' + req.file.filename, creds.IMAGES_FOLDER + '/teamleads/' + req.file.originalname, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    // shell.mv('uploads/sponsors/' + req.file.filename', 'file2', 'dir/');
    var filename = req.file.originalname;
    req.flash('success', { msg: `Teamlead Image Uploaded! Name of File: ${filename}` });
    return res.redirect('/crud');
  } else {
    console.log('No File Uploaded');
    var filename = 'FILE NOT UPLOADED';
    req.flash('success', { msg: `Teamlead image upload failed!` });
    return res.redirect('/crud');
  }
  /* ===== Add the function to save filename to database ===== */
});