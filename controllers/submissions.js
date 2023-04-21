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
    const positions = await Position.find({ approved: true })
    if (req.isAuthenticated()) {
        const sub = await Submission.findById(id).populate({
            path: 'variations',
            match: {
                $or: [
                    { approved: true },
                    { userId: req.user.id }
                ]
            }
        }).populate('edits');

        sub.edits.forEach(edit => {
            if (edit.userId.toString() === req.user.id) {
                sub.name = edit.name;
                sub.otherNames = edit.otherNames;
                sub.subType = edit.subType;
            }
        })
        res.render('submissions/show', { sub, positions })
    }
    else {
        const sub = await Submission.findById(id).populate({
            path: 'variations',
            match: { approved: true }
        });
        res.render('submissions/show', { sub, positions })
    }
}

module.exports.create = async (req, res) => {
    const sub = new Submission(req.body.submission);
    sub.userId = req.user.id;
    sub.approved = false;
    await sub.save();
    req.flash('success', 'Created the position!');
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
        await sub.save();
        req.flash('success', 'Variation Added')
    } else {
        req.flash('error', 'Error adding variation')
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

// delete a submission or an edit
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;

    // delete edit
    if (userId) {
        await Submission.findByIdAndUpdate(id, {
            $pull: {
                edits: {
                    userId: { $eq: userId }
                }
            }
        });
        req.flash('success', 'Edit removed')
        res.redirect('/submissions/admin');
    }
    // delete position
    else {
        await Submission.findByIdAndDelete(id);
        req.flash('success', 'Submission deleted.')
        res.redirect('/submissions');
    }
}

module.exports.deleteVariation = async (req, res) => {
    const { id } = req.params;
    const variation = await SubmissionVariation.findByIdAndDelete(id);
    await Submission.findByIdAndUpdate(variation.submission, {
        $pull: {
            variations: {
                id: { $eq: id }
            }
        }
    })
    req.flash('success', 'Deleted variation')
    res.redirect('/submissions/admin');
}

module.exports.admin = async (req, res) => {
    const result = await Submission.find();
    const variations = await SubmissionVariation.find({ approved: false })
    let submissions = result.filter(sub => !sub.approved)
    let edits = result.filter(sub => sub.edits.length)
    res.render('submissions/admin', { submissions, edits, variations })
}

module.exports.approveVariations = async (req, res) => {
    const { id } = req.params;
    const result = await SubmissionVariation.findByIdAndUpdate(id, {
        approved: true,
        video: req.body.variation.video
    })
    if (result) {
        req.flash('success', 'Variation approved');
        res.redirect('/submissions/admin');
    } else {
        req.flash('error', 'Error approving variation');
        res.redirect('/submissions/admin');
    }
}

// approve submissions and edits
module.exports.approve = async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(id, {
        ...req.body.submission,
        approved: true,
        $pull: {
            edits: {
                userId: { $eq: req.body.submission.userId }
            }
        }
    });

    if (submission) {
        req.flash('success', 'approved')
    } else {
        req.flash('error', 'error')
    }
    res.redirect('/submissions/admin')
}
