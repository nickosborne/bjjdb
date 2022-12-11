const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Submission = require('../models/Submission');
const { submissionSchema } = require('../schemas.js');

const validateSubmission = (req, res, next) => {

    const { error } = submissionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Submission routes
router.get('/', catchAsync(async (req, res) => {

    const submissions = await Submission.find({})
    res.render('submissions/index', { submissions })
}))

router.get('/new', (req, res) => {
    res.render('submissions/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const sub = await Submission.findById(id).populate({
        path: 'variations'
    });
    res.render('submissions/show', { sub })
}))

router.post('/', validateSubmission, catchAsync(async (req, res) => {
    const sub = new Submission(req.body.submission);
    await sub.save();
    res.redirect(`/submissions/${sub.id}`)
}))

module.exports = router;