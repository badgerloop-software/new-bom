require('dotenv').config();
import app from './config/express.config';

const PORT = process.env.PORT || 7001;



const eventsController = require('./controllers/events');
const utilsController = require('./controllers/utils');

const passportConfig = require('./config/passport');


app.listen(PORT, () => {
  console.log('[INFO] Server running on ' + PORT);
});

app.post('/slackEventSub', eventsController.getSlackTest);
app.get('/calendar', passportConfig.isAuthenticated, utilsController.getCal);
