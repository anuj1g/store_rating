const { Store, Rating, User } = require('../models');

// Get store details and ratings for the owner
const getMyStore = async (req, res) => {
  try {
    // Find the store owned by the current user
    const store = await Store.findOne({
      where: { owner_id: req.userId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'No store found for this owner!'
      });
    }

    // Calculate additional statistics
    const totalRatings = store.ratings.length;
    const ratingDistribution = [0, 0, 0, 0, 0]; // For 1-5 stars
    
    store.ratings.forEach(rating => {
      if (rating.rating_value >= 1 && rating.rating_value <= 5) {
        ratingDistribution[rating.rating_value - 1]++;
      }
    });

    // Calculate average rating (can be done directly from store.avg_rating as well)
    const avgRating = store.ratings.reduce((sum, rating) => sum + rating.rating_value, 0) / totalRatings || 0;

    // Prepare response
    const response = {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avg_rating: parseFloat(avgRating.toFixed(1)), // Ensure consistent decimal places
        total_ratings: totalRatings,
        rating_distribution: ratingDistribution,
        created_at: store.createdAt,
        updated_at: store.updatedAt
      },
      ratings: store.ratings.map(rating => ({
        id: rating.id,
        rating_value: rating.rating_value,
        comment: rating.comment || null,
        user: rating.user,
        created_at: rating.createdAt,
        updated_at: rating.updatedAt
      }))
    };

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get my store error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching store details',
      error: error.message
    });
  }
};

// Update store information
const updateStore = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, address } = req.body;
    
    // Find and update the store
    const [updated] = await Store.update(
      { name, email, address },
      { 
        where: { owner_id: req.userId },
        returning: true,
        plain: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'No store found for this owner!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Store updated successfully!',
      data: updated
    });
  } catch (error) {
    console.error('Update store error:', error);
    
    // Handle duplicate email error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use by another store!'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating store',
      error: error.message
    });
  }
};

// Get rating statistics for the owner's store
const getRatingStatistics = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.userId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: []
        }
      ],
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'total_ratings'],
        [sequelize.fn('AVG', sequelize.col('ratings.rating_value')), 'average_rating'],
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM ratings 
            WHERE ratings.store_id = Store.id 
            AND ratings.rating_value = 1
          )`),
          'one_star'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM ratings 
            WHERE ratings.store_id = Store.id 
            AND ratings.rating_value = 2
          )`),
          'two_stars'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM ratings 
            WHERE ratings.store_id = Store.id 
            AND ratings.rating_value = 3
          )`),
          'three_stars'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM ratings 
            WHERE ratings.store_id = Store.id 
            AND ratings.rating_value = 4
          )`),
          'four_stars'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM ratings 
            WHERE ratings.store_id = Store.id 
            AND ratings.rating_value = 5
          )`),
          'five_stars'
        ]
      ],
      group: ['Store.id']
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'No store found for this owner!'
      });
    }

    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Get rating statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rating statistics',
      error: error.message
    });
  }
};

module.exports = {
  getMyStore,
  updateStore,
  getRatingStatistics
};
