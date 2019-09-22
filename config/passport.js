const SlackStragety = require('passport-slack').Strategy;
const passport = require('passport');
const request = require('request');

const User = require('../models/user');
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const SECRET_CHANNEL = process.env.SECRET_CHANNEL;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new SlackStragety({
  clientID: clientID,
  clientSecret: clientSecret,
  scope: ['users.profile:read', 'groups:read']
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  User.findOne({ name: profile.displayName }).then((currentUser) => {
    let isTeamLead = false; // Innocent until proven guilty
    let options = {
      method: 'GET',
      url: 'https://slack.com/api/groups.list',
      qs: { token: `${accessToken}` }
    };
    request(options, (err, res, body) => {
      if (err) throw new Error(err);
      let obj = JSON.parse(body);
      console.log(obj);
      for (let i = 0; i < Object.keys(obj.groups).length; i++) {
        let channel = obj.groups[i].name;
        if (channel == `${SECRET_CHANNEL}`) {
          console.log(`${profile.displayName} is a teamlead`);
          isTeamLead = true;
          break;
        }
      }
      if (currentUser) {
        currentUser.isTeamLead = isTeamLead;
        currentUser.save((err) => {
          if (err) throw err;
          console.log('Current User is' + currentUser);
          return done(null, currentUser);
        });
      } else {
        newUser = new User({
          name: profile.displayName,
          slackID: profile.id,
          isTeamLead: isTeamLead
        });
        newUser.save().then((newUser) => {
          console.log('New User Created' + newUser);
          return done(null, newUser);
        });
      }
    });
  });
}));

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } 
  req.flash('error', 'Not Logged In!');
  res.redirect('/');
}
