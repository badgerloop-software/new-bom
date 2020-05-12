"use strict";
exports.__esModule = true;
var bodyParser = require("body-parser");
var express = require("express");
var flash = require("express-flash");
var exphbs = require("express-handlebars");
var session = require("express-session");
var mongoConfig = require("./mongo.config.json");
var mongoose = require("mongoose");
var passport = require("passport");
var ExpressConfiguration = /** @class */ (function () {
    function ExpressConfiguration() {
        this.app = express();
        this.setupDatabase();
        this.setupConfiguration();
    }
    ExpressConfiguration.prototype.setupDatabase = function () {
        mongoose.connect(mongoConfig.url, { useNewUrlParser: true });
    };
    ExpressConfiguration.prototype.setupConfiguration = function () {
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
    };
    return ExpressConfiguration;
}());
exports["default"] = new ExpressConfiguration().app;
