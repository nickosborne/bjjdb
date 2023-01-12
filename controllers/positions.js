const Position = require('../models/Position');
const Submission = require('../models/Submission');
const { positionSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    let findPositions;
    if (req.isAuthenticated()) {
        findPositions = await Position.find({ $or: [{ edited: false }, { userId: req.user.id }] })
    } else {
        findPositions = await Position.find({ edited: false })
    }
    const positions = findPositions;
    res.render('positions/index', { positions })
}

module.exports.admin = async (req, res) => {
    const positions = await Position.find({ edited: true })
    res.render('positions/index', { positions })
}

module.exports.validatePosition = (req, res, next) => {
    const { error } = positionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.new = (req, res) => {
    res.render('positions/new');
}

module.exports.createPosition = async (req, res) => {
    const position = new Position(req.body.position);
    await position.save();
    req.flash('success', 'Created the position!');
    res.redirect(`/positions/${position.id}`)
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id).populate({
        path: 'submissions',
        populate: {
            path: 'submission'
        }
    })
    if (!position) {
        req.flash('error', 'Position not found!')
        return res.redirect('/positions')
    }
    res.render('positions/show', { position })
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id).populate({ path: 'submissions' }).sort({ name: 1 })
    res.render('positions/edit', { position })
}

module.exports.addSub = async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id).populate({ path: 'submissions' }).sort({ name: 1 })
    const submissions = await Submission.find().populate({ path: 'variations' }).sort({ name: 1 })

    res.render('positions/addSub', { position, submissions })
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    if (req.user.admin) {
        // if admin, delete edited version, update parent with changes
        req.body.position.edited = false;
        const position = await Position.findByIdAndDelete(id);
        const parent = await Position.findByIdAndUpdate(position.parent, { ...req.body.position })
        req.flash('success', 'Approved the changes');
        res.redirect('/positions')
    } else if (req.body.position.edited === "false") {
        //if not admin, post new position in edited status and ref parent
        const newPosition = new Position(req.body.position);
        newPosition.parent = id;
        newPosition.edited = true;
        await newPosition.save();
        const posParent = await Position.findById(id);
        req.flash('success', 'Posted the position.');
        res.redirect(`/positions/${newPosition.id}`)
    } else {
        // if editing a position that already has an edited status, just add the edit
        const position = await Position.findByIdAndUpdate(id, { ...req.body.position })
        req.flash('success', 'Updated the position.');
        res.redirect(`/positions/${position._id}`)
    }
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Position.findByIdAndDelete(id);
    res.redirect('/positions');
}