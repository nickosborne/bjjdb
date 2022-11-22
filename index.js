// getting-started.js
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');


//Models
const Position = require('./models/Position');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("connection error")
        console.log(err)
    });

app.get('/', (req, res) => {
    res.render('home/home')
})

app.get('/positions', async (req, res) => {
    const positions = await Position.find({})
    res.render('positions/index', { positions })
})

app.get('/positions/:id', async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id)
    res.render('positions/details', { position })
})

app.listen(3000, () => {
    console.log("APP is listening on 3000")
});

