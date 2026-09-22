const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id });
    return res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { type, itemId } = req.body;

    if (!type || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Type and itemId are required',
      });
    }

    const existing = await Wishlist.findOne({ userId: req.user._id, type, itemId });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Item already in wishlist',
        data: existing,
      });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user._id,
      type,
      itemId,
    });

    return res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlistItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message,
    });
  }
};

const removeWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Wishlist.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Wishlist item removed',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove wishlist item',
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
};
