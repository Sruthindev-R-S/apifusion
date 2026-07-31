/**
 * @fileoverview Configures the Passport.js authentication strategies.
 */

const GitHubStrategy = require('passport-github2').Strategy;
const config = require('./env');
const userService = require('../services/userService');

module.exports = function(passport) {
  passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL
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
