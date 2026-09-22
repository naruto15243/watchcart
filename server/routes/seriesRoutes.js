const express = require('express');
const { getSeries } = require('../controllers/seriesController');

const router = express.Router();

router.get('/', getSeries);

module.exports = router;
