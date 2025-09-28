const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateRating } = require('../middleware/validation.middleware');
const authJwt = require('../middleware/auth.middleware');

// Apply authentication middleware to all user routes
router.use(authJwt.verifyToken, authJwt.isUser);

// Store listings
router.get('/stores', userController.getAllStores);
router.get('/stores/search', userController.searchStores);

// Ratings
router.post('/ratings', validateRating, userController.submitRating);
router.put('/ratings/:id', validateRating, userController.updateRating);

module.exports = router;
