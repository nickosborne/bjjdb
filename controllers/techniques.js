const ExpressError = require('../utils/ExpressError');
const techniqueSchema = require('../schemas.js')
const Technique = require('../models/Technique')

module.exports.validateTechnique = (req, res, next) => {

    const { error } = techniqueSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.index = async (req, res) => {

    const techniques = await Technique.find({ public: true })
    res.render('techniques/index', { techniques })

}