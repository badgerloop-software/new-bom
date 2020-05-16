import * as bodyParser from 'body-parser';
import express from 'express';
import flash from 'express-flash';
import exphbs from 'express-handlebars';
import session from 'express-session';
import cookieParser = require('cookie-parser');
import passport from 'passport';
import Handlebars from 'handlebars';
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

import orderRouter from '../routes/orders.routes';
import authRouter from '../routes/auth.routes';
import adminRouter from '../routes/admin.routes';
import bomRouter from '../routes/bom.routes';
import budgetRouter from '../routes/budget.routes';
import commandRouter from '../routes/commands.routes';
import criticalPathBotRouter from '../routes/criticalPathBot.routes';
import criticalPathsRouter from '../routes/criticalPaths.routes';
import CRUDRouter from '../routes/crud.routes';
import newsRouter from '../routes/news.routes';
import sponsorsRouter from '../routes/sponosors.routes';
import vendorsRouter from '../routes/vendors.routes';

import {TeamLeadRouter} from '../routes';

import {SlackService} from '../services/SlackService'
export class ExpressConfiguration {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setupDatabase();
        this.setupConfiguration();
    }

    public async setupSlackIntegration(): Promise<boolean> { // This function CAN NOT be called in the constructor
        let slackCheck: boolean = await SlackService.createChannelsMap();
        if (!slackCheck) {
            console.log("[Error] Cannot get Slack Channels");
        }
        return slackCheck
    }

    private setupDatabase() {
    }

    private setupConfiguration() {
        this.app.set('view engine', 'handlebars');
        this.app.engine('handlebars', exphbs({ 
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(Handlebars) 
        }));
        this.app.use(express.static('src/public'));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(flash());
        this.app.use(cookieParser('IAmOnceAgainAskingForYourFinancialSupport'));
        this.app.use(session({
            secret: 'IAmOnceAgainAskingForYourFinancialSupport',
            name: 'Badgerloop',
            proxy: false,
            resave: true,
            saveUninitialized: true

        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        
        this.app.use('/orders', orderRouter);
        this.app.use('/auth', authRouter);
        this.app.use('/admin', adminRouter);
        this.app.use('/bom', bomRouter);
        this.app.use('/budget', budgetRouter);
        this.app.use('/command', commandRouter);
        this.app.use('/cpb', criticalPathBotRouter);
        this.app.use('/criticalPaths', criticalPathsRouter);
        this.app.use('/crud', CRUDRouter);
        this.app.use('/news', newsRouter);
        this.app.use('/sponsors', sponsorsRouter);
        this.app.use('/teamleads', TeamLeadRouter);
        this.app.use('/vendors', vendorsRouter);
    }
}