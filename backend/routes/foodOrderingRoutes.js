const express = require('express');
const { getFoodItems, createFoodItem } = require('../controllers/foodOrderingController');

const router = express.Router();

router.get('/', getFoodItems);
router.post('/', createFoodItem);

module.exports = router;
