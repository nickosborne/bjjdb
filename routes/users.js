const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {checkReturnTo} = require('../middleware')
const users = require('../controllers/users')

router.get('/register', users.register)

router.post('/register', catchAsync(users.createAccount));

router.get('/login', users.login)

router.post('/login', checkReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),users.authenticate)

router.get('/logout', users.logout );

module.exports = router;