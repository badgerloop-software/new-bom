require('dotenv').config();
import app from './config/express.config';
import * as passportConfig from './config/passport.config';
import * as eventsController from './controllers/events.controller';
import * as utilsController from './controllers/utils.controller';

const PORT = process.env.PORT || 7001;



app.listen(PORT, () => {
  console.log('[INFO] Server running on ' + PORT);
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

app.post('/slackEventSub', eventsController.getSlackTest);
app.get('/calendar', passportConfig.isAuthenticated, utilsController.getCal);
