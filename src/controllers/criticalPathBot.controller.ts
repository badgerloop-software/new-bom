import {Request, Response} from 'express'
import CriticalPaths from '../models/CriticalPath.model';
export class CriticalPathBotController {
    public getCriticalPaths(req: Request, res: Response): void {
        if (!req.user || !req.user.isAdmin) {
            req.flash('errors', "You are not authorized to view that!");
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
}
