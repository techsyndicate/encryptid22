const router = require("express").Router();
const ejs = require("ejs");
var fs = require("fs");

var lastRender = Date('00');

router.get("/", async (req, res) => {
  //update every 5 minutes
  res.render("pages/leaderboardinfuse", { user: req.user });
});

module.exports = router;
