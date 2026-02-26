const VehicleRepair = require('../models/VehicleRepair');
const ServiceProvider = require('../models/ServiceProvider');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a vehicle repair request
// @route   POST /api/vehicle-repair/request
// @access  Private
exports.createRepairRequest = async (req, res) => {
    const { breakdownLocation, vehicleDetails, issueType, issueDescription, urgencyLevel, isEmergency } = req.body;

    try {
        const repairRequest = await VehicleRepair.create({
            userId: req.user._id,
            requestId: `REQ-${Date.now()}`,
            breakdownLocation,
            vehicleDetails,
            issueType,
            issueDescription,
            urgencyLevel,
            isEmergency,
            timeline: [{ status: 'requested', note: 'Repair request submitted' }]
        });

        res.status(201).json(repairRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get nearby repair providers
// @route   GET /api/vehicle-repair/nearby-providers
// @access  Private
exports.getNearbyProviders = async (req, res) => {
    const { lat, lng, radius = 50 } = req.query;

    try {
        const providers = await ServiceProvider.find({
            serviceType: { $in: ['garage', 'mechanic', 'towing', 'mobile_mechanic'] },
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: radius * 1000 // radius in meters
                }
            }
        });

        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get repair request status/details
// @route   GET /api/vehicle-repair/track/:requestId
// @access  Private
exports.trackRequest = async (req, res) => {
    try {
        const repairRequest = await VehicleRepair.findOne({ requestId: req.params.requestId })
            .populate('userId', 'name phone')
            .populate('assignedMechanic.providerId', 'businessName phone');

        if (!repairRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(repairRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
