// /commands
import express from 'express';
import { commandsController } from '../controllers';
let CommandsRouter = express.Router();

CommandsRouter.post('/report', commandsController.getBugReport);

export default CommandsRouter;