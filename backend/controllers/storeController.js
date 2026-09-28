const Store = require('../models/Store');

const getStores = async (req, res) => {
  try {
    const stores = await Store.find();

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message,
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error.message,
    });
  }
};

module.exports = {
  getStores,
  getStoreById,
};
