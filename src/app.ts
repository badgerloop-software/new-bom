require('dotenv').config();

const PORT = process.env.PORT || 7001;


import app from './config/express.config';

const eventsController = require('./controllers/events');
const utilsController = require('./controllers/utils');

const passportConfig = require('./config/passport');




const Logs = require('./models/log');
const fs = require('fs');

const slackService = require('./services/slack');



app.listen(PORT, () => {
  console.log('[INFO] Server running on ' + PORT);
});

app.post('/slackEventSub', eventsController.getSlackTest);
app.get('/calendar', passportConfig.isAuthenticated, utilsController.getCal);
