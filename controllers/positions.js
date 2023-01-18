const Position = require('../models/Position');
const Submission = require('../models/Submission');
const { positionSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    if (req.isAuthenticated()) {
        // get the user's edits and the ids of their parents
        const userPositions = await Position.find({ userId: req.user.id })
        let ids = [];
        userPositions.forEach(pos => ids.push(pos.parent));
        //get all unedited positions and filter out ones duplicated by the user positions
        const result = await Position.find({ edited: false });
        let positions = result.filter(pos => !ids.includes(pos.id));
        for (pos of userPositions) {
            positions.push(pos);
        }
        res.render('positions/index', { positions })
    } else {
        const positions = await Position.find({ edited: false })
        res.render('positions/index', { positions })
    }
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
    position.parent = position.id;
    await position.save();
    req.flash('success', 'Created the position!');
    res.redirect(`/positions/${position.id}`)
}

module.exports.show = async (req, res) => {
    const { id } = req.params;

    if (req.isAuthenticated()) {
        const position = await Position.findById(id).populate({
            path: 'submissions',
            match: {
                $or: [
                    { edited: false },
                    { userId: req.user.id }
                ]
            }
        });
        res.render('positions/show', { position })
    }
    else {
        const position = await Position.findById(id).populate({
            path: 'submissions',
            match: { edited: false }
        });
        res.render('positions/show', { position })
    }

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
        await Position.findByIdAndUpdate(position.parent, { ...req.body.position })
        req.flash('success', 'Approved the changes');
        res.redirect('/positions')
    } else if (req.body.position.edited === "false") {
        //if not admin, post new position in edited status and ref parent
        const newPosition = new Position(req.body.position);
        newPosition.parent = id
        newPosition.edited = true;
        newPosition.userId = req.user.id;
        await newPosition.save();
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
    req.flash('success', 'Position deleted.')
    res.redirect('/positions');
}