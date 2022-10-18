const router = require('express').Router();
const User = require('../models/userSchema');
const ejs = require('ejs');
var fs = require('fs');

router.get('/', async (req, res) => {
    res.render('pages/leaderboardinfuse', { user: req.user });
});

async function updateLeaderboard() {
    var users = await User.find({}).sort({ plat_levels_completed: -1 }).limit(10);
    var file = await ejs.renderFile(__dirname + '/../views/pages/leaderboard.ejs', { users: users })
    //store file in public folder
    fs.writeFileSync(__dirname + "/../public/leaderboard.html", file);
}

//update every 5 minutes
updateLeaderboard();
setInterval(updateLeaderboard, 300000);

module.exports = router;