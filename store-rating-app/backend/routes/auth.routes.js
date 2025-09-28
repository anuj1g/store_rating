const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSignup, validateLogin, validateUpdatePassword } = require('../middleware/validation.middleware');
const authJwt = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.use(authJwt.verifyToken);
router.post('/logout', authController.logout);
router.put('/update-password', validateUpdatePassword, authController.updatePassword);

module.exports = router;
