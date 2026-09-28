const express = require('express');
const { getProductComparison } = require('../controllers/comparisonController');

const router = express.Router();

router.get('/:id', getProductComparison);

module.exports = router;
