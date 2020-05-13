const cp = require('../models/cp');
const Cp = require('../models/cp');

export const cp_create = function (req, res) {
    let cp = new Cp(
        {
            title: req.body.title,
            description: req.body.description,
            assignee: req.body.assignee,
            due: req.body.due,
            channels: req.body.channelsString
        }
    );

    cp.save(function (err, next) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Critical Path created successfully!` });
        return res.redirect('/cpb');
    });
};

export const cp_details = function (req, res) {
    cp.findById(req.params.id, function (err, cp) {
        if (err) throw err;
        res.send(cp);
    });
};

export const cp_list = function (req, res) {
    cp.find(function (err, cp) {
        if (err) {
            console.log(err);
        } else {
            res.json(cp);
        }
    });
};

export const cp_update = function (req, res) {
    cp.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, cp, next) {
        if (err) return next(err);
        req.flash('success', { msg: `Critical Path updated successfully!` });
        return res.redirect('/cpb');
    });
};

export const cp_delete = function (req, res, next) {
    cp.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        req.flash('success', { msg: `Critical Path deleted successfully!` });
        return res.redirect('/cpb');
    });
};