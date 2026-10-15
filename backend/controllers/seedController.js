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
    for (const product of sampleProducts) {
      await Product.updateOne({ name: product.name }, { $set: product }, { upsert: true });
    }
    for (const store of sampleStores) {
      await Store.updateOne({ name: store.name }, { $set: store }, { upsert: true });
    }

    const createdProducts = await Product.find({ name: { $in: sampleProducts.map((product) => product.name) } });
    const createdStores = await Store.find({ name: { $in: sampleStores.map((store) => store.name) } });

    for (const product of createdProducts) {
      for (const store of createdStores) {
        const priceFactor = store.name === 'Flipkart' ? 0.98 : store.name === 'Croma' ? 1.03 : 1;
        await ProductPrice.updateOne(
          { productId: product._id, storeId: store._id },
          {
            $set: {
              price: Math.round(product.price * priceFactor),
              deliveryDays: store.name === 'Flipkart' ? 3 : 2,
              availability: 'In stock',
              rating: store.rating,
              dealUrl: store.website,
            },
          },
          { upsert: true },
        );
      }
    }

    for (const movie of sampleMovies) {
      await Movie.updateOne({ title: movie.title }, { $set: movie }, { upsert: true });
    }
    for (const restaurant of sampleRestaurants) {
      await Restaurant.updateOne({ name: restaurant.name }, { $set: restaurant }, { upsert: true });
    }
    const createdRestaurants = await Restaurant.find({ name: { $in: sampleRestaurants.map((restaurant) => restaurant.name) } });

    for (const restaurant of createdRestaurants) {
      for (const item of sampleFoodItems) {
        await FoodItem.updateOne(
          { restaurantId: restaurant._id, name: item.name },
          { $set: { ...item, restaurantId: restaurant._id } },
          { upsert: true },
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Database seeded successfully',
      products: createdProducts.length,
      stores: createdStores.length,
      movies: sampleMovies.length,
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
