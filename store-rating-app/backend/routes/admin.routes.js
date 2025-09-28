const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { validateStore } = require('../middleware/validation.middleware');
const authJwt = require('../middleware/auth.middleware');

// Apply authentication middleware to all admin routes
router.use(authJwt.verifyToken, authJwt.isAdmin);

// Admin dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.post('/add-user', adminController.addUser);
router.get('/users', adminController.getAllUsers);

// Store management
router.post('/add-store', validateStore, adminController.addStore);
router.get('/stores', adminController.getAllStores);

module.exports = router;
