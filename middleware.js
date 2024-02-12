const Technique = require('./models/Technique');
const Group = require('./models/Group');
const Position = require('./models/Position');
const User = require('./models/User');
const Journal = require('./models/Journal');
const { journalSchema, techniqueSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError');

module.exports.forceLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must me signed in');
        return res.redirect('/users/login')
    }
    next()
}

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    if (req.session.previous) {
        res.locals.previous = req.session.previous;
    }
    next()
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    }
    else {
        req.flash('error', 'Permission denied.')
        res.redirect('/positions')
    }
}

module.exports.GetTechniquesForRequest = async (req) => {
    if (req.isAuthenticated()) {
        return await Technique.find({ $or: [{ public: true }, { userId: req.user.id }] })
    }
    else {
        return await Technique.find({ pubic: true })
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

module.exports.validateJournal = (req, res, next) => {
    const { error } = journalSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateTechnique = (req, res, next) => {

    const { error } = techniqueSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.GetPositionsForRequest = async (req) => {
    if (req.isAuthenticated()) {
        return await Position.find({ $or: [{ public: true }, { userId: req.user.id }] })
    }
    else {
        return await Position.find({ public: true });
    }
}

module.exports.GetJournalsForRequest = async function (req, filter = {}) {
    if (req.isAuthenticated()) {
        return await Journal.find({ $and: [{ userId: req.user.id }, filter] })
    }
    else {
        return [];
    }
}