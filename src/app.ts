require('dotenv').config();
const PORT = process.env.PORT || 7000;
import app from './config/express.config';

const eventsController = require('./controllers/events');
const adminController = require('./controllers/admin');


const passportConfig = require('./config/passport');

app.listen(PORT, () => {
  console.log('[INFO] Listening on port ' + PORT);
});





app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  console.log(req.user);
  res.render('homePage', {
    user: req.user,
    activeDashboard: true
  });
});




app.get('/admin/dashboard', passportConfig.isAuthenticated, adminController.getDash);
app.get('/admin/set', passportConfig.isAuthenticated, adminController.setUser);

app.get('/slack/reaction?challenge=:event', eventsController.getEvent);

