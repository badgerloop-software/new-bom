// /criticalPaths
import express from 'express';
import * as criticalPathsController from '../controllers/criticalPath.controller';
let CriticalPathRouter = express.Router();

CriticalPathRouter.post('/create', criticalPathsController.cp_create);
CriticalPathRouter.get('/:id', criticalPathsController.cp_details);
CriticalPathRouter.get('/', criticalPathsController.cp_list);
CriticalPathRouter.post('/:id/update', criticalPathsController.cp_update);
CriticalPathRouter.post('/:id/delete', criticalPathsController.cp_delete);

export default CriticalPathRouter;