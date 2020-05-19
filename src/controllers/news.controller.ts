import {Request, Response} from 'express'
import News from '../models/NewsArticle.model';
import Logs from '../models/Log.model';


export class NewsController {
    public createNews(req: Request, res: Response): void {
        let news = new News(
            {
                title: req.body.title,
                imgName: req.body.imgName,
                subHeading: req.body.subHeading,
                body: req.body.body,
            }
        );
        news.save(function (err, next) {
            Logs.createLog(req.user.name, "created news piece", "Title: " + req.body.title);
            if (err) {
                return next(err);
            }
            req.flash('success', "News piece created sucessfully");
            return res.redirect('/crud');
        });
    }

    public getNewsDetails(req: Request, res: Response): void {
        News.findById(req.params.id, function (err, news) {
            if (err) throw err;
            res.send(news);
        });
    }

    public listNews(req: Request, res: Response): void {
        News.find(function (err, news) {
            if (err) {
                console.log(err);
            } else {
                res.json(news);
            }
        });
    }

    public updateNewsArticle(req: Request, res: Response): void {
        News.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, _news, next) {
            if (err) return next(err);
            Logs.createLog(req.user.name, "edited news piece", "Title:" + req.body.title);
            req.flash('success', "News piece updated sucessfully");
            return res.redirect('/crud');
        });
    }

    public deleteNewsArticle(req: Request, res: Response): void {
        News.findByIdAndRemove(req.params.id, function (err, next) {
            if (err) return next(err);
            Logs.createLog(req.user.name, "deleted news piece", "Title: " + req.body.title);
            req.flash('success', "News piece deleted sucessfully");
            return res.redirect('/crud');
        });
    }

};