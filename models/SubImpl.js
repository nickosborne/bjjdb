const mongoose = require('mongoose');
const { Schema } = mongoose;

const subImplSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    subVar: {
        type: Schema.Types.ObjectId,
        ref: 'SubVar',
        required: true
    },
    video: {
        type: String,
        required: true
    }
});

const SubImpl = mongoose.model('SubImpl', subImplSchema);
module.exports = SubImpl;