const mongoose = require('mongoose');
const Position = require('./models/Position');
const Submission = require('./models/Submission');

const fs = require("fs");
const readline = require("readline");

mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => { console.log("connection open") }).catch(error => console.log("error"))



const seedPositions = async () => {
    let stream = fs.createReadStream("./seed/positions.csv");
    let reader = readline.createInterface({ input: stream });

    let data = [];

    reader.on("line", row => {
        // 👇 split a row string into an array
        // then push into the data array
        data.push(row.split(","));
    });

    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let position = data[i]
            var p = new Position({
                name: position[0],
            })
            p.save()
        }
    });
}

const seedSubs = async () => {
    let stream = fs.createReadStream("./seed/subs.csv");
    let reader = readline.createInterface({ input: stream });

    let data = [];

    reader.on("line", row => {
        // 👇 split a row string into an array
        // then push into the data array
        data.push(row.split(","));
    });

    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let submission = data[i]
            var s = new Submission({
                name: submission[0],
                type: submission[1],
                gi: submission[2]
            })
            s.save()
        }
    });
}

function seedDB() {
    seedPositions()
    seedSubs()

}
seedDB()

//Position.findByIdAndUpdate("6316568f57c5f2096312fac0", { $push: { topOptions: ["fifty fifty"] } })
