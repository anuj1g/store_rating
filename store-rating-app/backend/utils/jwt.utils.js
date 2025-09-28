const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token
 * @param {Object} payload - The payload to sign
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d')
 * @returns {string} - The generated JWT token
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} - The decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} - The extracted token or null if not found
 */
const getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return req.headers['x-access-token'] || null;
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromHeader
};
