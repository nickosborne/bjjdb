// Required
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {  submissionVariationSchema } = require('./schemas.js')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Models
const Position = require('./models/Position');
const Submission = require('./models/Submission');
const SubmissionVariation = require('./models/SubmissionVariation');
const User = require('./models/User');

// App setup
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: "testsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
const positionRoutes = require('./routes/positions')
const submissionRoutes = require('./routes/submissions')
const userRoutes = require('./routes/users')
app.use('/', userRoutes)
app.use('/positions', positionRoutes);
app.use('/submissions', submissionRoutes);





// connect to DB
mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("connection error")
        console.log(err)
    });

const validateSubmissionVariation = (req, res, next) => {

    const { error } = submissionVariationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Routes
app.get('/', (req, res) => {
    res.send('home')
})

app.post('/variations', validateSubmissionVariation, catchAsync( async (req, res) => {
    const {position,submission} = req.body.variation;
    const pos = await Position.findById(position);
    const sub = await Submission.findById(submission);

    if (sub && pos){
        const newVariation = new SubmissionVariation(req.body.variation)
        newVariation.save();
        sub.variations.push(newVariation);
        pos.submissions.push(newVariation);
        pos.save();
        sub.save();
    } else {
        console.log('error adding submission')
    }
    res.redirect(`/positions/${pos.id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'uh oh!!!';
    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("APP is listening on 3000")
});

