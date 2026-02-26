const express = require('express');
const router = express.Router();
const {
    createRepairRequest,
    getNearbyProviders,
    trackRequest
} = require('../controllers/vehicleRepairController');
const { protect } = require('../middleware/auth');

router.post('/request', protect, createRepairRequest);
router.get('/nearby-providers', protect, getNearbyProviders);
router.get('/track/:requestId', protect, trackRequest);

module.exports = router;
