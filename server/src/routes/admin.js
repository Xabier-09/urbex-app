const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');

// Admin authentication routes
router.post('/login', adminController.login);

// Admin user management routes
router.get('/users', authenticateToken, adminController.getUsers);
router.post('/users', authenticateToken, adminController.createUser);
router.put('/users/:id', authenticateToken, adminController.updateUser);
router.delete('/users/:id', authenticateToken, adminController.deleteUser);

// Admin location management routes
router.get('/locations', authenticateToken, adminController.getLocations);
router.post('/locations', authenticateToken, adminController.createLocation);
router.post('/locations/:id/images', authenticateToken, adminController.uploadLocationImage);

module.exports = router;
