// required
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { positionSchema, submissionSchema } = require('./schemas.js')


//Models
const Position = require('./models/Position');
const Submission = require('./models/Submission');
const SubmissionVariation = require('./models/SubmissionVariation');
//const SubImpl = require('./models/SubImpl');

// App setup
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// connect to DB
mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("connection error")
        console.log(err)
    });


/////////////////////////////////////////////////////////// Validation
const validatePosition = (req, res, next) => {

    const { error } = positionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateSubmission = (req, res, next) => {

    const { error } = submissionSchema.validate(req.body);
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

// Position routes
app.get('/positions', catchAsync(async (req, res) => {
    const positions = await Position.find({})
    res.render('positions/index', { positions })
}));

app.get('/positions/new', (req, res) => {
    res.render('positions/new');
});

app.post('/positions', validatePosition, catchAsync(async (req, res) => {
    const position = new Position(req.body.position);
    await position.save();
    res.redirect(`/positions/${position.id}`)
}))

app.get('/positions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id).populate('submissions');
    res.render('positions/show', { position })
}))

app.get('/positions/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id)
    const submissions = await Submission.find({}).populate({
        path: 'subVars'
    }).sort({ name: 1 });
    res.render('positions/edit', { position, submissions })
}))

app.put('/positions/:id', validatePosition, catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findByIdAndUpdate(id, { ...req.body.position })
    res.redirect(`/positions/${position._id}`)
}))

app.delete('/positions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Position.findByIdAndDelete(id);
    res.redirect('/positions');
}))

// Submission routes
app.get('/submissions', catchAsync(async (req, res) => {

    const submissions = await Submission.find({})
    res.render('submissions/index', { submissions })
}))

app.get('/submissions/new', (req, res) => {
    res.render('submissions/new');
});

app.get('/submissions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const sub = await Submission.findById(id).populate({
        path: 'variations'
    });
    res.render('submissions/show', { sub })
}))

app.post('/submissions', validateSubmission, catchAsync(async (req, res) => {
    const sub = new Submission(req.body.submission);
    console.log(sub);
    await sub.save();
    res.redirect(`/submissions/${sub.id}`)
}))

app.post('/subimpls', catchAsync(async (req, res) => {
    const subimpl = new SubImpl(req.body.subImpl);
    console.log(subimpl)
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

