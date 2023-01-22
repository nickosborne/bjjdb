const { bool, object } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const positionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    otherNames: {
        type: String,
        required: false,
        default: ""
    },
    image: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approved: {
        type: Boolean,
        default: false
    },
    edits: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        },
        otherNames: {
            type: String
        },
        image: {
            type: String
        }
    }]
});

positionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // get all the submission Ids from the variations
        const vars = await mongoose.model('SubmissionVariation').find({ position: { $eq: doc._id } })
        const subIds = vars.map(({ submission }) => { return submission })

        // remove variations from submissions
        await mongoose.model('Submission').updateMany({ _id: { $in: subIds } }, {
            $pull: {
                variations: { $in: vars }
            }
        })

        // delete variations
        await mongoose.model('SubmissionVariation').deleteMany({ position: { $eq: doc._id } });
    }
})
const Position = mongoose.model('Position', positionSchema);
module.exports = Position;

