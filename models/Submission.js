const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: true
    },
    positions: {
        type: [Schema.Types.ObjectId],
        ref: 'Position',
        required: false
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;