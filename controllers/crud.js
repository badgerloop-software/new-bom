const Sponsors = require('../models/sponsor');
const Teamleads = require('../models/teamlead');
const News = require('../models/news');

exports.getCrud = (req, res) => {
    // temporarily changing to admins can access until teamleads issue sorted
    if (!req.user || !req.user.isAdmin) {
        req.flash('errors', { msg: 'You are not authorized to view that!' });
        return res.redirect('back');
    }
    Sponsors.find({}, (err, spnsrList) => {
        if (err) throw err;
        Teamleads.find({}, (err, leadsList) => {
            if (err) throw err;
            News.find({}, (err, newsList) => {
                if (err) throw err;
                return res.render('crud', {
                    user: req.user,
                    activeCRUD: true,
                    teamleads: leadsList,
                    sponsors: spnsrList,
                    news: newsList
                });
            });
        });
    });
}
