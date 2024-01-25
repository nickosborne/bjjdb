const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { checkReturnTo, forceLogin, isAdmin } = require('../middleware')
const users = require('../controllers/users')
const helpers = require('../middleware')

router.get('/register', users.register)

router.post('/register', catchAsync(users.createAccount));

router.get('/login', users.login)

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.authenticate)

router.get('/logout', checkReturnTo, users.logout);

router.get('/journal', users.journal)
router.post('/journal', forceLogin, helpers.validateJournal, users.createJournalEntry)

module.exports = router;