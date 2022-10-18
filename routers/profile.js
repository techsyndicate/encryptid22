const { checkAuthenticated } = require('../utilities/misc');
const User = require('../models/userSchema');
const router = require('express').Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render('pages/profile', { user: req.user, avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}` });
});

router.get('/test', checkAuthenticated, (req, res) => {
    res.render('pages/completeProfile', {user: req.user})
})

router.post('/updateProfile', checkAuthenticated, async (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, {
        $set: {
            plat_name: req.body.name,
            plat_school: req.body.school
        }
    }).then((err, doc) => {
        if (err) {
            console.log(err);
        }
        res.send({ success: true, message: 'Profile updated successfully!' });
    })
})

module.exports = router;