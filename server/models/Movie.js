const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: [{
    type: String,
    trim: true,
  }],
  rating: {
    type: Number,
    default: 0,
  },
  poster: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  releaseDate: {
    type: String,
    default: '',
  },
  cast: [{
    type: String,
  }],
  streamingInfo: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
