const Service = require('../models/Service');

// @desc    Calculate route and find services along it
// @route   POST /api/route/plan
// @access  Public
exports.planRoute = async (req, res) => {
    const { origin, destination, preferences } = req.body;

    try {
        // STUB: For now, we'll just return some hardcoded service points
        // In a real implementation, we would use Google Maps Directions API
        // and then search for services within a buffer of the path.

        const services = await Service.find({
            type: { $in: preferences || ['restaurant', 'hotel', 'petrol_pump'] }
        }).limit(10);

        res.json({
            route: {
                origin,
                destination,
                distance: '42 km',
                duration: '1h 15m',
                polyline: 'encoded_polyline_stub'
            },
            servicesAlongRoute: services
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
