const mongoose = require('mongoose');
const { Schema } = mongoose;

const positionSchema = new Schema({
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
    },
    subImpls: {
        type: [Schema.Types.ObjectId],
        ref: 'SubImpl',
        required: false
    },
});

const Position = mongoose.model('Position', positionSchema);
module.exports = Position;

