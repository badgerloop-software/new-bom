import {Request, Response} from 'express'
import request from 'request';
import CriticalPaths from '../models/CriticalPath.model';
import * as Schedule from 'node-schedule';
import {SlackService} from '../services/slack';

export class EventsController {
   static URL: string = process.env.APPS_TOKEN;
   static ONE_DAY: number = 1000*60*60*24;
   static today: Date = new Date();
   static reveal: Date = new Date(EventsController.today.getFullYear()+1, 3, 16); //TODO find some way to implement this better
   static scheduler = Schedule.scheduleJob('0 10 * * *', function (fireDate) { //uses node-schedule to run once every day at 10am (cron format)
    CriticalPaths.find({}, (err, cpsList) => {
      if (err) throw err;
      if (cpsList.length==0) console.log("No critical path.");
      else {
        let index: number = cpsList.length-1;
        let msg =
          `:alert:  CURRENT CRITICAL PATH  :alert:
        *Title*: ${cpsList[index].title}
        *Description*: ${cpsList[index].description}
        *Assignee*: ${cpsList[index].assignee}
        *Due*: ${cpsList[index].due}
        *Days until Reveal*: ${Math.ceil((EventsController.reveal.getTime() - EventsController.today.getTime()) / (EventsController.ONE_DAY))}`;
        var channels = cpsList[index].channels.split(',');
        channels.forEach(function (x) {
          sendMsg(x, msg);
        });
      }
    });
  });
}

function sendMsg(channel, msg) {
  // After
  let channelID = SlackService.Channels.get(channel);
  SlackService.sendMessage(channelID, msg, null, (err, _response, body) => {
    if (err) throw new Error(err);
    console.log(body);
  });
}

export const getSlackTest = (req, res) => {
  require('../models/orderMessage').find({}, (err, messages) => {
    if (err) throw err;
    messages.forEach((message) => {
      message.checkApproved();
    })
  })
  res.send(req.body.challenge).end(200);
}