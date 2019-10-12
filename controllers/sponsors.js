const sponsors = require('../models/sponsor');
const Sponsors = require('../models/sponsor');
const Logs = require('./models/log');

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