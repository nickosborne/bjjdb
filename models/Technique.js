const mongoose = require('mongoose');

const techniques = [
    'Pass',
    'Sweep',
    'Submission',
    'Takedown',
    'Escape',
    'Back Take'
]
const tags = [
    'No Gi',
    'Choke',
    'Wrestling',
    'Judo',
    'Arm Lock',
    'Leg Lock',
    'Pain',
    'Collar Choke',
    'Lapel Choke',
    'Head and Arm Choke',
    'Sambo'
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
    techniqueType: {
        type: [String],
        enum: techniques
    },
    public: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});


const variationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    technique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technique',
        required: true
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    techniqueType: {
        type: String,
        enum: techniques
    },
    variation: {
        type: String,
        enum: [
            'Normal',
            'Reverse',
            'Inverted'
        ]
    },
    side: {
        type: String,
        enum: ['Top', 'Bottom'],
        default: 'Top'
    },
    tags: {
        type: String,
        enum: tags
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

const Variation = mongoose.model('Variation', variationSchema);
const Technique = mongoose.model('Technique', techniqueSchema);
module.exports = Technique, Variation;