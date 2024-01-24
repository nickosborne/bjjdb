const mongoose = require('mongoose');
const { journal } = require('../controllers/users');

const journalSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    },
    technique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technique'
    }
});

const Journal = mongoose.model('Journal', journalSchema);
module.exports = Journal;