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
        // get the user's edits and the ids of their parents
        const userSubmissions = await Submission.find({ userId: req.user.id })
        let ids = [];
        userSubmissions.forEach(sub => ids.push(sub.parent));
        //get all unedited submissions and filter out ones duplicated by the user submissions
        const result = await Submission.find({ edited: false });
        let submissions = result.filter(sub => !ids.includes(sub.id));
        for (sub of userSubmissions) {
            submissions.push(sub);
        }
        res.render('submissions/index', { submissions })
    } else {
        const submissions = await Submission.find({ edited: false })
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
        });
        res.render('submissions/show', { sub })
    }
    else {
        const sub = await Submission.findById(id).populate({
            path: 'variations',
            match: { edited: false }
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

module.exports.update = async (req, res) => {
    const { id } = req.params;
    if (req.user.admin) {
        // if admin, delete edited version, update parent with changes
        req.body.submission.edited = false;
        const submission = await Submission.findById(id);
        const parent = await Submission.findByIdAndUpdate(submission.parent, { ...req.body.submission })
        //update submisison variations to point to parent
        submission.variations.forEach(async (sub) => {
            await SubmissionVariation.findByIdAndUpdate(sub._id, { submission: parent.id, subName: parent.name });
            parent.variations.push(sub);
            await parent.save();
        })
        submission.variations = [];
        submission.delete();
        req.flash('success', 'Approved the changes');
        res.redirect('/submissions')
    } else if (req.body.submission.edited === "false") {
        //if not admin, post new submission in edited status and ref parent
        const newSubmission = new Submission(req.body.submission);
        newSubmission.parent = id
        newSubmission.edited = true;
        newSubmission.userId = req.user.id;
        await newSubmission.save();
        req.flash('success', 'Posted the submission.');
        res.redirect(`/submissions/${newSubmission.id}`)
    } else {
        // if editing a submission that already has an edited status, just add the edit
        const submission = await Submission.findByIdAndUpdate(id, { ...req.body.submission })
        req.flash('success', 'Updated the submission.');
        res.redirect(`/submissions/${submission._id}`)
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