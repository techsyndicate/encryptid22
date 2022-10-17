const User = require('../models/userSchema');

const DiscordStrategy = require('passport-discord').Strategy,
    refresh = require('passport-oauth2-refresh');

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

async function initialize(passport) {
    const authenticateUser = async (accessToken, refreshToken, profile, cb) => {
        const user = await User.findOne({ id: profile.id });
        if (user) {
            return cb(null, user);
        } else {
            const newUser = await User.create({
                ...profile
            });
            newUser.plat_levels_unlocked = ["1"];
            await newUser.save();
            return cb(null, newUser);
        }
    }

    await passport.use(new DiscordStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:5100/auth/discord/callback',
        scope: scopes
    }, authenticateUser))

    await passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(null, user, { message: err });
        });
    });
}

module.exports = initialize
