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
    },
    edited: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parent: {
        type: String,
        default: ""
    }
});

submissionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // get all the submission Ids from the variations
        const vars = await mongoose.model('SubmissionVariation').find({ _id: { $in: doc.variations } })
        const subIds = vars.map(({ position }) => { return position })

        // remove variations from submissions
        await mongoose.model('Position').updateMany({ _id: { $in: subIds } }, {
            $pull: {
                variations: { $in: vars }
            }
        })

        // delete variations
        await mongoose.model('SubmissionVariation').deleteMany({ _id: { $in: vars } });
    }
})

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;