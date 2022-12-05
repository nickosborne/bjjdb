const mongoose = require('mongoose');

const Sub = require('../models/Sub');
const SubVar = require('../models/SubVar')
//const SubImpl = require('../models/SubImpl');
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

    Sub.collection.drop();
    SubVar.collection.drop().then(() => { console.log('dropped subs') });
    //await SubImpl.collection.drop().then(() => { console.log('dropped subs') });


    reader.on("close", () => {
        for (let i = 1; i < data.length; i++) {

            let subData = data[i]
            var newSub = new Sub({
                name: subData[0],
                otherNames: subData[1],
            })

            let newSubVar = new SubVar({
                //name seeded as "classic" by default
                subId: newSub.id,
                subName: newSub.name,
            })

            newSubVar.save();
            newSub.subVars.push(newSubVar);
            newSub.save()
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

    seedSubmissions().then(() => { console.log("seeded subs") });
}
seedDB()

