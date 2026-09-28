const Product = require('../models/Product');
const ProductPrice = require('../models/ProductPrice');

const getProductComparison = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const priceEntries = await ProductPrice.find({ productId: product._id }).populate('storeId');

    if (!priceEntries || priceEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No comparison data found for this product',
      });
    }

    const prices = priceEntries.map((entry) => entry.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = prices.reduce((sum, value) => sum + value, 0) / prices.length;

    const comparison = {
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        rating: product.rating,
      },
      totalStores: priceEntries.length,
      lowestPrice,
      highestPrice,
      averagePrice,
      priceDifference: highestPrice - lowestPrice,
      stores: priceEntries.map((entry) => ({
        store: entry.storeId.name,
        price: entry.price,
        delivery: `${entry.deliveryDays} days`,
        rating: entry.rating,
        availability: entry.availability,
        dealUrl: entry.dealUrl,
      })),
    };

    return res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compare product prices',
      error: error.message,
    });
  }
};

module.exports = {
  getProductComparison,
};
