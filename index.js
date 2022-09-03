// getting-started.js
const mongoose = require('mongoose');
const { monitorEventLoopDelay } = require('perf_hooks');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/bjjdb')
        .then(() => {
            console.log("Connection open")
        })
        .catch(err => {
            console.log("connection error")
            console.log(err)
        });

    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const positionSchema = new mongoose.Schema({
    name: String,
    otherNames: [String],
    top: Boolean,
    options: [String]
});

const Position = mongoose.model('Position', positionSchema)

// Position.insertMany([
//     { name: 'Truck', otherNames: [], top: true, options: [] },
//     { name: 'Mount', otherNames: ['Front Mount'], top: true, options: [] },
//     { name: 'Back', otherNames: ['Back Mount', 'Rear Mount'], top: true, options: [] },
//     { name: 'Side Control', otherNames: [], top: true, options: ['Kesa Getame', 'Americana', 'Kimura'] },
//     { name: 'Crucifix', otherNames: [], top: true, options: ['Short Choke', 'Arm bar'] },
//     { name: 'Turtle', otherNames: [], top: true, options: ['Back Entry', 'Truck Entry'] },
// ])