const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const techniques = require('../controllers/techniques')
const { forceLogin, isAdmin } = require('../middleware');

router.get('/', catchAsync(techniques.index))
router.get('/admin', forceLogin, isAdmin, catchAsync(techniques.admin));
router.get('/new', forceLogin, techniques.new)
router.post('/', forceLogin, techniques.validateTechnique, catchAsync(techniques.create))
router.get('/:id', catchAsync(techniques.show))
router.put('/:id/edit', forceLogin, isAdmin, techniques.validateTechnique, catchAsync(techniques.edit))
router.delete('/:id', forceLogin, isAdmin, catchAsync(techniques.delete))
module.exports = router;