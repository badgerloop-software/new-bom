import Logs from '../models/Log.model';

export const getCrudLogs = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash('errors', { msg: 'You are not authorized to view that!' });
        return res.redirect('back');
    }
    Logs.find({}, (err, logsList) => {
        if (err) throw err;
        return res.render('crudLog', {
            logs: logsList,
            activeCRUDLOG: true
        });
    });
}
