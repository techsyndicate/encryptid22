const User = require('../models/userSchema');

const DiscordStrategy = require('passport-discord').Strategy,
    refresh = require('passport-oauth2-refresh');

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

async function initialize(passport, req) {
    
    const authenticateUser = async (accessToken, refreshToken, profile, cb) => {
        const user = await User.findOne({ id: profile.id });
        if (user) {
            user.update({
                ...profile
            })
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
        callbackURL: req.protocol + '://' + req.get('host') + '/auth/discord/callback',
        scope: scopes
    }, authenticateUser))

    await passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    await passport.deserializeUser( (id, done) => {
        User.findById(id).then(user => {
            done(null, user)
        }).catch(err => {
            done(err, null)
        });
    });
}

module.exports = initialize
