import {TeamleadController} from './teamleads.controllers';
import {AdminController} from './admin.controller';
import {AuthController} from './auth.controller';
import {BOMController} from './bom.controller';
import {BudgetsController} from './budgets.controller';
import {CommandsController} from './commands.controller';
import {CriticalPathsController} from './criticalPath.controller';

const teamleadController = new TeamleadController();
const adminController = new AdminController();
const authController = new AuthController();
const bomController = new BOMController();
const budgetsController = new BudgetsController();
const commandsController = new CommandsController();
const criticalPathsController = new CriticalPathsController();

export {
    teamleadController,
    adminController,
    authController,
    bomController,
    budgetsController,
    commandsController,
    criticalPathsController
};