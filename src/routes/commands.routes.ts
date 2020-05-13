// /commands
import express from 'express';
import * as commandsController from '../controllers/commands.controller';
let CommandsRouter = express.Router();

CommandsRouter.post('/report', commandsController.getBugReport);

export default CommandsRouter;