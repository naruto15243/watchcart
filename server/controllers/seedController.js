const Product = require('../models/Product');
const Store = require('../models/Store');
const ProductPrice = require('../models/ProductPrice');
const Movie = require('../models/Movie');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const {
  sampleProducts,
  sampleStores,
  sampleMovies,
  sampleRestaurants,
  sampleFoodItems,
} = require('../utils/sampleData');

const seedDatabase = async (req, res) => {
  try {
    await Product.deleteMany({});
    await Store.deleteMany({});
    await ProductPrice.deleteMany({});
    await Movie.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});

    const createdProducts = await Product.insertMany(sampleProducts);
    const createdStores = await Store.insertMany(sampleStores);

    for (const product of createdProducts) {
      for (const store of createdStores) {
        const basePrice = product.category === 'Laptops' ? 49999 : product.category === 'Mobiles' ? 39999 : 2499;
        const priceAdjust = store.name === 'Flipkart' ? 1200 : store.name === 'Croma' ? 700 : 0;

        await ProductPrice.create({
          productId: product._id,
          storeId: store._id,
          price: basePrice + priceAdjust,
          deliveryDays: store.name === 'Amazon' ? 2 : store.name === 'Flipkart' ? 3 : 2,
          availability: 'In stock',
          rating: store.rating,
          dealUrl: 'https://example.com/deal',
        });
      }
    }

    const createdMovies = await Movie.insertMany(sampleMovies);
    const createdRestaurants = await Restaurant.insertMany(sampleRestaurants);

    for (const restaurant of createdRestaurants) {
      for (const item of sampleFoodItems) {
        await FoodItem.create({
          restaurantId: restaurant._id,
          ...item,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Database seeded successfully',
      products: createdProducts.length,
      stores: createdStores.length,
      movies: createdMovies.length,
      restaurants: createdRestaurants.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
};

module.exports = { seedDatabase };
