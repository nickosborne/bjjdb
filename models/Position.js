const { bool } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Submission = require('./Submission');
const SubmissionVariation = require('./SubmissionVariation');

const positionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: [String],
        required: false
    },
    image: {
        type: String,
        required: true
    },
    submissions: {
        type: [Schema.Types.ObjectId],
        ref: 'SubmissionVariation',
        required: false
    },
    edited: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

positionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // get all the submission Ids from the variations
        const vars = await SubmissionVariation.find({ _id: { $in: doc.submissions } })
        const subIds = vars.map(({ submission }) => { return submission })

        // remove variations from submissions
        await Submission.updateMany({ _id: { $in: subIds } }, {
            $pull: {
                variations: { $in: vars }
            }
        })

        // delete variations
        await SubmissionVariation.deleteMany({ _id: { $in: vars } });
    }
})
const Position = mongoose.model('Position', positionSchema);
module.exports = Position;

