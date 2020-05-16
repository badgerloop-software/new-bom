import { Request, Response } from 'express'
import Logs from '../models/Log.model';
export class CrudLogsController {
    public getCrudLogs(req: Request, res: Response): void {
        if (!req.user || !req.user.isAdmin) {
            req.flash('errors', "You are not authroized to view that!");
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
}
