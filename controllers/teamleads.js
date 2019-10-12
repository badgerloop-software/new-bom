const teamleads = require('../models/teamlead');
const Teamleads = require('../models/teamlead');
const Logs = require('../models/log');

const multer = require('multer');
const uploadTeamlead = multer({ dest: './uploads/teamleads' });
const fs = require('fs');

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

exports.teamleads_create = function (req, res) {
    let teamleads = new Teamleads(
        {
            Team: req.body.Team,
            Position: req.body.Position,
            Name: req.body.Name,
            Major: req.body.Major,
            Year: req.body.Year,
            Picture: req.body.Picture,
        }
    );

    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "create teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );

    teamleads.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Teamlead created successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.teamleads_details = function (req, res) {
    teamleads.findById(req.params.id, function (err, teamleads) {
        if (err) return next(err);
        res.send(teamleads);
    });
};

exports.teamleads_list = function (req, res) {
    teamleads.find(function (err, teamleads) {
        if (err) {
            console.log(err);
        } else {
            res.json(teamleads);
        }
    });
};

exports.teamleads_update = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "edit teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );
    teamleads.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, teamleads) {
        if (err) return next(err);
        req.flash('success', { msg: `Teamlead updated successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.teamleads_delete = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "delete teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );
    teamleads.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        req.flash('success', { msg: `Teamlead deleted successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.teamleads_upload = function() {
    uploadTeamlead.single('`teamleadImg`'), function (req, res, next) {
        if (err) {
            console.log('No File Uploaded');
            var filename = 'FILE NOT UPLOADED';
            req.flash('success', { msg: `Teamlead image upload failed!` });
            return res.redirect('/crud');
        }
        fs.rename('uploads/teamleads/' + req.file.filename, creds.IMAGES_FOLDER + '/teamleads/' + req.file.originalname, function (err) {
            if (err) console.log('ERROR: ' + err);
        });
        var filename = req.file.originalname;
        let logs = new Logs(
            {
                time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
                name: req.user.name,
                action: "uploaded teamlead image",
                field: "Image name: " + req.body.req.filename,
            }
        );
        logs.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        req.flash('success', { msg: `Teamlead Image Uploaded! Name of File: ${filename}` });
        return res.redirect('/crud');
    };
};