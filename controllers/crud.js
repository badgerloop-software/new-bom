const Sponsors = require('../models/sponsor');
exports.getCrud = (req, res) => {
    if (!req.user || !req.user.isTeamLead) {
      req.flash('errors,', {msg: 'You are not authorized to view that!'});
      return res.redirect('back');  
    }
    Sponsors.find({}, (err, list) => {
        if (err) throw err;
        res.render('crud', {
            user:req.user,
            activeCRUD: true,
            sponsors: list
        });     

    });
}
exports.getDeleteSponsor = (req, res) => {
    console.log(req);
    findByIdAndRemove(req);
}
