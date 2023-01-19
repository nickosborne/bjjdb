const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { forceLogin, isAdmin } = require('../middleware');
const positions = require('../controllers/positions')

// Position routes
router.get('/', catchAsync(positions.index));

router.get('/admin', forceLogin, isAdmin, catchAsync(positions.admin));

router.get('/new', forceLogin, positions.new);

router.get('/addSub/pos/:pos/id/:id', forceLogin, catchAsync(positions.addSub))

router.post('/', forceLogin, positions.validatePosition, catchAsync(positions.createPosition))

router.get('/:id', catchAsync(positions.show))

router.get('/:id/edit', forceLogin, catchAsync(positions.edit))

router.put('/:id/approve', forceLogin, isAdmin, positions.validatePosition, catchAsync(positions.approve))

router.put('/:id', forceLogin, positions.validateEdit, catchAsync(positions.update))

router.delete('/:id', forceLogin, catchAsync(positions.delete))

module.exports = router;