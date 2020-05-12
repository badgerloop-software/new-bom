import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as flash from 'express-flash';
import * as exphbs from 'express-handlebars';
import * as session from 'express-session';
import * as mongoConfig from './mongo.config.json.js';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

class ExpressConfiguration {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setupDatabase();
        this.setupConfiguration();
    }

    private setupDatabase() {
        mongoose.connect(mongoConfig.url, {useNewUrlParser: true});
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
    }
}

export default new ExpressConfiguration().app;