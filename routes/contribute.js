const express = require('express');
const router = express.Router();
const contribute = require('../controllers/contribute')

router.get('/', contribute.index);

module.exports = router;