const Movie = require('../models/Movie');

const getSeries = async (req, res) => {
  try {
    const { genre, search } = req.query;
    let query = {};

    if (genre) {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const series = await Movie.find(query);

    return res.status(200).json({
      success: true,
      count: series.length,
      data: series,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch series',
      error: error.message,
    });
  }
};

module.exports = { getSeries };
