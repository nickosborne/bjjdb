const mongoose = require('mongoose');

const techniques = [
    'Pass',
    'Sweep',
    'Submission',
    'Takedown',
    'Escape',
    'Back Take'
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
    Type: {
        type: String,
        enum: techniques
    },
    side: {
        type: String,
        enum: ['Top', 'Bottom'],
        default: 'Top'
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