// const { ReportWebVital, ReportCrash } = require('./utilities/misc');

require('dotenv').config()

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require("cookie-session"),
    path = require('path'),
    cookieParser = require("cookie-parser"),
    expressLayouts = require('express-ejs-layouts'),
    passport = require('passport');

const port = process.env.PORT || 5100,
    passport_init = require('./utilities/passport'),
    backlinks = require('./utilities/backlinks.json'),
    bloatRouter = require('./routers/bloat'),
    landingRouter = require('./routers/landing'),
    playRouter = require('./routers/play'),
    adminRouter = require('./routers/admin'),
    profileRouter = require('./routers/profile'),
    leaderboardRouter = require('./routers/leaderboard'),
    authRouter = require("./routers/auth");

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
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
//mongo
const db = process.env.MONGO_URI;

//passportJs
if (process.env.NODE_ENV === 'production') {
    app.use(session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        sameSite: 'none',
        overwrite: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }));
} else {
    app.use(session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
    }));
}

app.use(cookieParser(process.env.SECRET));
app.use(expressLayouts);

app.get('*', (req, res, next) => {
    passport_init(passport, req);
    next();
})

//initializing passport
app.use(passport.initialize());
app.use(passport.session());

app.use(bloatRouter);
app.use('/', landingRouter);
app.use("/auth", authRouter)
app.use('/play', playRouter)
app.use('/admin', adminRouter)
app.use('/profile', profileRouter)
app.use('/leaderboard', leaderboardRouter)

app.get('/404', (req, res) => {
    res.render('404', { user: req.user });
})

app.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const link = backlinks.find(link => link.link === id);
    if (link) {
        if (link.backlink) {
            return res.redirect(link.backlink);
        }
        if (link.text) {
            return res.render('hiddentext', { link });
        }
    }
    else {
        res.redirect('/404');
    }
});

// app.use((err, req, res, next) => {
//     ReportCrash(err.stack.toString())
//     ReportWebVital("App Has Crashed, Please Check The Logs, Trying To Restart On My Own!");
//     next(err)
// })

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    // ReportWebVital(`Connected to Mongo DB`);
    console.log("Connected to Mongo DB")
    app.listen(port, () => {
        // ReportWebVital(`TS Prog listening at port ${port}`);
        console.log(`TS encryptid listening at http://localhost:${port}`)
    })
}).catch(err => {
    // ReportCrash(err.stack.toString())
    // ReportWebVital("App Has Crashed, Please Check The Logs, Trying To Restart On My Own!");
})
