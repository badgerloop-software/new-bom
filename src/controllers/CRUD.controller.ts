import {Request, Response} from 'express'
import Sponsors from '../models/Sponsor.model';
import Teamleads from '../models/TeamLead.model';
import News from '../models/NewsArticle.model';

export class CRUDController {
    public getCrud(req: Request, res: Response): void {
        if (!req.user || !req.user.isTeamLead) {
            req.flash('errors', "You are not authorized to view that!");
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
        }); // callback hell
    }
}
