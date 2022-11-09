const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    positions: {
        type: [mongoose.objectId],
        required: true
    },
    url: {
        type: String,
        required: false
    }
});

const Pass = mongoose.model('Pass', passSchema);
module.exports = Pass;