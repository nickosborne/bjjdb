const User = require('../models/User');
const Journal = require('../models/Journal');
const Technique = require('../models/Technique.js');
const { journalSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

// middleware
module.exports.validateJournal = (req, res, next) => {
    const { error } = journalSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.createAccount = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to BJJ_DB');
            res.redirect('/positions')
        })
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('register')
    }
}

module.exports.login = (req, res) => {
    res.render('users/login')
}

module.exports.authenticate = (req, res) => {
    req.flash('success', 'logged in!');
    const redirectUrl = res.locals.returnTo || res.locals.previous || '/positions';
    res.redirect(redirectUrl)
}

module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'logged out')
        res.redirect('/positions');
    });
}

module.exports.journal = async function (req, res) {
    if (req.isAuthenticated()) {
        const journals = await Journal.find({
            $or: [{ public: true }, { userId: req.user.id }]
        })
        const techniques = await Technique.find({
            $or: [{ public: true }, { userId: req.user.id }]
        })
        res.render('users/journal', { techniques, journals });
    }
    else {
        const techniques = await Technique.find({ public: true });
        const journals = [];
        res.render('users/journal', { techniques, journals });
    }

}

module.exports.createJournalEntry = async function (req, res) {
    let { journal } = req.body;
    const newEntry = new Journal(journal);
    await newEntry.save();
    res.redirect('/users/journal');
}