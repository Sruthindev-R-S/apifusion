/**
 * @fileoverview Defines authentication routes for GitHub OAuth.
 */

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const router = express.Router();

// Redirects user to GitHub for authentication
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'read:user', 'repo'] }));

// GitHub redirects back here
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${config.CLIENT_URL}?error=login_failed` }),
  (req, res) => {
    const username = req.user?.username || req.user?.login || 'octocat';
    const accessToken = req.user?.accessToken || '';
    const token = jwt.sign({ id: req.user.id, username, accessToken }, config.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`${config.CLIENT_URL}?login=success&user=${encodeURIComponent(username)}`);
  }
);

router.get('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Successfully logged out' });
});

module.exports = router;
