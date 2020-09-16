require('dotenv').config();

const PORT = process.env.PORT || 7001;
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
const crudLogController = require('./controllers/crudLog');
const sponsorsController = require('./controllers/sponsors');
const teamleadscontroller = require('./controllers/teamleads');
const newsController = require('./controllers/news_controller');
const utilsController = require('./controllers/utils');
const vendorsController = require('./controllers/vendors');
const criticalPathsController = require('./controllers/criticalPaths');
const cpbController = require('./controllers/cpb');

const passportConfig = require('./config/passport');

const uploadTeamlead = multer({ dest: './uploads/teamleads' });
const uploadSponsor = multer({ dest: './uploads/sponsors' });
const uploadNews = multer({ dest: './uploads/news' });
const Logs = require('./models/log');
const fs = require('fs');

const slackService = require('./services/slack');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

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
app.get('/orders/delivered/:id', passportConfig.isAuthenticated, ordersController.getDelivered);

// Crud Routes
app.get('/crud', crudController.getCrud);
app.get('/crudLog', crudLogController.getCrudLogs);
//app.get('/crud/sponsors/delete/:id', crudController.getDeleteSponsor);


// Slack and User Control Routes
app.get('/slack/auth', passport.authenticate('slack'));
app.get('/slack/auth/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
app.get('/logout', authController.getLogout);

app.post('/slackEventSub', eventsController.getSlackTest);

// Admin Routes
app.get('/admin/dashboard', passportConfig.isAuthenticated, adminController.getDash);
app.get('/admin/set', passportConfig.isAuthenticated, adminController.setUser);
app.get('/admin/createbudget', passportConfig.isAuthenticated, adminController.createBudget);

// Budget Routes
app.get('/budget/edit', passportConfig.isAuthenticated, budgetController.getEdit);
app.post('/budget/createBudget', budgetController.createBudgets);
app.get('/budget/delete', passportConfig.isAuthenticated, budgetController.getDelete);
app.get('/budget/editBudget', budgetController.getEdit);
app.post('/budget/editBudget', budgetController.postEdit);

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

// TeamLead Routes
app.post('/teamleads/create', teamleadscontroller.teamleads_create);
app.get('/teamleads/:id', teamleadscontroller.teamleads_details);
app.get('/teamleads/', teamleadscontroller.teamleads_list);
app.post('/teamleads/:id/update', teamleadscontroller.teamleads_update);
app.post('/teamleads/:id/delete', teamleadscontroller.teamleads_delete);

// Vendor Routes
app.get('/vendors/list', passportConfig.isAuthenticated, vendorsController.getListVendors);
app.post('/vendors/add', passportConfig.isAuthenticated, vendorsController.postAddVendor);
app.get('/vendors/delete', passportConfig.isAuthenticated, vendorsController.getDeleteVendor);
app.get('/vendors/getPass', passportConfig.isAuthenticated, vendorsController.getPassword);
app.post('/vendors/edit', passportConfig.isAuthenticated, vendorsController.postEditVendor);

// News Routes
app.post('/news/create', newsController.news_create);
app.get('/news/:id', newsController.news_details);
app.get('/news/', newsController.news_list);
app.post('/news/:id/update', newsController.news_update);
app.post('/news/:id/delete', newsController.news_delete);

// CPB Routes
app.get('/cpb', cpbController.getCriticalPaths);

// Command Routes
app.post('/commands/report',commandsController.getBugReport);

app.post('/criticalPaths/create', criticalPathsController.cp_create);
app.get('/criticalPaths/:id', criticalPathsController.cp_details);
app.get('/criticalpaths/', criticalPathsController.cp_list);
app.post('/criticalPaths/:id/update', criticalPathsController.cp_update);
app.post('/criticalPaths/:id/delete', criticalPathsController.cp_delete);

app.post('/sponsors/upload', uploadSponsor.single('sponsorImg'), (req, res) => {
  if (req.file) {
    console.log('Uploading file...');
    fs.rename('uploads/sponsors/' + req.file.filename, process.env.IMAGES_FOLDER + '/sponsors/' + req.file.originalname, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    var filename = req.file.originalname;
    let logs = new Logs(
      {
        time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
        name: req.user.name,
        action: "uploaded sponsor image",
        field: "Image name: " + filename,
      }
    );
    logs.save(function (err) {
      if (err) {
        return next(err);
      }
    });
    req.flash('success', { msg: `Sponsor Image Uploaded! Name of File: ${filename}` });
    return res.redirect('/crud');
  } else {
    console.log('No File Uploaded');
    var filename = 'FILE NOT UPLOADED';
    req.flash('success', { msg: `Sponsor image upload failed!` });
    return res.redirect('/crud');
  }
});
app.post('/teamleads/upload', uploadTeamlead.single('teamleadImg'), (req, res) => {
  if (req.file) {
    console.log('Uploading file...');
    fs.rename('uploads/teamleads/' + req.file.filename, process.env.IMAGES_FOLDER + '/teamleads/' + req.file.originalname, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    // shell.mv('uploads/sponsors/' + req.file.filename', 'file2', 'dir/');
    var filename = req.file.originalname;
    let logs = new Logs(
      {
        time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
        name: req.user.name,
        action: "uploaded teamlead image",
        field: "Image name: " + filename,
      }
    );
    logs.save(function (err) {
      if (err) {
        return next(err);
      }
    });
    req.flash('success', { msg: `Teamlead Image Uploaded! Name of File: ${filename}` });
    return res.redirect('/crud');
  } else {
    console.log('No File Uploaded');
    var filename = 'FILE NOT UPLOADED';
    req.flash('success', { msg: `Teamlead image upload failed!` });
    return res.redirect('/crud');
  }
});
app.post('/news/upload', uploadNews.single('newsImg'), (req, res) => {
  if (req.file) {
    console.log('Uploading file...');
    fs.rename('uploads/news/' + req.file.filename, process.env.IMAGES_FOLDER + '/news/' + req.file.originalname, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    // shell.mv('uploads/sponsors/' + req.file.filename', 'file2', 'dir/');
    var filename = req.file.originalname;
    let logs = new Logs(
      {
        time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
        name: req.user.name,
        action: "uploaded news image",
        field: "Image name: " + filename,
      }
    );
    logs.save(function (err) {
      if (err) {
        return next(err);
      }
    });
    req.flash('success', { msg: `News Image Uploaded! Name of File: ${filename}` });
    return res.redirect('/crud');
  } else {
    console.log('No File Uploaded');
    var filename = 'FILE NOT UPLOADED';
    req.flash('success', { msg: `News image upload failed!` });
    return res.redirect('/crud');
  }
});
