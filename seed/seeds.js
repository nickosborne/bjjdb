const mongoose = require('mongoose');
const Position = require('./models/Position');

const fs = require("fs");
const readline = require("readline");

mongoose.connect('mongodb://localhost:27017/bjjdb')
    .then(() => { console.log("connection open") }).catch(error => console.log("error"))



const seedDB = async () => {
    const stream = fs.createReadStream("./positions.csv");
    const reader = readline.createInterface({ input: stream });

    let data = [];

    reader.on("line", row => {
        // 👇 split a row string into an array
        // then push into the data array
        data.push(row.split(","));
    });

    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let position = data[i]
            var top = true ? position[1] == "TRUE" : false;
            var p = new Position({
                name: position[0],
                top: top
            })
            p.save()
        }
    });
}

seedDB()