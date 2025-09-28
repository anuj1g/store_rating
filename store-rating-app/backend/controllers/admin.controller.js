const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Add a new user (admin only)
const addUser = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use!'
      });
    }

    // Create user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      role: req.body.role || 'user'
    });

    // Return user data (without password)
    const { password, ...userData } = user.get({ plain: true });
    
    res.status(201).json({
      success: true,
      message: 'User added successfully!',
      data: userData
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding user',
      error: error.message
    });
  }
};

// Add a new store (admin only)
const addStore = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if owner exists
    const owner = await User.findByPk(req.body.owner_id);
    if (!owner || owner.role !== 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Invalid owner ID or owner role not assigned!'
      });
    }

    // Check if store email already exists
    const existingStore = await Store.findOne({ where: { email: req.body.email } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'Store with this email already exists!'
      });
    }

    // Create store
    const store = await Store.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      owner_id: req.body.owner_id,
      avg_rating: 0
    });

    res.status(201).json({
      success: true,
      message: 'Store added successfully!',
      data: store
    });
  } catch (error) {
    console.error('Add store error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding store',
      error: error.message
    });
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get all users with pagination, filtering, and sorting
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get users with pagination and sorting
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
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
        users
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all stores with pagination, filtering, and sorting
const getAllStores = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
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
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get stores with pagination, sorting, and owner info
    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
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

module.exports = {
  addUser,
  addStore,
  getDashboardStats,
  getAllUsers,
  getAllStores
};
