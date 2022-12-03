const mongoose = require('mongoose');

const Submission = require('../models/Submission');
const SubVariation = require('../models/SubVariation')
const fs = require("fs");
const readline = require("readline");

const seedSubmissions = async () => {
    let stream = fs.createReadStream("./seed/subs.csv");
    let reader = readline.createInterface({ input: stream });

    let data = [];

    reader.on("line", row => {
        // 👇 split a row string into an array
        // then push into the data array
        data.push(row.split(","));
    });

    Submission.collection.drop();
    SubVariation.collection.drop();
    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let sub = data[i]
            var s = new Submission({
                name: sub[0],
                otherNames: sub[1],
            })

            let variation = new SubVariation({
                submissionId: s.id,
                submissionName: s.name,
                video: 'https://www.youtube.com/watch?v=nuaT_7PkqMg'
            })

            variation.save();
            s.variations.push(variation);
            s.save()
        }
    });
}
async function connect() {
    await mongoose.connect('mongodb://localhost:27017/bjjdb')
        .then(() => { console.log("connection open") }).catch(error => console.log("connection error"));
}

async function disconnect() {
    mongoose.disconnect().then(() => { console.log("connection closed") }).catch(error => console.log("error disconnecting"));
}
async function seedDB() {
    await connect();
    await Submission.deleteMany().then(() => { console.log("dropped submissions") });
    seedSubmissions().then(() => { console.log("seeded subs") });
}
seedDB()

