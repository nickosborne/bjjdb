const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionVariationSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Classic'
    },
    submission: {
        type: Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    subName: {
        type: String,
        required: true,
    },
    posName: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    edited: {
        type: Boolean,
        default: true
    },
    userId: {
        type: String,
        default: ""
    }
});

const SubmissionVariation = mongoose.model('SubmissionVariation', submissionVariationSchema);
module.exports = SubmissionVariation;