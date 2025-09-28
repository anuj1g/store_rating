const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const { validateStore } = require('../middleware/validation.middleware');
const authJwt = require('../middleware/auth.middleware');

// Apply authentication and owner role middleware to all routes
router.use(authJwt.verifyToken, authJwt.isOwner);

// Store owner dashboard
router.get('/my-store', ownerController.getMyStore);
router.put('/my-store', validateStore, ownerController.updateStore);
router.get('/my-store/statistics', ownerController.getRatingStatistics);

module.exports = router;
