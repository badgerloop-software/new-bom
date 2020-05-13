import CriticalPaths from '../models/CriticalPath.model';

export const getCriticalPaths = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash('errors', { msg: 'You are not authorized to view that!' });
        return res.redirect('back');
    }
    CriticalPaths.find({}, (err, cpsList) => {
        if (err) throw err;
        return res.render('cpb', {
            cps: cpsList,
            activeCPB: true
        });
    });
}
