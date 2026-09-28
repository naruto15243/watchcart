const Product = require('../models/Product');
const Movie = require('../models/Movie');
const FoodItem = require('../models/FoodItem');
const Wishlist = require('../models/Wishlist');

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;

    const productFilters = {};
    const movieFilters = {};

    if (userId) {
      const wishlist = await Wishlist.find({ userId }).lean();

      if (wishlist.length > 0) {
        const likedProductIds = wishlist
          .filter((item) => item.type === 'product')
          .map((item) => item.itemId);

        const likedMovieIds = wishlist
          .filter((item) => item.type === 'movie')
          .map((item) => item.itemId);

        if (likedProductIds.length > 0) {
          const likedProducts = await Product.find({ _id: { $in: likedProductIds } }).lean();
          const preferredCategories = [...new Set(likedProducts.map((item) => item.category).filter(Boolean))];

          if (preferredCategories.length > 0) {
            productFilters.category = { $in: preferredCategories };
          }
        }

        if (likedMovieIds.length > 0) {
          const likedMovies = await Movie.find({ _id: { $in: likedMovieIds } }).lean();
          const preferredGenres = [...new Set(likedMovies.flatMap((movie) => movie.genre || []).filter(Boolean))];

          if (preferredGenres.length > 0) {
            movieFilters.genre = { $in: preferredGenres };
          }
        }
      }
    }

    const products = await Product.find(productFilters)
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .lean();

    const movies = await Movie.find(movieFilters)
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .lean();

    const food = await FoodItem.find({})
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .populate('restaurantId', 'name cuisine')
      .lean();

    return res.status(200).json({
      success: true,
      personalizedFor: userId ? 'user' : 'guest',
      products,
      movies,
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
};
