import passport from 'passport';
import passportSlack from 'passport-slack';

const SlackStragety = passportSlack.Strategy;

const User = require('../models/user');

const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} = process.env;

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

 passport.use(new SlackStragety({
   clientID: CLIENT_ID,
   clientSecret: CLIENT_SECRET
 }, (req: any, _accessToken, _refreshToken, profile, done) => {
   User.findOne({name: profile.displayName}).then((currentUser) => {
     if(currentUser) {
       console.log('Current User is' + currentUser);
       done(null, currentUser);
     } else {
       let newUser = new User({
         name: profile.displayName,
         slackID: profile.id,
         admin: false
       });
       newUser.save().then((newUser: any) => {
         console.log('New User Created' + newUser);
         req.logIn(newUser, (err: Error) => {
           return done(err);
         })
         done(null, newUser);
       });
     }
   })
 }));

 export const isAuthenticated = (req, res, next) => {
   if(req.isAuthenticated()) {
     return next();
   }
   req.flash('error', 'Not Logged In!');
   res.redirect('/');
 };
