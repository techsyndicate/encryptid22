const router = require('express').Router();
const answerSchema = require('../models/answerSchema');
const levelSchema = require('../models/levelSchema');
const userSchema = require('../models/userSchema');
const { checkAdmin } = require('../utilities/misc');

router.get('/', checkAdmin, async (req, res) => {
    res.render('admin/index', { user: req.user });
});

router.get('/add', checkAdmin, async (req, res) => {
    res.render('admin/add', { user: req.user });
})

router.post('/add', checkAdmin, async (req, res) => {
    var level = await levelSchema.findOne({ levelNumber: req.body.levelNumber});
    if (level) {
        res.send({ success: false, message: "Level already exists." });
    } else {
        level = new levelSchema({
            levelNumber: req.body.levelNumber,
            maintext: req.body.maintext,
            image: req.body.image,
            sourceCodeHint: req.body.sourceCodeHint,
        });
        await level.save();
        res.send({ success: true, message: "Level added." });
    }
});

router.get('/edit', checkAdmin, async (req, res) => {
    var levels = await levelSchema.find();
    res.render('admin/edit', { user: req.user, levels: levels });
})

router.post('/edit/:id', checkAdmin, async (req, res) => {
    console.log(req.body);
    var level = await levelSchema.findById(req.params.id);
    if (level) {
        level.levelNumber = req.body.levelNumber.toString();
        level.maintext = req.body.maintext;
        level.image = req.body.image;
        level.sourceCodeHint = req.body.sourceCodeHint;
        level.answer = req.body.answer;
        level.hintHidden = req.body.hintHidden;
        level.localStorageHint = req.body.localStorageHint;
        level.cookieHint = req.body.cookieHint;
        await level.save().then((level)=>{
            console.log(level);
        })
        res.send({ success: true, message: "Level edited." });
    } else {
        res.send({ success: false, message: "Level does not exist." });
    }
});

router.get('/users', checkAdmin, async (req, res) => {
    var users = await userSchema.find();
    res.render('admin/users', { users });
});

router.get('/banit/:id', checkAdmin, async (req, res) => {
    var user = await userSchema.findById(req.params.id);
    if (user) {
        user.plat_banned = !user.plat_banned;
        await user.save();
        res.send({ success: true, message: "User ban updated." });
    } else {
        res.send({ success: false, message: "User does not exist." });
    }
})

router.get('/admin/:id', checkAdmin, async (req, res) => {
    var user = await userSchema.findById(req.params.id);
    if (user) {
        user.admin = !user.admin;
        await user.save();
        res.send({ success: true, message: "User admin updated." });
    } else {
        res.send({ success: false, message: "User does not exist." });
    }
})

router.get('/answerlog', checkAdmin, async (req, res) => {
    var answerlog = await answerSchema.find();
    answerlog = answerlog.reverse();
    res.render('admin/answerlogoverall', { answerlog });
})

router.get('/removemultiplesamecompleted', checkAdmin, async (req, res) => {
    var users = await userSchema.find();
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var levels = user.plat_levels_completed;
        var levels = levels.filter(function (item, pos) {
            return levels.indexOf(item) == pos;
        });
        user.plat_levels_completed = levels;
        await user.save();
    }
    res.send({ success: true, message: "Removed duplicates." });
})

module.exports = router;