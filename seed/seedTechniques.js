const mongoose = require('mongoose');
const Technique = require('../models/Technique');
const Position = require('../models/Position');
const Group = require('../models/Group');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('./seed/techniques.csv')
    .pipe(csv(['name', 'otherNames', 'type']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {

        try {
            groups = [];
            techniques = [];
            await connect();
            await Technique.collection.drop().then(() => { console.log("dropped techniques") })
            let pos = await Position.findOne();
            await Group.collection.drop().then(() => { console.log("dropped groups") })

            for (technique of results) {
                var newGroup = new Group({
                    name: technique.name
                })
                groups.push(newGroup)

                var newTechnique = new Technique({
                    name: technique.name,
                    otherNames: technique.otherNames,
                    type: technique.type,
                    public: true,
                    position: pos.id,
                    group: newGroup.id,
                    video: 'https://www.youtube.com/watch?v=A4HkWMOcYaQ'
                })
                techniques.push(newTechnique);
            }
            await Group.insertMany(groups).then(() => { console.log("seeded groups") });
            await Technique.insertMany(techniques).then(() => { console.log("seeded techniques") });
            disconnect();
        } catch (e) {
            console.log(e)
        }

    });

const dbUrl = "mongodb+srv://nick:sNFl8jJdigY8oMNd@cluster0.uavscjk.mongodb.net/?retryWrites=true&w=majority"
//const dbUrl = 'mongodb://localhost:27017/bjjdb'
async function connect() {
    await mongoose.connect(dbUrl)
        .then(() => { console.log("connection open") }).catch(error => console.log("connection error"));
}

async function disconnect() {
    await mongoose.disconnect().then(() => { console.log("connection closed") }).catch(error => console.log("error disconnecting"));
}
