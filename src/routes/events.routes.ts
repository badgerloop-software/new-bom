import {Router} from 'express';
import {eventsController} from '../controllers';
let EventsRouter = Router();
EventsRouter.post('/slackEventSub', eventsController.handleEvent);

export default EventsRouter;