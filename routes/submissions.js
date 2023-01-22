const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const subs = require('../controllers/submissions');
const { forceLogin, isAdmin } = require('../middleware');

router.get('/', catchAsync(subs.index))

router.get('/admin', forceLogin, isAdmin, catchAsync(subs.admin));
router.get('/new', forceLogin, subs.new);

// add a variation
router.get('/addSub/pos/:pos/id/:id', forceLogin, catchAsync(subs.addSub))

router.get('/variations', forceLogin, isAdmin, catchAsync(subs.variations));
router.post('/variations', forceLogin, subs.validateSubmissionVariation, catchAsync(subs.createVariation))
router.put('/variations/:id', forceLogin, isAdmin, catchAsync(subs.approveVariations));

router.get('/:id', catchAsync(subs.show))
router.get('/:id/edit', forceLogin, catchAsync(subs.edit))
router.put('/:id/approve', forceLogin, isAdmin, subs.validateSubmission, catchAsync(subs.approve))
router.post('/:id', forceLogin, subs.validateSubmission, catchAsync(subs.postEdit))

router.delete('/:id', forceLogin, catchAsync(subs.delete))

router.post('/', forceLogin, subs.validateSubmission, catchAsync(subs.create))

module.exports = router;