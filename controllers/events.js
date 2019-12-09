var request = require("request");
const cps = require('../models/cp');
var schedule = require('node-schedule');

var j = schedule.scheduleJob('*/1 * * * *', function (fireDate) { //uses node-schedule to run once every minute (cron format)
  cps.find({}, (err, cpsList) => {
    if (err) throw err;
    console.log(cpsList);
    let msg =
      `==== CURRENT CRITICAL PATH ====
    *Title*: ${cpsList[0].title}
    *Description*: ${cpsList[0].description}
    *Assignee*: ${cpsList[0].assignee}
    *Due* ${cpsList[0].due}`;
    var options = {
      msg: msg,
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers:
      {
        Authorization: 'Bearer xoxb-782416144855-856860949009-aIfxev3o0FIAWYSyEzRp0DeM',
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