require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const ordersController = require('./controllers/orders');
const authController = require('./controllers/auth');
const mongoConfig = require('./config/mongo');

passportConfig = require('./config/passport');

const http = require('http');
const app = module.exports.app = express();
const server = http.createServer(app);
server.listen(7000);


mongoose.connect(mongoConfig.url, {useNewUrlParser: true});

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
  console.log(req.user);
  res.render('homePage', {
    user: req.user
  });
});

app.get('/orders/purchase', passportConfig.isAuthenticated,  ordersController.getMakeOrder);

app.get('/slack/auth', passport.authenticate('slack'));
app.get('/slack/auth/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
app.get('/logout', authController.getLogout);

