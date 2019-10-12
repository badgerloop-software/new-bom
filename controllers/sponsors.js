const sponsors = require('../models/sponsor');
const Sponsors = require('../models/sponsor');
const Logs = require('../models/log');

const multer = require('multer');
const uploadSponsor = multer({ dest: './uploads/sponsors' });
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
            field: "Comapny Name: " + req.body.company,
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

exports.sponsors_upload = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "upload sponsor image",
            field: "Image name: " + req.body.req.file.originalname,
        }
    );
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
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};
