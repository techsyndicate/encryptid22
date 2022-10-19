const router = require('express').Router();
const levelSchema = require('../models/levelSchema');
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

module.exports = router;