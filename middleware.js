module.exports.forceLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must me signed in');
        return res.redirect('/users/login')
    }
    next()
}

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    if (req.session.previous) {
        res.locals.previous = req.session.previous;
    }
    next()
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    }
    else {
        req.flash('error', 'Permission denied.')
        res.redirect('/positions')
    }
}