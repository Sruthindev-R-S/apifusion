/**
 * @fileoverview Configures the Passport.js authentication strategies.
 */

const GitHubStrategy = require('passport-github2').Strategy;
const config = require('./env');
const userService = require('../services/userService');

module.exports = function(passport) {
  const clientID = config.GITHUB_CLIENT_ID || 'placeholder_client_id';
  const clientSecret = config.GITHUB_CLIENT_SECRET || 'placeholder_client_secret';
  const callbackURL = config.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback';

  passport.use(new GitHubStrategy({
    clientID,
    clientSecret,
    callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.findOrCreate(profile);
      user.username = profile.username || profile._json?.login || profile.displayName;
      user.accessToken = accessToken;
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};
