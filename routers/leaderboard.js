const router = require('express').Router();
const User = require('../models/userSchema');

router.get('/', async (req, res) => {
    var users = await User.find({}).sort({ plat_levels_completed: -1 }).limit(10);
    console.log(users)
    res.render('pages/leaderboard', { users: users, user: req.user});
});

module.exports = router;