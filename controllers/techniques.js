const ExpressError = require('../utils/ExpressError');
const { techniqueSchema } = require('../schemas.js')
const Technique = require('../models/Technique');
const TechniqueName = require('../models/TechniqueName');
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
    if (req.isAuthenticated()) {
        const techniques = await Technique.find({ $or: [{ public: true }, { userId: req.user.id }] })
        res.render('techniques/index', { techniques })
    }
    else {
        const techniques = await Technique.find({ public: true }).populate({ path: 'position' })
        res.render('techniques/index', { techniques })
    }
}

module.exports.new = async (req, res) => {
    const techniqueTypes = Technique.schema.path('type').enumValues;
    const positions = await Position.find()
    const techniqueNames = await TechniqueName.find()
    res.render('techniques/new', { positions, techniqueTypes, techniqueNames });
}
let findPositionById = async (id) => {
    return await Position.findOne({ id: id });
}

let validateTechniqueName = async (name) => {
    let techName = await TechniqueName.findOne({ name: name })
    if (techName) {
        console.log("found name")
        return techName.id;
    } else {
        let newTechName = new TechniqueName({
            name: name,
            public: false
        })
        await newTechName.save()
        console.log("created new name")
        return newTechName.id;
    }
}

module.exports.create = async (req, res) => {
    let { technique } = req.body;

    if (await findPositionById(technique.position)) {
        let id = await validateTechniqueName(technique.techniqueName)

        technique.techniqueName = id
        technique.public = false
        let newTechnique = await new Technique(technique).save()
        if (newTechnique) {
            req.flash('success', 'Created the technique!');
        }
        else {
            req.flash('error', 'Technique validation failed!');
        }
        res.redirect('/techniques')
    }
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
    const types = Technique.schema.path('type').enumValues;
    const positions = await Position.find();
    const techniques = await Technique.find({ public: false }).populate('position'
    ).populate('techniqueName');
    res.render('techniques/admin', { techniques, positions, types })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Technique.findByIdAndDelete(id);
    req.flash('success', 'Technique deleted.')
    res.redirect('/techniques/admin');
}