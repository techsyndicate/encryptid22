const { checkAuthenticated } = require('../utilities/misc');
const User = require('../models/userSchema');
const express = require('express'),
    passport = require('passport'),
    router = express.Router();

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/play') // Successful auth
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/delete', checkAuthenticated, async (req, res) => {
    await User.deleteOne({ _id: req.user._id });
    res.redirect('/');
})

module.exports = router;