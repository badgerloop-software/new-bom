// /cpb
import express from 'express';
import * as critialPathBotController from '../controllers/criticalPathBot.controller';
let CriticalPathBotRouter = express.Router();

CriticalPathBotRouter.get('/', critialPathBotController.getCriticalPaths);

export default CriticalPathBotRouter;