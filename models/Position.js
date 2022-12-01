const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    }
});

const Position = mongoose.model('Position', positionSchema);
module.exports = Position;

