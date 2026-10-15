const Product = require('../models/Product');
const ProductPrice = require('../models/ProductPrice');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const prices = await ProductPrice.find({ productId: { $in: products.map((product) => product._id) } }).sort({ price: 1 });
    const lowestPriceByProduct = new Map();

    for (const price of prices) {
      const productId = String(price.productId);
      if (!lowestPriceByProduct.has(productId)) {
        lowestPriceByProduct.set(productId, price.price);
      }
    }

    const productsWithPrice = products.map((product) => ({
      ...product.toObject(),
      price: lowestPriceByProduct.get(String(product._id)) ?? product.price,
    }));
    res.status(200).json({
      success: true,
      count: products.length,
      data: productsWithPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

const getProductPrices = async (req, res) => {
  try {
    const prices = await ProductPrice.find({ productId: req.params.id }).populate('storeId');

    if (!prices || prices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No price comparison data found for this product',
      });
    }

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product prices',
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductPrices,
};
