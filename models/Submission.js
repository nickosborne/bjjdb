const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
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
    variations: {
        type: [Schema.Types.ObjectId],
        ref: 'SubmissionVariation',
        required: false
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;