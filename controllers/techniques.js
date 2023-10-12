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
    technique.public = false;
    await technique.save();
    req.flash('success', 'Created the technique!');
    res.redirect(`/techniques/${technique.id}`)
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const technique = await (Technique.findByIdAndUpdate(id,
        {
            ...req.body.submission,
            public: true
        }));
    if (technique) {
        req.flash('success', 'approved')
    } else {
        req.flash('error', 'error approving technique')
    }
    res.redirect('/techniques/admin')
}

module.exports.admin = async (req, res) => {
    const types = [
        'Pass',
        'Sweep',
        'Submission',
        'Takedown',
        'Escape',
        'Back Take'
    ]
    const positions = await Position.find();
    const techniques = await Technique.find({ public: false }).populate(
        {
            path: 'position'
        }
    );
    res.render('techniques/admin', { techniques, positions, types })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Technique.findByIdAndDelete(id);
    req.flash('success', 'Technique deleted.')
    res.redirect('/techniques/admin');
}