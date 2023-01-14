const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const SubmissionVariation = require('../models/SubmissionVariation')
const Position = require('../models/Position');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('./seed/subs.csv')
    .pipe(csv(['name', 'otherNames']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {

        let subs = [];
        let variations = [];
        await connect();
        let pos = await Position.findOne();
        for (sub of results) {

            var newSub = new Submission({
                name: sub.name,
                otherNames: sub.otherNames
            })

            let newSubVar = new SubmissionVariation({
                //name seeded as "classic" by default
                //name: `${newSub.name} - ${pos.name}`,
                submission: newSub.id,
                position: pos.id,
                video: 'https://www.youtube.com/watch?v=A4HkWMOcYaQ'
            });

            variations.push(newSubVar);
            newSub.variations.push(newSubVar);
            subs.push(newSub);
        }


        const ids = variations.map(({ id }) => { return mongoose.Types.ObjectId(id) });
        pos.submissions = ids;
        await pos.save();
        console.log(pos);

        await Submission.collection.drop().then(() => { console.log("dropped subs") })
        await SubmissionVariation.collection.drop().then(() => { console.log("dropped variatons") })

        await SubmissionVariation.insertMany(variations).then(() => { console.log("seeded variations") });
        await Submission.insertMany(subs).then(() => { console.log("seeded subs") });

        await disconnect();
    });


async function connect() {
    await mongoose.connect('mongodb://localhost:27017/bjjdb')
        .then(() => { console.log("connection open") }).catch(error => console.log("connection error"));
}

async function disconnect() {
    await mongoose.disconnect().then(() => { console.log("connection closed") }).catch(error => console.log("error disconnecting"));
}
