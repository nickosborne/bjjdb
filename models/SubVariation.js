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
    submissionId: {
        type: Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    submissionName: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true
    }
});

const SubVariation = mongoose.model('SubVariation', subVariationSchema);
module.exports = SubVariation;