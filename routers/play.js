const router = require('express').Router();
const answerSchema = require('../models/answerSchema');
const levelSchema = require('../models/levelSchema');
const adjLevel = require('../utilities/adjacent.json');
const { checkAuthenticated } = require('../utilities/misc');

router.get('/', checkAuthenticated, async (req, res) => {
    if (Date.now("GMT+0530") <= new Date(process.env.START_DATE).getTime()) {
        return res.redirect('/');
    }
    if (req.user.play_current_level != undefined && !req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        if (req.user.play_current_level == 99) {
            return res.render('pages/end', { user: req.user });
        } else {
            var level = await levelSchema.findOne({ levelNumber: req.user.play_current_level });
            res.render('pages/level', { user: req.user, level: level });
        }
    } else {
        res.render('pages/play', { user: req.user });
    }
});

router.post('/submit', checkAuthenticated, async (req, res) => {
    req.user.answerlog.push({ level: req.user.play_current_level, try: req.body.answer });
    await req.user.save();
    await new answerSchema({
        levelNumber: req.user.play_current_level,
        try: req.body.answer,
        user: req.user.username,
    }).save();
    var level = await levelSchema.findOne({ levelNumber: req.user.play_current_level });
    console.log(req.user.play_current_level);
    if (req.body.answer.toLowerCase() === level.answer.toLowerCase()) {
        req.user.plat_levels_completed.push(req.user.play_current_level);
        req.user.plat_last_completed_time = Date.now("GMT+0530");
        if (req.user.play_current_level == 10) {
            req.user.play_current_level = 99;
            req.user.save()
            return res.send({ success: true, message: "Correct!" });
        }
        if (req.user.plat_levels_completed.length == 15) {
            req.user.plat_levels_unlocked = ["10"];
            req.user.save()
            res.send({ success: true, message: "Correct!" });
        } else {
            var nextLevel = adjLevel.filter(function (v) {
                return v.lev == req.user.play_current_level; // Filter out the appropriate one
            })[0];
            console.log(nextLevel);
            req.user.plat_levels_unlocked.push(nextLevel.adj.forEach(element => {
                console.log(element);
                if (!req.user.plat_levels_unlocked.includes(element) && !req.user.plat_levels_completed.includes(element)) {
                    req.user.plat_levels_unlocked.push(element);
                }
            }));

            new Promise((resolve, reject) => {

                req.user.plat_levels_unlocked.forEach((element, i) => {
                    if (req.user.plat_levels_completed.includes(element) || element == null || element == undefined) {
                        req.user.plat_levels_unlocked.splice(req.user.plat_levels_unlocked.indexOf(element), 1);
                    }
                    console.log(i, req.user.plat_levels_unlocked.length, req.user.plat_levels_unlocked)
                    if (i == req.user.plat_levels_unlocked.length) {
                        console.log(req.user.plat_levels_unlocked.length);
                        resolve();
                        console.log('here')
                    }
                });
            }).then(() => {
                console.log("hi", req.user.plat_levels_unlocked);
                req.user.save();
                res.send({ success: true, message: "Correct!" });
            });
        }
    } else {
        res.send({ success: false, message: "Incorrect." });
    }
});

router.get('/select/:id', checkAuthenticated, async (req, res) => {
    if (req.user.play_current_level != undefined && !req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        return res.send({ success: false, message: "You have already started a level." });
    }
    if (req.user.plat_levels_unlocked.includes(req.params.id)) {
        var level = await levelSchema.findOne({ levelNumber: req.params.id.toString() });
        if (!level) {
            return res.send({ success: false, message: "Level not made yet." });
        }
        req.user.play_current_level = req.params.id;
        req.user.save();
        return res.send({ success: true, message: "Selected Successfully!" });
    } else {
        res.send({ success: false, message: "Level not unlocked." });
    }
});

router.get('/gameboy', checkAuthenticated, (req, res) => {
    res.render('pages/gameboy')
})

module.exports = router;