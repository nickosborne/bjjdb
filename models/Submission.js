const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: true
    },
    positions: {
        type: [mongoose.objectId],
        required: true
    },
    gi: {
        type: Boolean,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: ['Choke', 'Joint']
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;