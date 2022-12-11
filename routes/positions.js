const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Position = require('../models/Position');
const Submission = require('../models/Submission');
const { positionSchema } = require('../schemas.js');


const validatePosition = (req, res, next) => {

    const { error } = positionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Position routes
router.get('/', catchAsync(async (req, res) => {
    const positions = await Position.find({})
    res.render('positions/index', { positions })
}));

router.get('/new', (req, res) => {
    res.render('positions/new');
});

router.post('/', validatePosition, catchAsync(async (req, res) => {
    const position = new Position(req.body.position);
    await position.save();
    res.redirect(`/positions/${position.id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id).populate('submissions');
    const submissions = await Submission.find().populate({ path: 'variations' }).sort({ name: 1 })
    res.render('positions/show', { position, submissions })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findById(id).populate({ path: 'submissions' }).sort({ name: 1 })
    res.render('positions/edit', { position })
}))

router.put('/:id', validatePosition, catchAsync(async (req, res) => {
    const { id } = req.params;
    const position = await Position.findByIdAndUpdate(id, { ...req.body.position })
    res.redirect(`/positions/${position._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Position.findByIdAndDelete(id);
    res.redirect('/positions');
}))

module.exports = router;