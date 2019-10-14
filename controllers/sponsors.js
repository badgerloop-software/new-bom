const sponsors = require('../models/sponsor');
const Sponsors = require('../models/sponsor');
const Logs = require('../models/log');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

exports.sponsors_create = function (req, res) {
    let sponsors = new Sponsors(
        {
            tier: req.body.tier,
            company: req.body.company,
            website: req.body.website,
            logo: req.body.logo,
        }
    );

    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "create sponsor",
            field: "Comapny Name: " + req.body.company,
        }
    );

    sponsors.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Sponsor created successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.sponsors_details = function (req, res) {
    sponsors.findById(req.params.id, function (err, sponsors) {
        if (err) throw err;
        res.send(sponsors);
    });
};

exports.sponsors_list = function (req, res) {
    sponsors.find(function (err, sponsors) {
        if (err) {
            console.log(err);
        } else {
            res.json(sponsors);
        }
    });
};

exports.sponsors_update = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "edit sponsor",
            field: "Comapny Name: " + req.body.company,
        }
    );
    sponsors.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, sponsors) {
        if (err) return next(err);
        req.flash('success', { msg: `Sponsor updated successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.sponsors_delete = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "delete sponsor",
            field: "Company Name: " + req.body.company,
        }
    );
    sponsors.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        req.flash('success', { msg: `Sponsor deleted successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};