// required
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { positionSchema, subSchema } = require('./schemas.js')


//Models
const Position = require('./models/Position');
const Sub = require('./models/Sub');
const SubVar = require('./models/SubVar');
const SubImpl = require('./models/SubImpl');

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

    const { error } = subSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

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
    const position = await Position.findById(id).populate('subImpls');
    res.render('positions/show', { position })
}))

app.get('/positions/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id)
    const submissions = await Sub.find({}).populate({
        path: 'subVars'
    })
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

    const submissions = await Sub.find({})
    res.render('submissions/index', { submissions })
}))

app.get('/submissions/new', (req, res) => {
    res.render('submissions/new');
});

app.get('/submissions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const sub = await Sub.findById(id).populate({
        path: 'subVars',
        populate: {
            path: 'subImpls',
            populate: {
                path: 'position'
            }
        }
    });
    res.render('submissions/show', { sub })
}))

app.post('/submissions', validateSubmission, catchAsync(async (req, res) => {
    const sub = new Sub(req.body.submission);
    console.log(sub);
    const subVar = new SubVar({
        name: 'Classic',
        subId: sub.id,
        subName: sub.name,
    })
    await subVar.save();
    sub.subVars.push(subVar);
    await sub.save();
    res.redirect(`/submissions/${sub.id}`)
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

