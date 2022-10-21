// const { ReportWebVital, ReportCrash } = require('./utilities/misc');

require('dotenv').config()

const express = require('express'),
    app = express(),
    path = require('path'),
    expressLayouts = require('express-ejs-layouts');

const port = process.env.PORT || 5100,
    bloatRouter = require('./routers/bloat'),
    landingRouter = require('./routers/landing'),
    leaderboardRouter = require('./routers/leaderboard');

if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
}
else {
    app.disable('trust proxy');
}

app.use((req, res, next) => {
    if (req.headers.hasOwnProperty('x-forwarded-proto') && req.headers['x-forwarded-proto'].toString() !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    else {
        next();
    }
})

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.use(bloatRouter);
app.use('/', landingRouter);
app.use('/leaderboard', leaderboardRouter)

app.get('/404', (req, res) => {
    res.render('404', { user: req.user });
})

app.listen(port, () => {
    console.log(`TS encryptid listening at http://localhost:${port}`)
})
