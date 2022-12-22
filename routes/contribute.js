const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const contribute = require('../controllers/contribute')

router.get('/', contribute.index);

module.exports = router;