const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a service name']
    },
    type: {
        type: String,
        enum: ['restaurant', 'hotel', 'petrol_pump', 'market'],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    rating: {
        type: Number,
        default: 0
    },
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$']
    },
    amenities: [String],
    operatingHours: {
        open: String,
        close: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    contactPhone: String,
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ServiceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Service', ServiceSchema);
