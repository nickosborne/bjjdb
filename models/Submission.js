const mongoose = require('mongoose');
const { Schema } = mongoose;
const SubmissionVariation = require('./SubmissionVariation');
const Position = require('./Position');

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

submissionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // get all the submission Ids from the variations
        const vars = await SubmissionVariation.find({ _id: { $in: doc.variations } })
        const subIds = vars.map(({ position }) => { return position })

        // remove variations from submissions
        await Position.updateMany({ _id: { $in: subIds } }, {
            $pull: {
                variations: { $in: vars }
            }
        })

        // delete variations
        await SubmissionVariation.deleteMany({ _id: { $in: vars } });
    }
})

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;