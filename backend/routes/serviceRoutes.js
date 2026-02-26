const express = require('express');
const router = express.Router();
const { getServices, getServiceById, seedServices } = require('../controllers/serviceController');

// @route   GET /api/services
// @desc    Get all services or filter by type (?type=restaurant)
router.get('/', getServices);

// @route   GET /api/services/:id
// @desc    Get single service by ID
router.get('/:id', getServiceById);

// @route   POST /api/services/seed
// @desc    Seed mock services for demo
router.post('/seed', seedServices);

module.exports = router;
