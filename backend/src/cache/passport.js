/**
 * @fileoverview Configures the Passport.js authentication strategies.
 */

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../index');
const userService = require('../services/userService');

module.exports = function(passport) {
  passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // This is the verification function.
      // It receives the GitHub profile and calls our user service.
      const user = await userService.findOrCreate(profile);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // These are not needed for stateless JWT authentication but are required by Passport.
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};