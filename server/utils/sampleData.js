const sampleProducts = [
  {
    name: 'Galaxy M55',
    category: 'Mobiles',
    brand: 'Samsung',
    description: 'A powerful smartphone with a vibrant display, long battery life, and excellent camera performance.',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5,
    stock: 20,
  },
  {
    name: 'Acer Aspire 5',
    category: 'Laptops',
    brand: 'Acer',
    description: 'A lightweight laptop built for productivity, study, and everyday multimedia use.',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4,
    stock: 15,
  },
  {
    name: 'Noise Cancelling Headphones',
    category: 'Accessories',
    brand: 'Sony',
    description: 'Premium wireless headphones with immersive sound and all-day comfort.',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6,
    stock: 30,
  },
];

const sampleStores = [
  { name: 'Amazon', location: 'India', website: 'https://amazon.in', rating: 4.5 },
  { name: 'Flipkart', location: 'India', website: 'https://flipkart.com', rating: 4.4 },
  { name: 'Croma', location: 'India', website: 'https://croma.com', rating: 4.3 },
];

const sampleMovies = [
  {
    title: 'Interstellar',
    description: 'A team of explorers travels through a wormhole in space to find a new home for humanity.',
    genre: ['Sci-Fi', 'Drama'],
    rating: 8.7,
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=2LqzF5WauAw',
    releaseDate: '2014',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    streamingInfo: 'Available on multiple legal platforms depending on region.',
  },
  {
    title: 'Avengers: Endgame',
    description: 'The Avengers assemble to reverse the damage caused by Thanos and save the universe.',
    genre: ['Action', 'Adventure'],
    rating: 8.4,
    poster: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    releaseDate: '2019',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    streamingInfo: 'Check legal streaming providers in your region.',
  },
];

const sampleRestaurants = [
  { name: 'CineBite Food Court', cuisine: 'Fast Food', rating: 4.5, address: 'Bengaluru', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Classic Snack House', cuisine: 'Snacks & Drinks', rating: 4.3, address: 'Delhi', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
];

const sampleFoodItems = [
  {
    name: 'Large Popcorn',
    category: 'Popcorn',
    price: 199,
    image: 'https://images.unsplash.com/photo-1585059947758-1d2d1d7a0a2d?auto=format&fit=crop&w=800&q=80',
    description: 'Warm and buttery popcorn for your movie night.',
    rating: 4.7,
  },
  {
    name: 'Cheese Pizza',
    category: 'Pizza',
    price: 299,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Loaded with melted cheese and rich tomato sauce.',
    rating: 4.6,
  },
  {
    name: 'Coke',
    category: 'Drinks',
    price: 79,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f2b0c8b1?auto=format&fit=crop&w=800&q=80',
    description: 'Refreshing cold beverage for a perfect movie break.',
    rating: 4.4,
  },
];

module.exports = {
  sampleProducts,
  sampleStores,
  sampleMovies,
  sampleRestaurants,
  sampleFoodItems,
};
