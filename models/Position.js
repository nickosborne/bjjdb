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
    public: {
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
        // remove all techniques linked to this position
        const techniques = await mongoose.model('Technique').find({ position: { $eq: doc._id } })
        await mongoose.model('Technique').deleteMany({ _id: { $in: techniques } });
    }
})
const Position = mongoose.model('Position', positionSchema);
module.exports = Position;

