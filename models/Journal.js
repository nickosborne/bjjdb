const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technique'
    }
});

const Journal = mongoose.model('Journal', journalSchema);
module.exports = Journal;