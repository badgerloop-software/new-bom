// /teamleads
import express from 'express';
import * as teamleadscontroller from '../controllers/teamleads.controllers';
import multer from 'multer';
const uploadTeamlead = multer({ dest: './uploads/teamleads' });
let TeamLeadRouter = express.Router();

TeamLeadRouter.post('/create', teamleadscontroller.teamleads_create);
TeamLeadRouter.get('/:id', teamleadscontroller.teamleads_details);
TeamLeadRouter.get('/', teamleadscontroller.teamleads_list);
TeamLeadRouter.post('/:id/update', teamleadscontroller.teamleads_update);
TeamLeadRouter.post('/:id/delete', teamleadscontroller.teamleads_delete);

export default TeamLeadRouter;