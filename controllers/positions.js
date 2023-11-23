const Position = require('../models/Position');
const Submission = require('../models/Submission');
const { positionSchema, editSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const mongoose = require('mongoose');
const SubmissionVariation = require('../models/SubmissionVariation');
const Technique = require('../models/Technique')

// middleware
module.exports.validatePosition = (req, res, next) => {
    const { error } = positionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.index = async (req, res) => {
    if (req.isAuthenticated()) {
        let positions = await Position.find({ $or: [{ public: true }, { userId: req.user.id }] })
            .populate('edits').lean();

        // if the user has an edit, change the values to match the edit
        positions.forEach(pos =>
            pos.edits.forEach(edit => {
                if (edit.userId.toString() === req.user.id) {
                    pos.name = edit.name;
                    pos.otherNames = edit.otherNames;
                    pos.image = edit.image;
                }
            }));
        res.render('positions/index', { positions })
    } else {
        const positions = await Position.find({ public: true })
        res.render('positions/index', { positions })
    }
}

module.exports.admin = async (req, res) => {
    const result = await Position.find();
    let positions = result.filter(pos => !pos.public)
    let edits = result.filter(pos => pos.edits.length)
    res.render('positions/admin', { positions, edits })
}

module.exports.new = (req, res) => {
    res.render('positions/new');
}

module.exports.show = async (req, res) => {
    const techniqueTypes = Technique.schema.path('type').enumValues;
    const { id } = req.params;
    const submissions = await Submission.find({ public: true });
    const position = await Position.findById(id);
    const techniques = await Technique.find({ $and: [{ public: true }, { position: position }] });

    if (req.isAuthenticated()) {
        const position = await Position.findById(id);
        const subs = await SubmissionVariation.find({ $and: [{ $or: [{ public: true }, { userId: req.user.id }] }, { position: position.id }] });

        position.edits.forEach(edit => {
            if (edit.userId.toString() === req.user.id) {
                position.name = edit.name;
                position.otherNames = edit.otherNames;
                position.image = edit.image;
            }
        })
        res.render('positions/show', { position, techniques, techniqueTypes })
    }
    else {
        res.render('positions/show', { position, techniques, techniqueTypes })
    }
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id);
    res.render('positions/edit', { position })
}

// make a new position
module.exports.createPosition = async (req, res) => {
    const position = new Position(req.body.position);
    position.userId = req.user.id;
    position.public = false;
    await position.save();
    req.flash('success', 'Created the position!');
    res.redirect(`/positions/${position.id}`)
}

// insert an edit to a position
module.exports.postEdit = async (req, res) => {
    const { id } = req.params;
    const position = await (Position.findById(id));
    if (position) {
        position.edits.push({ ...req.body.position, userId: req.user.id })
        await position.save();
        req.flash('success', 'Posted an edit');
        res.redirect(`/positions/${position._id}`)
    }
    else {
        req.flash('error', 'Error finding position');
        res.redirect(`/positions/${id}`)
    }
}

// delete a position or an edit
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;

    // delete edit
    if (userId) {
        await Position.findByIdAndUpdate(id, {
            $pull: {
                edits: {
                    userId: { $eq: userId }
                }
            }
        });
        req.flash('success', 'Edit removed')
        res.redirect('/positions/admin');
    }
    // delete position
    else {
        await Position.findByIdAndDelete(id);
        req.flash('success', 'Position deleted.')
        res.redirect('/positions');
    }
}

// approve positions and edits
module.exports.approve = async (req, res) => {
    const { id } = req.params;
    const position = await Position.findByIdAndUpdate(id, {
        ...req.body.position,
        public: true,
        $pull: {
            edits: {
                userId: { $eq: req.body.position.userId }
            }
        }
    });

    if (position) {
        req.flash('success', 'approved')
    } else {
        req.flash('error', 'error')
    }
    res.redirect('/admin')
}