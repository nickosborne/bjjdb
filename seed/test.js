const { close } = require('fs');
const mongoose = require('mongoose');

const Position = require('../models/Position');
const Sub = require('../models/Sub');
const SubVar = require('../models/SubVar');
const SubImpl = require('../models/SubImpl');


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
    let subVar = await SubVar.findOne({ subName: "Triangle" });
    let subImpl = new SubImpl({
        name: `${subVar.name} ${subVar.subName}`,
        position: position.id,
        subVar: subVar.id,
        video: "https://www.youtube.com/embed/A4HkWMOcYaQ"
    });

    position.subImpls.push(subImpl);
    subVar.subImpls.push(subImpl);

    let res = await subImpl.save();
    console.log(res, '/n');
    res = await position.save();
    console.log(res);
    res = await subVar.save();
    console.log(res);

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