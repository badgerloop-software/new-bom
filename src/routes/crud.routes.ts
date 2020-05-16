import express from 'express';
import {crudController, crudLogsController} from '../controllers';
let CRUDController = express.Router();

CRUDController.get('/', crudController.getCrud);
CRUDController.get('/log', crudLogsController.getCrudLogs);
//app.get('/crud/sponsors/delete/:id', crudController.getDeleteSponsor);

export default CRUDController;