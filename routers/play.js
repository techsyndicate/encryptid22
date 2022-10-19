const router = require('express').Router();
const levelSchema = require('../models/levelSchema');
const adjLevel = require('../utilities/adjacent.json');
const { checkAuthenticated } = require('../utilities/misc');

router.get('/', checkAuthenticated, async (req, res) => {
    if (Date.now("GMT+0530") <= new Date(process.env.START_DATE).getTime()) {
        return res.send("The game is not yet available.");
    }
    
    if (req.user.play_current_level != undefined && !req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        var level = await levelSchema.findOne({ levelNumber: req.user.play_current_level });
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
            req.user.plat_levels_unlocked.forEach((element, i) => {
            if (req.user.plat_levels_completed.includes(element) || element == null) {
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
        return res.send({success: false, message: "You have already started a level."});
    }
    if (req.user.plat_levels_unlocked.includes(req.params.id)) {
        var level = await levelSchema.findOne({ levelNumber: req.params.id });
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

router.get('/gameboy', checkAuthenticated, (req,res)=>{
    res.render('pages/gameboy')
})

module.exports = router;