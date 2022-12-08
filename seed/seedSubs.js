const mongoose = require('mongoose');

const Submission = require('../models/Submission');
const SubmissionVariation = require('../models/SubmissionVariation')
const Position = require('../models/Position');
//const SubImpl = require('../models/SubImpl');
const fs = require("fs");
const readline = require("readline");
const { submissionSchema } = require('../schemas');

const seedSubmissions = async () => {
    let stream = fs.createReadStream("./seed/subs.csv");
    let reader = readline.createInterface({ input: stream });

    let data = [];

    reader.on("line", row => {
        // 👇 split a row string into an array
        // then push into the data array
        data.push(row.split(","));
    });

    //await Submission.collection.drop();
    //await SubmissionVariation.collection.drop().then(() => { console.log('dropped subs') });
    //await SubImpl.collection.drop().then(() => { console.log('dropped subs') });
    let subs = [];
    let variations = [];
    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let subData = data[i]
            var newSub = new Submission({
                name: subData[0],
                otherNames: subData[1]
            })

            let newSubVar = new SubmissionVariation({
                //name seeded as "classic" by default
                submission: newSub.id,
                position: '639148b6e8edbacd03b46899',
                video: 'https://www.youtube.com/embed/A4HkWMOcYaQ'
            })

            variations.push(newSubVar);
            newSub.variations.push(newSubVar);
            subs.push(newSub);
        }
    });

    await SubmissionVariation.insertMany(subs);
    await Submission.insertMany(variations);

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

    await seedSubmissions().then(() => { console.log("seeded subs") });
}
seedDB()

