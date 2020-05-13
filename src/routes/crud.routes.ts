import express from 'express';
import * as crudController from '../controllers/CRUD.controller';
import * as crudLogController from '../controllers/crudLogs.controller';
let CRUDController = express.Router();

CRUDController.get('/', crudController.getCrud);
CRUDController.get('/log', crudLogController.getCrudLogs);
//app.get('/crud/sponsors/delete/:id', crudController.getDeleteSponsor);

export default CRUDController;