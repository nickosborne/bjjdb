// getting-started.js
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');


//Models
const Position = require('./models/Position');

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("connection error")
        console.log(err)
    });



app.get('/', (req, res) => {
    res.send('home')
})

app.get('/positions', catchAsync(async (req, res, next) => {
    const positions = await Position.find({})
    res.render('positions/index', { positions })
}))

app.get('/positions/new', (req, res) => {
    res.render('positions/new');
});

app.post('/positions', catchAsync(async (req, res) => {
    const position = new Position(req.body.position);
    await position.save();
    res.redirect(`/positions/${position.id}`)
}))

app.get('/positions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id)
    res.render('positions/show', { position })
}))

app.get('/positions/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id)
    res.render('positions/edit', { position })
}))

app.put('/positions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findByIdAndUpdate(id, { ...req.body.position })
    res.redirect(`/positions/${position._id}`)
}))

app.delete('/positions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Position.findByIdAndDelete(id);
    res.redirect('/positions');
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

