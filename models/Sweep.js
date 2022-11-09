const mongoose = require('mongoose');

const sweepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: true
    },
    positions: {
        type: [mongoose.objectId],
        required: true
    },
    url: {
        type: String,
        required: false
    }
})

const Sweep = mongoose.model('Sweep', sweepSchema);
module.exports = Sweep;