const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn } = require('../middleware');
const positions = require('../controllers/positions')

// Position routes
router.get('/', catchAsync(positions.index));

router.get('/new', isLoggedIn, positions.new );

router.post('/', isLoggedIn, positions.validatePosition, catchAsync(positions.createPosition))

router.get('/:id', catchAsync(positions.show))

router.get('/:id/edit', catchAsync(positions.edit))

router.put('/:id', positions.validatePosition, catchAsync(positions.update))

router.delete('/:id', catchAsync(positions.delete))

module.exports = router;