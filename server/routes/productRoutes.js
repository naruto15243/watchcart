const express = require('express');
const { getProducts, getProductById, getProductPrices } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/prices', getProductPrices);

module.exports = router;
