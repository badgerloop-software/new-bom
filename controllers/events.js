var request = require("request");
const cps = require('../models/cp');
var schedule = require('node-schedule');
const URL = process.env.APPS_TOKEN;
var one_day=1000*60*60*24;
today = new Date();
var reveal=new Date(today.getFullYear()+1, 3, 4);

var j = schedule.scheduleJob('0 10 * * *', function (fireDate) { //uses node-schedule to run once every day at 10am (cron format)
  cps.find({}, (err, cpsList) => {
    if (err) throw err;
    if (cpsList.length==0) console.log("No critical path.");
    else {
      index = cpsList.length-1;
      let msg =
        `:alert:  CURRENT CRITICAL PATH  :alert:
      *Title*: ${cpsList[index].title}
      *Description*: ${cpsList[index].description}
      *Assignee*: ${cpsList[index].assignee}
      *Due*: ${cpsList[index].due}
      *Days until Reveal*: ${Math.ceil((reveal.getTime() - today.getTime()) / (one_day))}`;
      var channels = cpsList[index].channels.split(',');
      channels.forEach(function (x) {
        sendMsg(x, msg);
      });
    }
  });
});

function sendMsg(channel, msg) {
  var channelID;
  switch (channel) {
    case "beta":
      channelID = 'CNS3SCTCZ';
      break;
    case "beta2":
      channelID = 'CQDRE7LDD';
      break;
    case "general":
      channelID = 'CNS3SCPND';
  }
  var options = {
    msg: msg,
    method: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    headers:
    {
      Authorization: 'Bearer ' + URL,
      'Content-Type': 'application/json'
    },
    body: { channel: channelID, text: msg },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}