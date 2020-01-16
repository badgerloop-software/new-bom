var request = require("request");
const cps = require('../models/cp');
var schedule = require('node-schedule');
const URL = process.env.APPS_TOKEN;
var one_day=1000*60*60*24;
today = new Date();
var reveal=new Date(today.getFullYear()+1, 3, 16);

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
//Lol Luke this function is so jank
function sendMsg(channel, msg) {
  var channelID;
  switch (channel) {
    case "analysis":
      channelID = 'C72SNKW9W';
      break;
    case "braking":
      channelID = 'C0B3GCRMK';
      break;
    case "feasibility":
      channelID = 'C0LGGGL3B';
      break;
    case "fsc":
      channelID = 'C2BA9U72R';
      break;
    case "lowVoltage":
      channelID = 'C75312S86';
      break;
    case "mechanicalReliability":
      channelID = 'C2B6MS5K9';
      break;
    case "stability":
      channelID = 'C0ACLJ2N9';
      break;
    case "vr":
      channelID = 'C0BN6CJ95';
      break;
    case "propulsion":
      channelID = 'C3XTCG589';
      break;
    case "structural":
      channelID = 'C0ACK7G8K';
      break;
      case "communications":
    channelID = 'C0G9JGR37';
    break;
    case "electrical":
      channelID = 'C0ACMLAKX';
      break;
    case "highVoltage":
      channelID = 'C75315NB0';
      break;
    case "industry":
      channelID = 'C0ET77FD3';
      break;
    case "opsTeams":
      channelID = 'C416E1YDS';
      break;
    case "software":
      channelID = 'C0ACBQ59P';
      break;
    case "tech":
      channelID = 'C4143C6LA';
      break;
    case "website":
      channelID = 'C0CF235QE';
      break;
    case "controls":
      channelID = 'C0L1P5JTA';
      break;
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
