const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/auth');

// Location routes (protected)
router.get('/', authenticateToken, locationController.getAllLocations);
router.post('/', authenticateToken, locationController.createLocation);
router.get('/:id', authenticateToken, locationController.getLocationById);
router.put('/:id', authenticateToken, locationController.updateLocation);
router.delete('/:id', authenticateToken, locationController.deleteLocation);
router.get('/nearby', authenticateToken, locationController.getNearbyLocations);
router.get('/search', authenticateToken, locationController.searchLocations);

module.exports = router;
