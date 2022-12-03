const mongoose = require('mongoose');
const { Schema } = mongoose;

const subVariationSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Classic'
    },
    positions: {
        type: Schema.Types.ObjectId,
        ref: 'Position',
        required: false
    },
    submission: {
        type: Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    video: {
        type: String,
        required: true
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;