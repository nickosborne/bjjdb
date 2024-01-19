const ExpressError = require('../utils/ExpressError');
const { techniqueSchema } = require('../schemas.js')
const Technique = require('../models/Technique');
const Group = require('../models/Group');
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

    const url = new URL('https://youtu.be/U8tGzGVRiQA?feature=shared&t=24')
    console.log(url)
    if (req.isAuthenticated()) {
        const groups = await Group.find({ $or: [{ public: true }, { userId: req.user.id }] })
        res.render('techniques/index', { groups })
    }
    else {
        const groups = await Group.find({ public: true })
        res.render('techniques/index', { groups })
    }
}

module.exports.new = async (req, res) => {
    const techniqueTypes = Technique.schema.path('type').enumValues;
    const positions = await Position.find()
    const groups = await Group.find()
    res.render('techniques/new', { positions, techniqueTypes, groups });
}
let findPositionById = async (id) => {
    return await Position.findOne({ id: id });
}

let validateGroup = async (name, userId) => {
    let techName = await Group.findOne({ name: name })
    if (techName) {
        return techName.id;
    } else {
        let newGroup = new Group({
            name: name,
            public: false,
            userId: userId
        })
        await newGroup.save()
        return newGroup.id;
    }
}

module.exports.create = async (req, res) => {
    let { technique } = req.body;

    if (await findPositionById(technique.position)) {
        let groupId = await validateGroup(technique.group, technique.userId)
        technique.group = groupId
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

module.exports.GetTechniquesByGroup = async (req, groupId) => {
    if (req.isAuthenticated()) {
        return await Technique.find({
            $or: [
                { $and: [{ public: true }, { group: groupId }] },
                { $and: [{ userId: req.user.id }, { group: groupId }] }
            ]
        }).populate('position');
    }
    else {
        return await Technique.find({ $and: [{ public: true }, { group: groupId }] }).populate('position')
    }
}

module.exports.GetTechniquesByPosition = async (req, positionId) => {
    if (req.isAuthenticated()) {
        return await Technique.find({
            $or: [
                { $and: [{ public: true }, { position: positionId }] },
                { $and: [{ userId: req.user.id }, { position: positionId }] }
            ]
        }).populate('group');
    }
    else {
        return await Technique.find({ $and: [{ public: true }, { position: positionId }] },).populate('group');
    }
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    let { technique } = req.body
    let groupId = await validateGroup(technique.group, technique.userId)
    // approve the group
    await Group.findByIdAndUpdate(groupId, { public: true })
    technique.group = groupId
    technique.public = true
    console.log(technique)
    const update = await (Technique.findByIdAndUpdate(id, technique));
    if (update) {
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
    ).populate('group');
    res.render('techniques/admin', { techniques, positions, types })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Technique.findByIdAndDelete(id);
    req.flash('success', 'Technique deleted.')
    res.redirect('/techniques/admin');
}

module.exports.show = async (req, res) => {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    const techniques = await module.exports.GetTechniquesByGroup(req, groupId);
    const positions = await Position.find({ public: true })
    const techniqueTypes = Technique.schema.path('type').enumValues;
    if (group) {
        res.render('techniques/show', { techniques, group, positions, techniqueTypes })
    }
    else {
        res.redirect('/techniques');
    }
}