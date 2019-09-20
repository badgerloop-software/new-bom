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
  scope: ['users.profile:read', 'channels:read']
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  User.findOne({ name: profile.displayName }).then((currentUser) => {
    let isTeamLead = false;
    let options = {
      method: 'GET',
      url: 'https://slack.com/api/channels.list',
      qs: { token: `${accessToken}` }
    };
    request(options, (err, res, body) => {
      if (err) throw new Error(err);
      let obj = JSON.parse(body);
      for (let i = 0; i < Object.keys(obj.channels).length; i++) {
        let channel = obj.channels[i];
        if (channel.name == `${SECRET_CHANNEL}`) {
          console.log(`${profile.displayName} is a teamlead`);
          isTeamLead = true;
        }
      }
    });
    if (currentUser) {
      currentUser.isTeamLead = isTeamLead;
      console.log('Current User is' + currentUser);
      done(null, currentUser);
    } else {
      newUser = new User({
        name: profile.displayName,
        slackID: profile.id,
        isTeamLead: true

      });
      newUser.save().then((newUser) => {
        console.log('New User Created' + newUser);
        req.logIn(newUser, (err) => {
          return next(err);
        })
        done(null, newUser);
      });
    }
  })
}));

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Not Logged In!');
  res.redirect('/');
}
