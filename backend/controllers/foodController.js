const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error.message,
    });
  }
};

const getFoodItems = async (req, res) => {
  try {
    const foods = await FoodItem.find();
    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food items',
      error: error.message,
    });
  }
};

module.exports = {
  getRestaurants,
  getFoodItems,
};
