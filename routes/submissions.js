const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const subs = require('../controllers/submissions');
const { forceLogin, isAdmin } = require('../middleware');

router.get('/', catchAsync(subs.index))

router.get('/admin', forceLogin, isAdmin, catchAsync(subs.admin));

router.get('/variations', forceLogin, isAdmin, catchAsync(subs.variations));
router.post('/variations', forceLogin, subs.validateSubmissionVariation, catchAsync(subs.createVariation))
router.put('/variations/:id', forceLogin, isAdmin, catchAsync(subs.approveVariations));

router.get('/new', forceLogin, subs.new);

router.get('/:id', catchAsync(subs.show))

router.put('/:id', forceLogin, subs.validateSubmission, catchAsync(subs.postEdit))

router.get('/:id/edit', forceLogin, catchAsync(subs.edit))

router.post('/', forceLogin, subs.validateSubmission, catchAsync(subs.create))

router.delete('/:id', forceLogin, catchAsync(subs.delete))

module.exports = router;