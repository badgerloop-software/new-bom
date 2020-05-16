import {TeamleadController} from './teamleads.controllers';
import {AdminController} from './admin.controller';

const teamleadController = new TeamleadController();
const adminController = new AdminController();

export {
    teamleadController,
    adminController
};