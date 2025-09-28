const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided!'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user && user.role === 'admin') {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Require Admin Role!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking admin role',
      error: error.message
    });
  }
};

const isOwner = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user && (user.role === 'owner' || user.role === 'admin')) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Require Owner or Admin Role!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking owner role',
      error: error.message
    });
  }
};

const isUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Require User Role!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking user role',
      error: error.message
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isOwner,
  isUser
};

module.exports = authJwt;
