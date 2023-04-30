const mongoose = require('mongoose');
const Technique = require('../models/Technique');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('./seed/techniques.csv')
    .pipe(csv(['name', 'otherNames', 'type']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {

        try {
            techniques = [];
            connect();
            //await Technique.collection.drop().then(() => { console.log("dropped techniques") })
            for (technique of results) {

                var newTechnique = new Technique({
                    name: technique.name,
                    otherNames: technique.otherNames,
                    techniqueType: technique.type,
                    public: true
                })
                techniques.push(newTechnique);
            }
            await Technique.insertMany(techniques).then(() => { console.log("seeded techniques") });
            disconnect();
        } catch (e) {
            console.log(e)
        }

    });


async function connect() {
    await mongoose.connect('mongodb://localhost:27017/bjjdb')
        .then(() => { console.log("connection open") }).catch(error => console.log("connection error"));
}

async function disconnect() {
    await mongoose.disconnect().then(() => { console.log("connection closed") }).catch(error => console.log("error disconnecting"));
}
