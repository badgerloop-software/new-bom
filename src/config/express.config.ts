import * as mongoConfig from './mongo.config.js';
import * as bodyParser from 'body-parser';
import express from 'express';
import flash from 'express-flash';
import exphbs from 'express-handlebars';
import session from 'express-session';
import mongoose = require('mongoose');
import passport from 'passport';

import orderRouter from '../routes/orders.routes';
import authRouter from '../routes/auth.routes';

const router = express.Router();

class ExpressConfiguration {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setupDatabase();
        this.setupConfiguration();
    }

    private setupDatabase() {
    }

    private setupConfiguration() {
        this.app.set('view engine', 'handlebars');
        this.app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
        this.app.use(express.static('public'));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(session({
            secret: 'secret',
            saveUninitialized: true,
            resave: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());
        
        this.app.use('/orders', orderRouter);
        this.app.use('/auth', authRouter);
    }
}

export default new ExpressConfiguration().app;