import Teamleads from '../models/TeamLead.model';
import Logs from '../models/Log.model';

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

export const teamleads_create = function (req, res) {
    let newTeamlead = new Teamleads(
        {
            Team: req.body.Team,
            Position: req.body.Position,
            Name: req.body.Name,
            Major: req.body.Major,
            Year: req.body.Year,
            Picture: req.body.Picture,
        }
    );

    let newLog = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "create teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );

    Teamleads.save(function (err, next) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Teamlead created successfully!` });
        return res.redirect('/crud');
    });
    newLog.save(function (err, next) {
        if (err) {
            return next(err);
        }
    });
};

export const teamleads_details = function (req, res) {
    Teamleads.findById(req.params.id, function (err, teamleads, next) {
        if (err) return next(err);
        res.send(teamleads);
    });
};

export const teamleads_list = function (_req, res) {
    Teamleads.find(function (err, teamleads) {
        if (err) {
            console.log(err);
        } else {
            res.json(teamleads);
        }
    });
};

export const teamleads_update = function (req, res) {
    let newLog = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "edit teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );
    Teamleads.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, _teamleads, next) {
        if (err) return next(err);
        req.flash('success', { msg: `Teamlead updated successfully!` });
        return res.redirect('/crud');
    });
    newLog.save(function (err, next) {
        if (err) {
            return next(err);
        }
    });
};

export const teamleads_delete = function (req, res) {
    Teamleads.findByIdAndRemove(req.params.id, function (err, next) {
        if (err) return next(err);
        let logs = new Logs(
            {
                time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
                name: req.user.name,
                action: "delete teamlead",
                field: "Teamlead Name: " + req.body.Name,
            }
        );
        logs.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        req.flash('success', { msg: `Teamlead deleted successfully!` });
        return res.redirect('/crud');
    });
};