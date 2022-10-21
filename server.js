// const { ReportWebVital, ReportCrash } = require('./utilities/misc');

require('dotenv').config()

const express = require('express'),
path = require('path'),
    app = express(),
    expressLayouts = require('express-ejs-layouts');

const port = process.env.PORT || 5100,
    landingRouter = require('./routers/landing'),
    leaderboardRouter = require('./routers/leaderboard');

//ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
//mongo

app.use(expressLayouts);

app.use('/', landingRouter);
app.use('/leaderboard', leaderboardRouter)

app.get('/404', (req, res) => {
    res.render('404', { user: req.user });
})

app.listen(port, () => {
    console.log(`TS encryptid listening at http://localhost:${port}`)
})
