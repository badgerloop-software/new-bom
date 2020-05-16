/**
 * The commmands system is still highly in development, not sure how it got pushed to master but will be formatted as such
 */
import {Request, Response} from 'express';
import * as SLACK_SERVICE from '../services/slack.service'

export class CommandsController {
  public getBugReport(req: Request, res: Response) {
    const USER = req.body.user_name;
    const TEXT = req.body.text;
    const APP = TEXT.split(' ')[0];
    const MSG = TEXT.substr(TEXT.indexOf(" ") + 1);
  
    console.log(`${USER} Reporting ${APP} for ${MSG}`);
    let slackMsg = `<@${process.env.Admin1}> <@${process.env.Admin2}> \n`
    slackMsg += `${USER} has reported ${APP} Reason: ${MSG}`
    SLACK_SERVICE.sendMessage(process.env.BETA_CHANNEL, slackMsg, null, () => {
      res.status(200).send("Message Successfully Reported");
    });
  }
}