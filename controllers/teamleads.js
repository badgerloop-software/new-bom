const teamleads = require('../models/teamlead');
const Teamleads = require('../models/teamlead');

const multer = require('multer');
const uploadTeamlead = multer({ dest: './uploads/teamleads' });
const fs = require('fs');

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

    teamleads.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Teamlead created successfully!` });
        return res.redirect('/crud');
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
    teamleads.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, teamleads) {
        if (err) return next(err);
        req.flash('success', { msg: `Teamlead updated successfully!` });
        return res.redirect('/crud');
    });
};

exports.teamleads_delete = function (req, res) {
    teamleads.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        req.flash('success', { msg: `Teamlead deleted successfully!` });
        return res.redirect('/crud');
    });
};

exports.teamleads_upload = function(req, res) {
    uploadTeamlead.single('teamleadImg'), (req, res) => {
        if (req.file) {
            console.log('Uploading file...');
            fs.rename('uploads/teamleads/' + req.file.filename, creds.IMAGES_FOLDER + '/teamleads/' + req.file.originalname, function (err) {
                if (err) console.log('ERROR: ' + err);
            });
            // shell.mv('uploads/sponsors/' + req.file.filename', 'file2', 'dir/');
            var filename = req.file.originalname;
            req.flash('success', { msg: `Teamlead Image Uploaded! Name of File: ${filename}` });
            return res.redirect('/crud');
        } else {
            console.log('No File Uploaded');
            var filename = 'FILE NOT UPLOADED';
            req.flash('success', { msg: `Teamlead image upload failed!` });
            return res.redirect('/crud');
        }
        /* ===== Add the function to save filename to database ===== */
    };
};