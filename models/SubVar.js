const mongoose = require('mongoose');
const { Schema } = mongoose;

const subVarSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Classic'
    },
    subId: {
        type: Schema.Types.ObjectId,
        ref: 'Sub',
        required: true
    },
    subName: {
        type: String,
        required: true,
    },
    subImpls: {
        type: [Schema.Types.ObjectId],
        ref: 'SubImpl',
        required: false
    }
});

const SubVar = mongoose.model('SubVar', subVarSchema);
module.exports = SubVar;