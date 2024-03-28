const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const techniques = require('../controllers/techniques')
const { forceLogin, isAdmin } = require('../middleware');
const helpers = require('../middleware.js');

router.get('/', catchAsync(techniques.index))
router.get('/admin', forceLogin, isAdmin, catchAsync(techniques.admin));
router.get('/new', forceLogin, techniques.new)
router.post('/', forceLogin, helpers.validateTechnique, catchAsync(techniques.create))
router.get('/:id', catchAsync(techniques.show))
router.put('/:id/edit', forceLogin, isAdmin, helpers.validateTechnique, catchAsync(techniques.edit))
router.delete('/:id', forceLogin, isAdmin, catchAsync(techniques.delete))
module.exports = router;