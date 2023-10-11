const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const techniques = require('../controllers/techniques')
const { forceLogin, isAdmin } = require('../middleware');

router.get('/', catchAsync(techniques.index))
router.get('/new', forceLogin, techniques.new)

router.get('/:id', catchAsync(techniques.show))


module.exports = router;