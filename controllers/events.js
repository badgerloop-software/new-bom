var request = require("request");
const cps = require('../models/cp');
var schedule = require('node-schedule');
const URL = process.env.APPS_TOKEN;

var j = schedule.scheduleJob('0 10 * * *', function (fireDate) { //uses node-schedule to run once every day at 10am (cron format)
  cps.find({}, (err, cpsList) => {
    if (err) throw err;
    console.log(cpsList);
    let msg =
      `==== CURRENT CRITICAL PATH ====
    *Title*: ${cpsList[cpsList.length-1].title}
    *Description*: ${cpsList[cpsList.length-1].description}
    *Assignee*: ${cpsList[cpsList.length -1].assignee}
    *Due* ${cpsList[cpsList.length - 1].due}`;
    var options = {
      msg: msg,
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers:
      {
        Authorization: 'Bearer ' + URL,
        'Content-Type': 'application/json'
      },
      body: { channel: 'CNS3SCTCZ', text: msg },
      json: true
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
  });
});