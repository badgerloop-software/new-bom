const sponsors = require('../models/sponsor');
const Sponsors = require('../models/sponsor');
const Logs = require('../models/log');

const multer = require('multer');
const uploadSponsor = multer({ dest: './uploads/sponsors' });
const fs = require('fs');

exports.sponsors_create = function (req, res) {
    let sponsors = new Sponsors(
        {
            tier: req.body.tier,
            company: req.body.company,
            website: req.body.website,
            logo: req.body.logo,
        }
    );

    sponsors.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Sponsor created successfully!` });
        return res.redirect('/crud');
    });

    let logs = new Logs(
        {
            time: Date.now(),
            name: req.user,
            action: "create",
            company: req.body.company,
        }
    );

    logs.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Sponsor created successfully!` });
        return res.redirect('/crud');
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
    sponsors.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, sponsors) {
        if (err) return next(err);
        req.flash('success', { msg: `Sponsor updated successfully!` });
        return res.redirect('/crud');
    });
};

exports.sponsors_delete = function (req, res) {
    sponsors.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        req.flash('success', { msg: `Sponsor deleted successfully!` });
        return res.redirect('/crud');
    });
};

exports.sponsors_upload = function (req, res) {
    uploadSponsor.single('sponsorImg'), (req, res) => {
        if(req.file) {
            console.log('Uploading file...');
            fs.rename('uploads/sponsors/' + req.file.filename, creds.IMAGES_FOLDER + '/sponsors/' + req.file.originalname, function (err) {
                if (err) console.log('ERROR: ' + err);
            });
            var filename = req.file.originalname;
            req.flash('success', { msg: `Sponsor Image Uploaded! Name of File: ${filename}` });
            return res.redirect('/crud');
        } else {
            console.log('No File Uploaded');
            var filename = 'FILE NOT UPLOADED';
            req.flash('success', { msg: `Sponsor image upload failed!` });
            return res.redirect('/crud');
        }
    };
};
