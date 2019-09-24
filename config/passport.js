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
  skipUserProfile: false,
  scope: ['identity.basic']
}, (accessToken, refreshToken, profile, done) => {
  console.log("Made it to the callback");
  User.findOne({ name: profile.displayName }).then((currentUser) => {
   /* let isTeamLead = false; // Innocent until proven guilty
    let options = {
      method: 'GET',
      url: 'https://slack.com/api/groups.list',
      qs: { token: `${accessToken}` }
    };*/
  /*  request(options, (err, res, body) => {
      if (err) throw new Error(err);
      let obj = JSON.parse(body);
      console.log(obj);
      isTeamLead = findTeamLead(obj, profile); */
      if (currentUser) {
      //  currentUser.isTeamLead = isTeamLead; 
      //  currentUser.save((err) => {
       //   if (err) throw err;
          console.log('Current User is' + currentUser);
          return done(null, currentUser);
      } else {
        console.log("You're new here");
        newUser = new User({
          name: profile.displayName,
          slackID: profile.id,
        //  isTeamLead: isTeamLead
        });
        newUser.save().then((newUser) => {
          console.log('New User Created' + newUser);
          return done(null, newUser);
        });
      }
  });
}));

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Not Logged In!');
  res.redirect('/');
}

function findTeamLead(obj, profile) {
    let numGroups = Object.keys(obj.groups).length;
    let output = false
    for (let i=0; i<numGroups; i++) {
        let channel = obj.groups[i].name;
        if (channel == `${SECRET_CHANNEL}`) {
            console.log(`${profile.displayName} is a teamlead`);
            output = true;
            break;
        }
    }
    return output;
}
