const { close } = require('fs');
const mongoose = require('mongoose');

const Position = require('../models/Position');
const Submission = require('../models/Submission');
const SubVariation = require('../models/SubVariation');


async function testSeed() {
    const position = new Position({ name: "test position", otherNames: "alt name", image: "url here" })
    const submission = new Submission({ name: "triangle", otherNames: "Sankaku" });

    position.submissions.push(submission);
    submission.positions.push(position);
    await position.save();
    await submission.save();
    console.log(position);
    console.log(submission);
}

async function connect() {
    await mongoose.connect('mongodb://localhost:27017/bjjdb')
        .then(() => { console.log("connection open") }).catch(error => console.log("connection error"));
}

async function disconnect() {
    await mongoose.disconnect().then(() => { console.log("connection closed") }).catch(error => console.log("error disconnecting"));
}
async function seedDB() {
    await connect();
    await testSeed().then(() => { console.log('test complete') });
    await disconnect();
}

//seedDB();

//get a position and insert a submission into it
async function addSubmission() {
    await connect();
    let position = await Position.findOne({ name: "Mount" });
    console.log(position)
    let sub = await SubVariation.findOne({ name: "Classic" });
    position.submissions.push(sub);
    let update = await position.save();
    console.log(update);
    //await Position.findByIdAndUpdate({ id: position.id, submissions: push(submission.id) });
    await disconnect();
}
addSubmission();

//test findONe results
async function testFindOne() {
    await connect();
    let submission = await Submission.findOne();
    console.log(submission)
    submission = await Submission.findOne();
    console.log(submission)
    submission = await Submission.findOne();
    console.log(submission)
    submission = await Submission.findOne();
    console.log(submission)
    submission = await Submission.findOne();
    console.log(submission)
    submission = await Submission.findOne();
    console.log(submission)
    await disconnect();
}
//testFindOne();