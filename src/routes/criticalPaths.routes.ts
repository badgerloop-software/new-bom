// /criticalPaths
import express from 'express';
import {criticalPathsController} from '../controllers'
let CriticalPathRouter = express.Router();

CriticalPathRouter.post('/create', criticalPathsController.createCriticalPath);
CriticalPathRouter.get('/:id', criticalPathsController.getCriticalPath);
CriticalPathRouter.get('/', criticalPathsController.listCriticalPaths);
CriticalPathRouter.post('/:id/update', criticalPathsController.updateCriticalPath);
CriticalPathRouter.post('/:id/delete', criticalPathsController.deleteCriticalPath);

export default CriticalPathRouter;