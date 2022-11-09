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
    Subs: {
        type: [mongoose.objectId],
        required: false
    },
    Sweeps: {
        type: [mongoose.objectId],
        required: false
    },
    Passes: {
        type: [mongoose.objectId],
        required: false
    },
    Transitions: {
        type: [mongoose.objectId],
        required: false
    },
    guard: {
        type: Boolean,
        required: true
    }
});

const Position = mongoose.model('Position', positionSchema);
module.exports = Position;

