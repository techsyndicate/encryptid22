const router = require('express').Router();
const levelSchema = require('../models/levelSchema');
const adjLevel = require('../utilities/adjacent.json');
const { checkAuthenticated } = require('../utilities/misc');

router.get('/', checkAuthenticated, async (req, res) => {
    if (Date.now() <= new Date("Mon Oct 17 2022 00:00:00 GMT+0530")) {
        return res.send("The game is not yet available.");
    }
    
    if (req.user.play_current_level != undefined && !req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        var level = await levelSchema.findOne({ level_id: req.user.play_current_level });
        res.render('pages/level', { user: req.user, level: level });
    } else {
        res.render('pages/play', { user: req.user });
    }
});

router.post('/submit',checkAuthenticated, async (req, res) => {
    var level = await levelSchema.findOne({ levelNumber: req.user.play_current_level });
    if (req.body.answer.toLowerCase() === level.answer.toLowerCase()) {
        req.user.plat_levels_completed.push(req.user.play_current_level);
        req.user.plat_levels_unlocked.push(adjLevel[parseInt(req.user.play_current_level) - 1].adj.forEach(element => {
            if (!req.user.plat_levels_unlocked.includes(element) && !req.user.plat_levels_completed.includes(element)) {
                req.user.plat_levels_unlocked.push(element);
                console.log(element);
            }
            else {
                console.log("Already unlocked");
            }
        }));
        new Promise((resolve, reject) => {
        req.user.plat_levels_completed.forEach((element, i) => {
            if (req.user.plat_levels_unlocked.includes(element)) {
                req.user.plat_levels_unlocked.splice(req.user.plat_levels_unlocked.indexOf(element), 1);
            }
            if (i == req.user.plat_levels_completed.length - 1) {
                resolve();
            }
        });
        }).then(() => {
            req.user.save();
            res.send({ success: true, message: "Correct!" });
        });
    } else {
        res.send({ success: false, message: "Incorrect." });
    }
});

router.get('/select/:id', checkAuthenticated, async (req, res) => {
    if (req.user.play_current_level != undefined && !req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        return res.redirect('/play');
    }
    if (req.user.plat_levels_unlocked.includes(req.params.id)) {
        req.user.play_current_level = req.params.id;
        req.user.save();
        return res.redirect('/play');
    } else {
        res.send({ success: false, message: "Level not unlocked." });
    }
});

module.exports = router;