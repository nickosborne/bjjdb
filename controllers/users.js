const User = require('../models/User');
const helpers = require('../middleware')
const Technique = require('../models/Technique');


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

module.exports.favorites = async (req, res, next) => {
    const { technique, favorite } = req.body;
    if (technique && favorite) {
        let foundTechnique = await Technique.findById(technique);
        if (foundTechnique) {
            if (favorite === "true") {
                let user = await User.findByIdAndUpdate(req.user.id, { $push: { favorites: technique } })
            } else {
                let user = await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: technique } })
            }
        }
    }
    res.send("success")
}
