const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error.message,
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const foods = await FoodItem.find({ restaurantId: restaurant._id });

    return res.status(200).json({
      success: true,
      data: {
        restaurant,
        foods,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant details',
      error: error.message,
    });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create restaurant',
      error: error.message,
    });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
};
