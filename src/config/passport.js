const SlackStragety = require('passport-slack').Strategy;
const passport = require('passport');

const User = require('../models/user');
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;

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
   clientSecret: clientSecret
 }, (accessToken, refreshToke, profile, done) => {
   User.findOne({name: profile.displayName}).then((currentUser) => {
     if(currentUser) {
       console.log('Current User is' + currentUser);
       done(null, currentUser);
     } else {
       newUser = new User({
         name: profile.displayName,
         slackID: profile.id,
         admin: false
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
   if(req.isAuthenticated()) {
     return next();
   }
   req.flash('error', 'Not Logged In!');
   res.redirect('/');
 }
