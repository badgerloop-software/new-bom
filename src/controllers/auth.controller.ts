import {Request, Response} from 'express';
import request from 'request';
// import {Users} from '../models/User.model';

const {CLIENT_ID, CLIENT_SECRET} = process.env;
export class AuthController {
 public getAuth(req: Request, res: Response): void {
    res.render('mainPage', {
      login: true,
    });
  }
  
  public getAuthRedirect (req: Request, res: Response): void {
    let options = {
      uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      method: 'GET'
    };
    request(options, (err, response, body) => {
      let JSONresponse = JSON.parse(body);
      if(!JSONresponse.ok) {
        res.send('Error encountered: \n' + JSON.stringify(JSONresponse)).status(200).end();
      } else {
        res.send('Success!');
      }
    })
  }

  public getLogout (req: Request, res: Response): void {
    req.logout();
    req.flash('success', 'Logged Out!');
    res.redirect('/');
  }
}

