const express = require('express');
const { getRestaurants, getFoodItems } = require('../controllers/foodController');

const router = express.Router();

router.get('/restaurants', getRestaurants);
router.get('/', getFoodItems);

module.exports = router;
