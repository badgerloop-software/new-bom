import Teamleads from '../models/TeamLead.model';
import Logs from '../models/Log.model';
import { Request, Response } from 'express';
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

export class TeamleadController {
    public teamleads_create(req: Request, res: Response): void {
        let newTeamlead = new Teamleads(
            {
                Team: req.body.Team,
                Position: req.body.Position,
                Name: req.body.Name,
                Major: req.body.Major,
                Year: req.body.Year,
                Picture: req.body.Picture,
            }
        );

        let currUser = req.user;


        let newLog = new Logs(
            {
                time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
                name: req.user.name,
                action: "create teamlead",
                field: "Teamlead Name: " + req.body.name,
            }
        );

        newTeamlead.save(function (err, next) {
            if (err) {
                return next(err);
            }
            req.flash('success', "Teamlead Created Sucessfully");
            return res.redirect('/crud');
        });
        newLog.save(function (err, next) {
            if (err) {
                return next(err);
            }
        });
    }

    public teamleads_details(req: Request, res: Response): void {
        Teamleads.findById(req.params.id, function (err, teamleads, next) {
            if (err) return next(err);
            res.send(teamleads);
        });
    };

    public teamleads_list(_req: Request, res: Response): void {
        Teamleads.find(function (err, teamleads) {
            if (err) {
                console.log(err);
            } else {
                res.json(teamleads);
            }
        });
    };

    public teamleads_update(req: Request, res: Response) {
        let newLog = new Logs(
            {
                time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
                name: req.user.name,
                action: "edit teamlead",
                field: "Teamlead Name: " + req.body.Name,
            }
        );
        Teamleads.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, _teamleads, next) {
            if (err) return next(err);
            req.flash('success', "Teamlead Updated Sucessfully!");
            return res.redirect('/crud');
        });
        newLog.save(function (err, next) {
            if (err) {
                return next(err);
            }
        });
    };

    public teamleads_delete(req: Request, res: Response) {
        Teamleads.findByIdAndRemove(req.params.id, function (err, next) {
            if (err) return next(err);
            let logs = new Logs(
                {
                    time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
                    name: req.user.name,
                    action: "delete teamlead",
                    field: "Teamlead Name: " + req.body.Name,
                }
            );
            logs.save(function (err) {
                if (err) {
                    return next(err);
                }
            });
            req.flash('success', "Teamlead Deleted Sucessfully!");
            return res.redirect('/crud');
        });
    };


};