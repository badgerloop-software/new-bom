import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';
let AuthRouter = express.Router();

AuthRouter.get('/slack/', passport.authenticate('slack'));
AuthRouter.get('/slack/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
AuthRouter.get('/logout', authController.getLogout);

export default AuthRouter;