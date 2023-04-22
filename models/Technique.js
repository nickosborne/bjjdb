const mongoose = require('mongoose');

const techniqueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    type: {
        type: String,
        enum: ['Submission', 'Sweep', 'Pass', 'Takedown'],
        required: true
    },
    approved: {
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