import {Request, Response, NextFunction} from 'express';
import CriticalPath from '../models/CriticalPath.model';
export class CriticalPathsController {
    public createCriticalPath(req: Request, res: Response): void {
        let newCriticalPath = new CriticalPath(
            {
                title: req.body.title,
                description: req.body.description,
                assignee: req.body.assignee,
                due: req.body.due,
                channels: req.body.channelsString
            }
        );
    
        newCriticalPath.save(function (err, next) {
            if (err) {
                return next(err);
            }
            req.flash('success', "Critical Path Created Sucessfully");
            return res.redirect('/cpb');
        });
    }

    public getCriticalPath(req: Request, res: Response): void {
        CriticalPath.findById(req.params.id, function (err, cp) {
            if (err) throw err;
            res.send(cp);
        });
    }

    public listCriticalPaths(req: Request, res: Response): void {
        CriticalPath.find(function (err, cp) {
            if (err) {
                console.log(err);
            } else {
                res.json(cp);
            }
        });
    }

    public updateCriticalPath(req: Request, res: Response) { //TODO: Ask luke what the hell the {$set: req.body} is
        CriticalPath.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, cp, next) {
            if (err) return next(err);
            req.flash('success', `Critical Path updated successfully!`);
            return res.redirect('/cpb');
        });
    }

    public deleteCriticalPath(req: Request, res: Response, next: NextFunction): void {
        CriticalPath.findByIdAndRemove(req.params.id, function (err) {
            if (err) return next(err);
            req.flash('success', `Critical Path deleted successfully!`);
            return res.redirect('/cpb');
        });
    }
}