import request from 'request';
import {get, put, post} from 'request-promise';
const URL = process.env.SERVICES_TOKEN;
/**
 * @param {String} channel The Slack Channel ID
 * @param {String} msg The message text
 * @param {Array} attachments optional array of attachments
 * @callback (body) Returns the body of the response
 */
export const sendMessage = function sendMessage(channel, msg, attachments, cb) {
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
    if (cb) cb(body);
    else return;
  });
}
/**
 * Threads a message on an existing message
 */
export const sendThread = function (channel, msg, attachments, ts, cb) {
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
    if (cb) cb(body);
    else return;
  });
}
/**
 * Reads the reactions of one message
 * @param {String} channel Channel of message to find
 * @param {String} ts Timestamp of message to find
 * @returns {Object} Object of reactions
 */
async function getOneReactionsAsync(channel, ts) {
  return get(`https://slack.com/api/reactions.get?token=${URL}&channel=${channel}&timestamp=${ts}&pretty=1`).then((htmlString) => {
    let json = JSON.parse(htmlString);
    console.log(json);
	  if (!json.ok) throw "Bad Request";
    if (json.message.reactions === undefined) return null;
    else {
      // console.log(json.message.reactions);
      return json.message.reactions;
    }
  }).catch((err) => {
    throw "API Call Failed";
  });
}
export const getOneReactions = getOneReactionsAsync;

/**
 * Compares the users list of reaction with autorized users
 * @param {Object} reaction Reaction object from Slack API Call
 * @param {Array[String]} approvingUsers List of authorized users
 * @returns {String} Slack ID of first found approving user or
 * @returns {Boolean} false if no user found
 */
function compareUsers(reaction, approvingUsers) {
  let result = false;
  let users = reaction.users;
  for (let i = 0; i < approvingUsers.length; i++) {
    for (let j = 0; j < users.length; j++) {
	   // console.log(`Comparing ${users[j]} to ${approvingUsers[i]}`);
      if (users[j] == approvingUsers[i]){
	      result = users[j];
    }
  }
  }
  return result;

}
/**
 * Checks message if authorized user has given a thumbs up emoji
 * @param {String} channel Channel ID where message is located
 * @param {String} ts Timestamp of message to find
 * @param {Array[String]} approvingUsers List of authorized users
 * @returns {Promise<Resolve>} The slack ID of the authorizing user otherwise undefined
 * @returns {Promise<Reject>} The error encountered
 */
export const checkOneThumbsUp = function checkOneThumbsUp(channel, ts, approvingUsers) {
    return new Promise(function (resolve, reject) {
    getOneReactions(channel, ts).then((reactions) => {
      if (!reactions) return resolve(-1);
      let isUserValid = false;
      reactions.forEach((reaction) => {
        if (reaction.name === '+1') { // If its a thumbs up
          if (compareUsers(reaction, approvingUsers)) {	
           return isUserValid = compareUsers(reaction, approvingUsers);
          }
        }
      });
      if (!isUserValid) reject(-2);
      resolve(isUserValid);
    });
  });
}

export const editMessage = function editMessage(channel, ts, text, cb) {
  let msg = text;
  var options = {
    msg: msg,
    method: 'POST',
    url: 'https://slack.com/api/chat.update',
    headers:
    {
      Authorization: 'Bearer ' + URL,
      'Content-Type': 'application/json'
    },
    body: { channel: channel, text: msg, ts: ts },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (cb) cb(body);
    else return;
  });
}
