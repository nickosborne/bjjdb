const mongoose = require('mongoose');

const Position = require('../models/Position');
const fs = require("fs");
const readline = require("readline");

const seedPositions = async () => {
    let stream = fs.createReadStream("./seed/positions.csv");
    let reader = readline.createInterface({ input: stream });

    let data = [];

    reader.on("line", row => {
        // 👇 split a row string into an array
        // then push into the data array
        data.push(row.split(","));
    });

    Position.collection.drop();
    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let position = data[i]
            var p = new Position({
                name: position[0],
                otherNames: position[1],
                image: "http://1.bp.blogspot.com/-O_GvcSeU7GU/VkDfR40tm1I/AAAAAAAAAHg/UiSA25Cjj0Q/s1600/girls-bluebelt.jpg"
            })
            p.save()

        }
        console.log('seeded positions')
    });
}

function seedDB() {
    mongoose.connect('mongodb://localhost:27017/bjjdb')
        .then(() => { console.log("connection open") }).catch(error => console.log("error").then(seedPositions()));
    seedPositions()
}
seedDB()

