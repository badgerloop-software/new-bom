import Sponsors from '../models/Sponsor.model';
import Logs from '../models/Log.model';

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

export const sponsors_create = function (req, res) {
    let newSponsor = new Sponsors(
        {
            tier: req.body.tier,
            company: req.body.company,
            website: req.body.website,
            logo: req.body.logo,
        }
    );

    let newLog = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "create sponsor",
            field: "Comapny Name: " + req.body.company,
        }
    );

    newSponsor.save(function (err, next) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Sponsor created successfully!` });
        return res.redirect('/crud');
    });
    newLog.save(function (err, next) {
        if (err) {
            return next(err);
        }
    });
};

export const sponsors_details = function (req, res) {
    Sponsors.findById(req.params.id, function (err, sponsors) {
        if (err) throw err;
        res.send(sponsors);
    });
};

export const sponsors_list = function (req, res) {
    Sponsors.find(function (err, sponsors) {
        if (err) {
            console.log(err);
        } else {
            res.json(sponsors);
        }
    });
};

export const sponsors_update = function (req, res) {
    let newLog = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "edit sponsor",
            field: "Comapny Name: " + req.body.company,
        }
    );
    Sponsors.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, sponsors, next) {
        if (err) return next(err);
        req.flash('success', { msg: `Sponsor updated successfully!` });
        return res.redirect('/crud');
    });
    newLog.save(function (err, next) {
        if (err) {
            return next(err);
        }
    });
};

export const sponsors_delete = function (req, res) {
    let newLog = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "delete sponsor",
            field: "Company Name: " + req.body.company,
        }
    );
    Sponsors.findByIdAndRemove(req.params.id, function (err, next) {
        if (err) return next(err);
        req.flash('success', { msg: `Sponsor deleted successfully!` });
        return res.redirect('/crud');
    });
    newLog.save(function (err, next) {
        if (err) {
            return next(err);
        }
    });
};