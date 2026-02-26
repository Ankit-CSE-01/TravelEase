const Service = require('../models/Service');

// @desc    Get services
// @route   GET /api/services
// @access  Public (or semi-private)
exports.getServices = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (type && type !== 'all') {
            query.type = type;
        }

        const services = await Service.find(query);

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found with id of ' + req.params.id
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error(`Error fetching service ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Seed mock services
// @route   POST /api/services/seed
// @access  Public
exports.seedServices = async (req, res) => {
    try {
        await Service.deleteMany({}); // clear existing

        const mockServices = [
            // Restaurants
            {
                name: "Starlight Highway Diner",
                type: "restaurant",
                location: {
                    type: "Point",
                    coordinates: [72.8777, 19.0760] // Mumbai ~ approx
                },
                rating: 4.8,
                priceRange: "$$",
                amenities: ["Vegetarian", "24x7", "Parking"],
                contactPhone: "9876543210",
                images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"],
            },
            {
                name: "The Rustic Plate",
                type: "restaurant",
                location: {
                    type: "Point",
                    coordinates: [73.0, 19.1]
                },
                rating: 4.2,
                priceRange: "$",
                amenities: ["Quick Bite", "Takeaway"],
                contactPhone: "9876543211",
                images: ["https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop"],
            },
            // Hotels
            {
                name: "Cosmic Rest Stop Hotel",
                type: "hotel",
                location: {
                    type: "Point",
                    coordinates: [72.9, 19.2]
                },
                rating: 4.5,
                priceRange: "$$$",
                amenities: ["WiFi", "AC", "Breakfast", "Parking"],
                contactPhone: "8876543212",
                images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"],
            },
            {
                name: "Highway Inn",
                type: "hotel",
                location: {
                    type: "Point",
                    coordinates: [73.1, 19.15]
                },
                rating: 3.9,
                priceRange: "$",
                amenities: ["AC", "Parking"],
                contactPhone: "8876543213",
                images: ["https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=800&auto=format&fit=crop"],
            },
            // Petrol Pumps
            {
                name: "Nova Fuel Station",
                type: "petrol_pump",
                location: {
                    type: "Point",
                    coordinates: [72.85, 19.05]
                },
                rating: 4.2,
                priceRange: "$",
                amenities: ["Petrol", "Diesel", "EV Charging", "Air"],
                contactPhone: "7876543214",
                images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop"],
            },
            {
                name: "Express Fuels",
                type: "petrol_pump",
                location: {
                    type: "Point",
                    coordinates: [73.05, 19.25]
                },
                rating: 4.0,
                priceRange: "$",
                amenities: ["Petrol", "Diesel", "Air"],
                contactPhone: "7876543215",
                images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop"],
            },
            // Markets
            {
                name: "Valley Square Market",
                type: "market",
                location: {
                    type: "Point",
                    coordinates: [72.95, 19.1]
                },
                rating: 4.4,
                priceRange: "$",
                amenities: ["Groceries", "Pharmacy", "ATM"],
                contactPhone: "6876543216",
                images: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop"],
            }
        ];

        const createdServices = await Service.insertMany(mockServices);

        res.status(201).json({
            success: true,
            message: 'Database heavily seeded with mock Services along routes!',
            count: createdServices.length,
            data: createdServices
        });

    } catch (error) {
        console.error("Error seeding services:", error);
        res.status(500).json({ success: false, message: 'Server Error during seeding' });
    }
};
