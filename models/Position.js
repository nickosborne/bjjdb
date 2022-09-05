const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    topOptions: {
        type: [mongoose.objectId],
        required: true
    },
    bottomOptions: {
        type: [mongoose.objectId],
        required: true
    }
});

const Position = mongoose.model('Position', positionSchema);
module.exports = Position;