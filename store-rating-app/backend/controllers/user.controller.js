const { Store, Rating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all stores with search and pagination
const getAllStores = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'avg_rating', 
      sortOrder = 'DESC', 
      search = '',
      minRating = 0,
      maxRating = 5
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause for search and rating filter
    const whereClause = {
      avg_rating: {
        [Op.between]: [parseFloat(minRating), parseFloat(maxRating)]
      }
    };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get stores with pagination and sorting
    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      attributes: [
        'id',
        'name',
        'email',
        'address',
        'avg_rating',
        'createdAt',
        [
          sequelize.literal(`(
            SELECT rating_value 
            FROM ratings 
            WHERE ratings.store_id = Store.id 
            AND ratings.user_id = ${req.userId}
            LIMIT 1
          )`),
          'user_rating'
        ]
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        stores
      }
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stores',
      error: error.message
    });
  }
};

// Search stores by name or address
const searchStores = async (req, res) => {
  try {
    const { name = '', address = '' } = req.query;
    
    if (!name && !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one search parameter (name or address)'
      });
    }

    const whereClause = {};
    
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'address', 'avg_rating'],
      limit: 50
    });

    res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Search stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching stores',
      error: error.message
    });
  }
};

// Submit or update a rating for a store
const submitRating = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { store_id, rating_value } = req.body;
    const user_id = req.userId;

    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found!'
      });
    }

    // Check if user already rated this store
    const [rating, created] = await Rating.findOrCreate({
      where: { user_id, store_id },
      defaults: { rating_value }
    });

    // If not created, update existing rating
    if (!created) {
      rating.rating_value = rating_value;
      await rating.save();
    }

    // Get updated store with new average rating
    const updatedStore = await Store.findByPk(store_id, {
      attributes: ['id', 'name', 'avg_rating']
    });

    res.status(200).json({
      success: true,
      message: created ? 'Rating submitted successfully!' : 'Rating updated successfully!',
      data: {
        store: updatedStore,
        rating: {
          id: rating.id,
          rating_value: rating.rating_value,
          created_at: rating.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
};

// Update a rating
const updateRating = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { rating_value } = req.body;
    const user_id = req.userId;

    // Find the rating
    const rating = await Rating.findOne({
      where: { id, user_id },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found or you are not authorized to update it!'
      });
    }

    // Update the rating
    rating.rating_value = rating_value;
    await rating.save();

    // Get updated store with new average rating
    const updatedStore = await Store.findByPk(rating.store_id, {
      attributes: ['id', 'name', 'avg_rating']
    });

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully!',
      data: {
        store: updatedStore,
        rating: {
          id: rating.id,
          rating_value: rating.rating_value,
          created_at: rating.createdAt,
          updated_at: rating.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating rating',
      error: error.message
    });
  }
};

module.exports = {
  getAllStores,
  searchStores,
  submitRating,
  updateRating
};
