const User = require('../models/User');
const Journal = require('../models/Journal');
const { journalSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const helpers = require('../middleware')


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
    const redirectUrl = res.locals.returnTo || res.locals.previous || '/';
    res.redirect(redirectUrl)
}

module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'logged out')
        res.redirect(res.locals.returnTo || res.locals.previous || '/');
    });
}

module.exports.journal = async function (req, res) {
    const techniques = await helpers.GetTechniquesForRequest(req);
    const journals = await helpers.GetJournalsForRequest(req);
    const positions = await helpers.GetPositionsForRequest(req);
    res.render('users/journal', { techniques, journals, positions });
}



module.exports.createJournalEntry = async function (req, res) {
    const { journal } = req.body;
    journal.date = new Date();
    console.log(journal)
    const newEntry = new Journal(journal);
    await newEntry.save();
    res.redirect('/users/journal');
}