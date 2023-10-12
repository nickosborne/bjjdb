const ExpressError = require('../utils/ExpressError');
const { techniqueSchema } = require('../schemas.js')
const Technique = require('../models/Technique')
const Position = require('../models/Position');

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

    const techniques = await Technique.find({ public: true }).populate({ path: 'position' })
    res.render('techniques/index', { techniques })

}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const technique = await Technique.findById(id).populate({
        path: 'position',
        match: { approved: true }
    });
    res.render('techniques/show', { technique })
}

module.exports.new = async (req, res) => {
    const positions = await Position.find()
    res.render('techniques/new', { positions });
}

module.exports.create = async (req, res) => {
    const technique = new Technique(req.body.technique);
    technique.userId = req.user.id;
    technique.public = true;
    await technique.save();
    req.flash('success', 'Created the technique!');
    res.redirect(`/techniques/${technique.id}`)
}