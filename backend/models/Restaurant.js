const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cuisine: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
