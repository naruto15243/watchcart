const express = require('express');
const { getStores, getStoreById } = require('../controllers/storeController');

const router = express.Router();

router.get('/', getStores);
router.get('/:id', getStoreById);

module.exports = router;
