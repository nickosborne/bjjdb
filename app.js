// Required
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const Technique = require('./models/Technique');
const Position = require('./models/Position');

const dbUrl = "mongodb+srv://nick:sNFl8jJdigY8oMNd@cluster0.uavscjk.mongodb.net/?retryWrites=true&w=majority"
//const dbUrl = 'mongodb://localhost:27017/bjjdb'

const session = require('express-session');
const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//Models
const User = require('./models/User');

// App setup
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    store,
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
    if (req.method === "GET") {
        req.session.previous = req.session.current;
        req.session.current = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
const positionRoutes = require('./routes/positions')
const submissionRoutes = require('./routes/submissions')
const userRoutes = require('./routes/users')
const contributeRoutes = require('./routes/contribute')
const techniqueRoutes = require('./routes/techniques')
app.use('/users', userRoutes)
app.use('/positions', positionRoutes);
app.use('/submissions', submissionRoutes);
app.use('/contribute', contributeRoutes)
app.use('/techniques', techniqueRoutes)

// connect to DB
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("connection error")
        console.log(err)
    });

// Routes
app.get('/', async (req, res) => {
    const techniques = await Technique.find({ public: true })
    const count = techniques.length
    res.render('home/home', { count })
})

app.get('/search/:q', async (req, res) => {
    let { q } = req.params;
    q = q.replace(/[^a-zA-Z ]/g, "")
    let results = []
    const query = { name: { $regex: q, $options: "i" } }
    const techs = await Technique.find(query, 'name group')
    for (let tech of techs) {
        results.push({
            "name": tech.name,
            "link": `/techniques/${tech.group}`,
            "type": "Technique"
        })
    }

    const positions = await Position.find(query, 'name')
    for (let pos of positions) {
        results.push({
            "name": pos.name,
            "link": `/positions/${pos._id}`,
            "type": "Position"
        })
    }
    res.send({ results })
})


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

