function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated() ) {
        if ((req.user.plat_name === undefined || req.user.plat_school === undefined) && req.method !== 'POST') {
            return res.render('pages/completeProfile', {user: req.user})
        }
        return next();
    }
    res.redirect("/auth/discord");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect(`/profile`);
    }
    next();
}

function checkAdmin(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated() && req.user.admin === true) {
        return next();
    }
    res.redirect("/profile");
}

module.exports = { checkAdmin, checkAuthenticated, checkNotAuthenticated }
