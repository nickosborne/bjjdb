const { boolean } = require('joi');
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
    }
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;