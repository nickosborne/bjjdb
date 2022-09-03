const mongoose = require('mongoose');
const Product = require('./models/Position');


mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("connection error")
        console.log(err)
    });


const Position = mongoose.model('Position', positionSchema)

Position.insertMany([
    { name: 'Truck', otherNames: [], top: true, options: [] },
    { name: 'Mount', otherNames: ['Front Mount'], top: true, options: [] },
    { name: 'Back', otherNames: ['Back Mount', 'Rear Mount'], top: true, options: [] },
    { name: 'Side Control', otherNames: [], top: true, options: ['Kesa Getame', 'Americana', 'Kimura'] },
    { name: 'Crucifix', otherNames: [], top: true, options: ['Short Choke', 'Arm bar'] },
    { name: 'Turtle', otherNames: [], top: true, options: ['Back Entry', 'Truck Entry'] },
])