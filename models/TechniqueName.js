const mongoose = require('mongoose');

const techniqueNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const TechniqueName = mongoose.model('TechniqueName', techniqueNameSchema);
module.exports = TechniqueName;