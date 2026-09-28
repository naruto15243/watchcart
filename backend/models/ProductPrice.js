const mongoose = require('mongoose');

const productPriceSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deliveryDays: {
    type: Number,
    default: 2,
  },
  availability: {
    type: String,
    default: 'In stock',
  },
  rating: {
    type: Number,
    default: 0,
  },
  dealUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProductPrice', productPriceSchema);
