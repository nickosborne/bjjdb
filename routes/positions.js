const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { forceLogin } = require('../middleware');
const positions = require('../controllers/positions')

// Position routes
router.get('/', catchAsync(positions.index));

router.get('/new', forceLogin, positions.new);

router.post('/', forceLogin, positions.validatePosition, catchAsync(positions.createPosition))

router.get('/:id', catchAsync(positions.show))

router.get('/:id/edit', forceLogin, catchAsync(positions.edit))

router.get('/:id/addSub', forceLogin, catchAsync(positions.addSub))

router.put('/:id', forceLogin, positions.validatePosition, catchAsync(positions.update))

router.delete('/:id', forceLogin, catchAsync(positions.delete))

module.exports = router;