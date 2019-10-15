const news = require('../models/news');
const news = require('../models/news');
const Logs = require('../models/log');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

exports.news_create = function (req, res) {
    let news = new News(
        {
            title: req.body.title,
            imgName: req.body.imgName,
            subHeading: req.body.subHeading,
            body: req.body.body,
        }
    );

    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "create news piece",
            field: "Title: " + req.body.title,
        }
    );

    news.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `News piece created successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.news_details = function (req, res) {
    news.findById(req.params.id, function (err, news) {
        if (err) throw err;
        res.send(news);
    });
};

exports.news_list = function (req, res) {
    sponsors.find(function (err, news) {
        if (err) {
            console.log(err);
        } else {
            res.json(news);
        }
    });
};

exports.news_update = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "edit news piece",
            field: "Title: " + req.body.title,
        }
    );
    news.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, news) {
        if (err) return next(err);
        req.flash('success', { msg: `News piece updated successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.news_delete = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "delete news piece",
            field: "Title: " + req.body.title,
        }
    );
    news.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        req.flash('success', { msg: `News piece deleted successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};