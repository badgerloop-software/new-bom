// /cpb
import express from 'express';
import {criticalPathBotController} from '../controllers';
let CriticalPathBotRouter = express.Router();

CriticalPathBotRouter.get('/', criticalPathBotController.getCriticalPaths);

export default CriticalPathBotRouter;