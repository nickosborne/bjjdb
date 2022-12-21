const User = require('../models/User');

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
    const redirectUrl = res.locals.returnTo || '/positions';
    res.redirect(redirectUrl)
}

module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'logged out')
        res.redirect('/positions');
    });
}