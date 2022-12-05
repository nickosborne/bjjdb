const mongoose = require('mongoose');
const { Schema } = mongoose;

const subSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    subType: {
        type: String,
        enum: ['Choke', 'Break', 'Pain'],
        default: 'Choke',
        required: true
    },
    subVars: {
        type: [Schema.Types.ObjectId],
        ref: 'SubVar',
        required: false
    }
});

const Sub = mongoose.model('Sub', subSchema);
module.exports = Sub;