const router = require('express').Router();
const levelSchema = require('../models/levelSchema');
const adjLevel = require('../utilities/adjacent.json');

router.get('/', async (req, res) => {
    if (!req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        var level = await levelSchema.findOne({ level_id: req.user.play_current_level });
        res.render('pages/level', { user: req.user, level: level });
    } else {
        res.render('pages/play', { user: req.user });
    }
});

router.post('/submit', async (req, res) => {
    var level = await levelSchema.findOne({ level_id: req.user.play_current_level });
    if (req.body.answer.toLowerCase() === level.answer.toLowerCase()) {
        req.user.plat_levels_completed.push(req.user.play_current_level);
        req.user.plat_levels_unlocked.push(adjLevel[req.user.play_current_level].adj.forEach(element => {
            if (!req.user.plat_levels_unlocked.includes(element)) {
                req.user.plat_levels_unlocked.push(element);
            }
        }));
        req.user.save();
        res.send({ success: true, message: "Correct!" });
    } else {
        res.send({ success: false, message: "Incorrect." });
    }
});

router.get('/select/:id', async (req, res) => {
    if (!req.user.plat_levels_completed.includes(req.user.play_current_level)) {
        return res.redirect('/play');
    }
    if (req.user.plat_levels_unlocked.includes(req.params.id)) {
        req.user.play_current_level = req.params.id;
        req.user.save();
        return res.send({ success: true, message: "Level selected." });
    } else {
        res.send({ success: false, message: "Level not unlocked." });
    }
});

module.exports = router;