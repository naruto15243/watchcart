const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

const getFoodItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await FoodItem.find(query).populate('restaurantId');

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food items',
      error: error.message,
    });
  }
};

const createFoodItem = async (req, res) => {
  try {
    const { restaurantId, name, category, price, image, description, rating } = req.body;

    if (!restaurantId || !name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'RestaurantId, name, category and price are required',
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const food = await FoodItem.create({
      restaurantId,
      name,
      category,
      price,
      image: image || '',
      description: description || '',
      rating: rating || 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create food item',
      error: error.message,
    });
  }
};

module.exports = {
  getFoodItems,
  createFoodItem,
};
