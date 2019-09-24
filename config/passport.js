const SlackStragety = require('passport-slack').Strategy;
const passport = require('passport');
const request = require('request');

const User = require('../models/user');
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
// const SECRET_CHANNEL = process.env.SECRET_CHANNEL;
const SERVICES_TOKEN = process.env.SERVICES_TOKEN;
const SECRET_CHANNEL = process.env.SECRET_CHANNEL

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// The main flow of Slack Authentication
passport.use(new SlackStragety({
  clientID: clientID,
  clientSecret: clientSecret,
  skipUserProfile: false,
  scope: ['identity.basic']
}, (accessToken, refreshToken, profile, done) => {
  console.log("Made it to the callback");
  User.findOne({ name: profile.displayName }).then((currentUser) => {
    let isTeamLead = false; // Innocent until proven guilty
    let options = {
      method: 'GET',
      url: 'https://slack.com/api/groups.info',
      qs: {
        token: `${SERVICES_TOKEN}`,
        channel: `${SECRET_CHANNEL}`
      }
    };
    request(options, (err, res, body) => {
      if (err) throw new Error(err);
      isTeamLead = findTeamLead(body, profile);
      if (currentUser) {
        return updateCurrentUser(isTeamLead, currentUser, done)
      } else {
        return createNewUser(profile, isTeamLead, done);
      }
    });
  });
}));
// End Main Flow
  exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Not Logged In!');
    res.redirect('/');
  }

  function updateCurrentUser(isTeamLead, user, cb) {
    user.isTeamLead = isTeamLead;
    user.save((err) => {
      if (err) throw err;
      console.log('Current User is' + user);
      return cb(null, user);
    });
  }

  function createNewUser(profile, isTeamLead, cb) {
    console.log("You're new here");
    let newUser = new User({
      name: profile.displayName,
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
    console.log(obj);
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
