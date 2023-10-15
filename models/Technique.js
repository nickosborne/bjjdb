const mongoose = require('mongoose');

const techniques = [
    'Pass',
    'Sweep',
    'Submission',
    'Takedown',
    'Escape',
    'Backtake'
]

const techniqueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    techniqueName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechniqueName',
        required: true
    },
    type: {
        type: String,
        enum: techniques,
        required: true
    },
    side: {
        type: String,
        enum: ['Top', 'Bottom'],
        default: 'Top',
        required: true
    },
    video: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Technique = mongoose.model('Technique', techniqueSchema);
module.exports = Technique;