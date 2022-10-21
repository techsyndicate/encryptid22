const router = require("express").Router();

router.get("/", async (req, res) => {
  //update every 5 minutes
  res.render("pages/leaderboardinfuse", { user: req.user });
});

module.exports = router;
