const router = require("express").Router();
const User = require("../models/userSchema");
const ejs = require("ejs");
var fs = require("fs");

var lastRender = Date('00');

router.get("/", async (req, res) => {
  //update every 5 minutes
  await updateLeaderboard();
  res.render("pages/leaderboardinfuse", { user: req.user });
});
updateLeaderboard()
async function updateLeaderboard() {
  if (Date.now() - lastRender < 300000) {
    console.log("Leaderboard not updated, too soon");
    return;
  } else {
    var users = await User.find({ admin: false })
    users.sort(function (a, b) {
      return b.plat_levels_completed.length - a.plat_levels_completed.length;
    });
    var file = await ejs.renderFile(
      __dirname + "/../views/pages/leaderboard.ejs",
      { users: users }
    );
    //store file in public folder
    fs.writeFileSync(__dirname + "/../public/leaderboard.html", file);
    lastRender = Date.now();
    return;
  }
}

module.exports = router;
