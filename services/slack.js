const request = require('request');
const URL = process.env.SERVICES_TOKEN;
/**
 * @param {String} channel The Slack Channel ID
 * @param {String} msg The message text
 * @param {Array} attachments optional array of attachments
 * @callback (body) Returns the body of the response
 */
exports.sendMessage = function sendMessage(channel, msg, attachments, cb) {
        var options = {
          msg: msg,
          method: 'POST',
          url: 'https://slack.com/api/chat.postMessage',
          headers:
          {
            Authorization: 'Bearer ' + URL,
            'Content-Type': 'application/json'
          },
          body: { channel: channel, text: msg, attachments: attachments },
          json: true
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          if(cb) cb(body);
          else return;
        });
}
/**
 * Threads a message on an existing message
 */
exports.sendThread = function(channel, msg, attachments, ts, cb) {
    var options = {
        msg: msg,
        method: 'POST',
        url: 'https://slack.com/api/chat.postMessage',
        headers:
        {
          Authorization: 'Bearer ' + URL,
          'Content-Type': 'application/json'
        },
        body: { channel: channel, text: msg, attachments: attachments, thread_ts: ts },
        json: true
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(cb) cb(body);
        else return;
      });
}
/**
 * Reads the reactions of one message
 * @param {String} channel Channel of message to find
 * @param {String} ts Timestamp of message to find
 * @returns {Object} Object of reactions
 */
function getOneReactions(channel, ts) {
    request.get(`https://slack.com/api/reactions.get?token=${URL}&channel=${channel}&timestamp=${ts}&pretty=1`
    , function (error, response, body) {
        if (error) throw error;
        let json = JSON.parse(body);
        console.log(json);
        if (!json.ok) throw "Bad Request"
        if (json.message.reactions === undefined) console.log("No Reactions")
        else return json.message.reactions
    })
}
exports.getOneReactions = getOneReactions;

exports.checkOneThumbsUp = function checkOneThumbsUp(channel, ts) {
    console.log('--------------')
    console.log(getOneReactions(channel, ts));
}
