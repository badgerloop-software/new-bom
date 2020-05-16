import passport from 'passport';
import passportSlack from 'passport-slack';
const SlackStrategy = passportSlack.Strategy;

import request from 'request';

import {Users} from '../models/User.model';
const { CLIENT_ID, CLIENT_SECRET, SERVICES_TOKEN, SECRET_CHANNEL } = process.env;

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id, (err, user) => {
    done(err, user);
  });
});


// The main flow of Slack Authentication
passport.use(new SlackStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  skipUserProfile: false,
  scope: ['identity.basic', 'identity.avatar']
}, (_accessToken, _refreshToken, profile, done) => {
  console.log("Made it to the callback");
  Users.findOne({ "slackID": profile.id }).then((currentUser) => {
    let isTeamLead = false; // Innocent until proven guilty
    let options = {
      method: 'GET',
      url: 'https://slack.com/api/groups.info',
      qs: {
        token: `${SERVICES_TOKEN}`,
        channel: `${SECRET_CHANNEL}`
      }
    };
    request(options, (err, _res, body) => {
      if (err) throw new Error(err);
      isTeamLead = findTeamLead(body, profile);
      if (currentUser) {
        return updateCurrentUser(isTeamLead, currentUser, profile, done)
      } else {
        return createNewUser(profile, isTeamLead, done);
      }
    });
  });
}));
// End Main Flow
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Not Logged In!');
    res.redirect('/');
  };

  function updateCurrentUser(isTeamLead, user, profile, cb) {
    user.name = profile.displayName
    user.isTeamLead = isTeamLead;
    user.picture = profile.user.image_192;
    user.save((err) => {
      if (err) throw err;
      console.log('Current User is' + user);
      return cb(null, user);
    });
  }

  function createNewUser(profile, isTeamLead, cb) {
    console.log("You're new here");
    let newUser = new Users({
      name: profile.displayName,
      picture: profile.user.image_192,
      slackID: profile.id,
      isTeamLead: isTeamLead
    });
    newUser.save().then((newUser) => {
      console.log('New User Created' + newUser);
      return cb(null, newUser);
    });
  }

  function findTeamLead(body, profile) {
    let output = false; // Innocent until proven guilty
    let obj = JSON.parse(body);
    if (!obj.group) return false;
    let members = obj.group.members;
    let userID = profile.id;
    members.forEach((member) => {
//	console.log(`${member} == ${profile.id} ??`);
      if (member == userID) {
	  output = true;
      }
    });
    return output;
  }
