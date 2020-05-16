import request from 'request';
import { get, put, post } from 'request-promise';
export { channelMap, updateMap } from './channels';
const TOKEN = process.env.SERVICES_TOKEN;

export class SlackService {

  public static Channels: Map<string,string>;

  /**
 * @param {String} channel The Slack Channel ID
 * @param {String} msg The message text
 * @param {Array} attachments optional array of attachments
 * @callback (body) Returns the body of the response
 */
  public static sendMessage(channel: string, msg: string, attachments: any[], cb: Function) {
    var options = {
      msg: msg,
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers:
      {
        Authorization: 'Bearer ' + TOKEN,
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
  public static sendThread(channel: string, msg: string, attachments: any[], ts: string, cb: Function) {
    var options = {
      msg: msg,
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers:
      {
        Authorization: 'Bearer ' + TOKEN,
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
  public static async getOneReactions(channel: string, ts: string) {
    return get(`https://slack.com/api/reactions.get?token=${TOKEN}&channel=${channel}&timestamp=${ts}&pretty=1`).then((htmlString) => {
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

  /**
 * Compares the users list of reaction with autorized users
 * @param {Object} reaction Reaction object from Slack API Call
 * @param {Array[String]} approvingUsers List of authorized users
 * @returns {String} Slack ID of first found approving user or
 * @returns {Boolean} false if no user found
 */
  private static compareUsers(reaction: any, approvingUsers: string[]) {
    let result = false;
    let users = reaction.users;
    for (let i = 0; i < approvingUsers.length; i++) {
      for (let j = 0; j < users.length; j++) {
        // console.log(`Comparing ${users[j]} to ${approvingUsers[i]}`);
        if (users[j] == approvingUsers[i]) {
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

 public static checkOneThumbsUp(channel: string, ts: string, approvingUsers: string[]) {
  return new Promise(function (resolve, reject) {
    SlackService.getOneReactions(channel, ts).then((reactions) => {
      if (!reactions) return resolve(-1);
      let isUserValid = false;
      reactions.forEach((reaction) => {
        if (reaction.name === '+1') { // If its a thumbs up
          if (SlackService.compareUsers(reaction, approvingUsers)) {
            return isUserValid = SlackService.compareUsers(reaction, approvingUsers);
          }
        }
      });
      if (!isUserValid) reject(-2);
      resolve(isUserValid);
    });
  });
 }

 public static editMessage(channel: string, ts: string, msg: string, cb: Function) {
  var options = {
    msg: msg,
    method: 'POST',
    url: 'https://slack.com/api/chat.update',
    headers:
    {
      Authorization: 'Bearer ' + TOKEN,
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

 private static getSlackChannels(token: string = TOKEN): Promise<any[]> {
  return get(`https://slack.com/api/conversations.list?token=${token}&pretty=1`).then(body => {
    let conversations = JSON.parse(body).channels;
    let channels = conversations.filter((convo) => {
      return convo.is_channel == true;
    });
    return channels;
  }).catch((err) => {
    console.log("[Error] Failed to get slack channels, BOM will run without Slack Integration");
    console.log("[Error] " + err);
  });
 }

 private static buildChannelsMap(channels: any[]): Map<string, string> {
  if (channels === undefined || channels === null) return; 
  let namesAndIDs = [];
  channels.forEach((channel) => {
    namesAndIDs.push([channel.name, channel.id]);
  });
  return new Map(namesAndIDs);
 }

 public static async createChannelsMap(token: string = TOKEN): Promise<boolean> {
   let channelsList =  await SlackService.getSlackChannels();
   SlackService.Channels = SlackService.buildChannelsMap(channelsList);
   return true;
 }


}

