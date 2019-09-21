const Sponsors = require('../models/sponsor');
const Teamleads = require('../models/teamlead');

exports.getCrud = (req, res) => {
    if (!req.user || !req.user.isTeamLead) {
      req.flash('errors,', {msg: 'You are not authorized to view that!'});
      return res.redirect('back');  
    }
    Sponsors.find({}, (err, spnsrList) => {
        if (err) throw err; 
    Teamleads.find({}, (err, leadsList) => {
        if (err) throw err;
       return res.render('crud', {
            user: req.user,
            activeCRUD: true,
            teamleads: leadsList,
            sponors:  spnsrList
        });
    });
    });
}