const sponsors = require('../models/sponsor');
const Sponsors = require('../models/sponsor');

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
        res.send('Sponsor Created successfully');
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
        res.send('sponsor updated.');
    });
};

exports.sponsors_delete = function (req, res) {
    sponsors.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    });
};
