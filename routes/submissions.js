const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); 
const subs = require('../controllers/submissions');

router.get('/', catchAsync(subs.index))

router.get('/new', subs.new);

router.get('/:id', catchAsync(subs.edit))

router.post('/', subs.validateSubmission, catchAsync(subs.update))

router.post('/variations', subs.validateSubmissionVariation, catchAsync(subs.createVariation))

module.exports = router;