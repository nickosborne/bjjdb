const ExpressError = require('../utils/ExpressError');
const { submissionSchema, submissionVariationSchema } = require('../schemas.js');
const Position = require('../models/Position');
const Submission = require('../models/Submission');
const SubmissionVariation = require('../models/SubmissionVariation');

module.exports.validateSubmission = (req, res, next) => {

    const { error } = submissionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateSubmissionVariation = (req, res, next) => {

    const { error } = submissionVariationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.index = async (req, res) => {

    const submissions = await Submission.find({})
    res.render('submissions/index', { submissions })
}

module.exports.new = (req, res) => {
    res.render('submissions/new');
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const sub = await Submission.findById(id).populate({
        path: 'variations'
    });
    if (!sub) {
        req.flash('error', 'Submission not found!')
        return res.redirect('/submissions')
    }
    res.render('submissions/show', { sub })
}

module.exports.update = async (req, res) => {
    const sub = new Submission(req.body.submission);
    await sub.save();
    res.redirect(`/submissions/${sub.id}`)
}

module.exports.createVariation = async (req, res) => {
    const { position, submission } = req.body.variation;
    const pos = await Position.findById(position);
    const sub = await Submission.findById(submission);

    if (sub && pos) {
        const newVariation = new SubmissionVariation(req.body.variation)
        newVariation.save();
        sub.variations.push(newVariation);
        pos.submissions.push(newVariation);
        pos.save();
        sub.save();
    } else {
        console.log('error adding submission')
    }
    res.redirect(`/positions/${pos.id}`);
}