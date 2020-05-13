const cps = require('../models/cp');

exports.getCriticalPaths = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash('errors', { msg: 'You are not authorized to view that!' });
        return res.redirect('back');
    }
    cps.find({}, (err, cpsList) => {
        if (err) throw err;
        return res.render('cpb', {
            cps: cpsList,
            activeCPB: true
        });
    });
}
