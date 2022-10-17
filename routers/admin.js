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
    var level = await levelSchema.findOne({ levelNumber: req.body.levelNumber });
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

module.exports = router;