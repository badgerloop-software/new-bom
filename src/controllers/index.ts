import {TeamleadController} from './teamleads.controllers';
import {AdminController} from './admin.controller';
import {AuthController} from './auth.controller';
import {BOMController} from './bom.controller';

const teamleadController = new TeamleadController();
const adminController = new AdminController();
const authController = new AuthController();
const bomController = new BOMController();

export {
    teamleadController,
    adminController,
    authController,
    bomController
};