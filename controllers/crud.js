
exports.getCrud = (req, res) => {
    if (!req.user || !req.user.isTeamLead) {
      req.flash('errors,', {msg: 'You are not authorized to view that!'});
      return res.redirect('back');  
    }
    res.render('crud', {
        login: false,
        activeCRUD: true
    });
}
