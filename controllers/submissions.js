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
    if (req.isAuthenticated()) {
        let submissions = await Submission.find({ $or: [{ approved: true }, { userId: req.user.id }] })
            .populate('edits').lean();

        // if the user has an edit, change the values to match the edit
        submissions.forEach(sub =>
            sub.edits.forEach(edit => {
                if (edit.userId.toString() === req.user.id) {
                    sub.name = edit.name;
                    sub.otherNames = edit.otherNames;
                    sub.image = edit.image;
                }
            }));
        res.render('submissions/index', { submissions })
    } else {
        const submissions = await Submission.find({ approved: true })
        res.render('submissions/index', { submissions })
    }
}

module.exports.new = (req, res) => {
    res.render('submissions/new');
}

module.exports.show = async (req, res) => {
    const { id } = req.params;

    if (req.isAuthenticated()) {
        const sub = await Submission.findById(id).populate({
            path: 'variations',
            match: {
                $or: [
                    { edited: false },
                    { userId: req.user.id }
                ]
            }
        }).populate('edits');
        console.log(sub);
        sub.edits.forEach(edit => {
            if (edit.userId.toString() === req.user.id) {
                sub.name = edit.name;
                sub.otherNames = edit.otherNames;
                sub.subType = edit.subType;
            }
        })
        res.render('submissions/show', { sub })
    }
    else {
        const sub = await Submission.findById(id).populate({
            path: 'variations',
            match: { approved: true }
        });
        res.render('submissions/show', { sub })
    }
}

module.exports.create = async (req, res) => {
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
        newVariation.userId = req.user.id;
        newVariation.subName = sub.name;
        newVariation.posName = pos.name;
        await newVariation.save();
        sub.variations.push(newVariation);
        pos.submissions.push(newVariation);
        await pos.save();
        await sub.save();
    } else {
        console.log('error adding submission')
    }
    res.redirect(`/positions/${pos.id}`);
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findById(id).populate({
        path: 'variations',
        populate: {
            path: 'position'
        }
    });
    if (!submission) {
        req.flash('error', 'Submission not found!')
        return res.redirect('/submissions')
    }
    res.render('submissions/edit', { submission })
}

// insert an edit to a submission
module.exports.postEdit = async (req, res) => {
    const { id } = req.params;
    const submission = await (Submission.findById(id));
    if (submission) {
        submission.edits.push({ ...req.body.submission, userId: req.user.id })
        await submission.save();
        req.flash('success', 'Posted an edit');
        res.redirect(`/submissions/${submission._id}`)
    }
    else {
        req.flash('error', 'Error finding submission');
        res.redirect(`/submissions/${id}`)
    }
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Submission.findByIdAndDelete(id);
    req.flash('success', 'Sub deleted')
    res.redirect('/submissions');
}

module.exports.admin = async (req, res) => {
    const submissions = await Submission.find({ edited: true })
    res.render('submissions/index', { submissions })
}

module.exports.variations = async (req, res) => {
    const subs = await SubmissionVariation.find({ edited: true })
    res.render('submissions/variations', { subs })
}
module.exports.approveVariations = async (req, res) => {
    const { id } = req.params;
    const result = await SubmissionVariation.findByIdAndUpdate(id, { edited: false })
    if (result) {
        req.flash('success', 'Variation approved');
        res.redirect('/submissions/variations');
    } else {
        req.flash('error', 'Error approving variation');
        res.redirect('/submissions/variations');
    }
}