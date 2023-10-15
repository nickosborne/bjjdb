const mongoose = require('mongoose');
const Technique = require('../models/Technique');
const Position = require('../models/Position');
const TechniqueName = require('../models/TechniqueName');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('./seed/techniques.csv')
    .pipe(csv(['name', 'otherNames', 'type']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {

        try {
            techniqueNames = [];
            techniques = [];
            await connect();
            await Technique.collection.drop().then(() => { console.log("dropped techniques") })
            let pos = await Position.findOne();
            await TechniqueName.collection.drop().then(() => { console.log("dropped techniqueNames") })

            for (technique of results) {
                var newTechniqueName = new TechniqueName({
                    name: technique.name
                })
                techniqueNames.push(newTechniqueName)

                var newTechnique = new Technique({
                    name: technique.name,
                    otherNames: technique.otherNames,
                    type: technique.type,
                    public: true,
                    position: pos.id,
                    techniqueName: newTechniqueName.id,
                    video: 'https://www.youtube.com/watch?v=A4HkWMOcYaQ'
                })
                techniques.push(newTechnique);
            }
            await TechniqueName.insertMany(techniqueNames).then(() => { console.log("seeded techniqueNames") });
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
