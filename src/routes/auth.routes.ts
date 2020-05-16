import express from 'express';
import passport from 'passport';
import {authController} from '../controllers';
let AuthRouter = express.Router();

AuthRouter.get('/slack/', passport.authenticate('slack'));
AuthRouter.get('/slack/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
AuthRouter.get('/logout', authController.getLogout);

export default AuthRouter;