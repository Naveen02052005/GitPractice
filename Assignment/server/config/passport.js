
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: (process.env.SERVER_URL || 'http://localhost:5000') + '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await User.findOne({ oauthId: profile.id, provider: 'google' });
      if (existing) return done(null, existing);
      const newUser = await User.create({
        provider: 'google',
        oauthId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] && profile.emails[0].value
      });
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: (process.env.SERVER_URL || 'http://localhost:5000') + '/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await User.findOne({ oauthId: profile.id, provider: 'github' });
      if (existing) return done(null, existing);
      const newUser = await User.create({
        provider: 'github',
        oauthId: profile.id,
        displayName: profile.displayName || profile.username,
        email: profile.emails && profile.emails[0] && profile.emails[0].value
      });
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: (process.env.SERVER_URL || 'http://localhost:5000') + '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await User.findOne({ oauthId: profile.id, provider: 'facebook' });
      if (existing) return done(null, existing);
      const newUser = await User.create({
        provider: 'facebook',
        oauthId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] && profile.emails[0].value
      });
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }));
};
