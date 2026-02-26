const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: [true, 'Please add a business name']
    },
    ownerName: {
        type: String,
        required: [true, 'Please add owner name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    serviceType: {
        type: [String],
        enum: ['garage', 'mechanic', 'towing', 'mobile_mechanic', 'restaurant', 'hotel', 'petrol_pump', 'market'],
        required: true
    },
    specialization: [String],
    vehicleTypes: [String],
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
        address: String,
        city: String,
        state: String
    },
    serviceRadius: {
        type: Number,
        default: 10 // in km
    },
    is24x7: {
        type: Boolean,
        default: false
    },
    emergencyServices: {
        type: Boolean,
        default: false
    },
    mobileUnits: [{
        vehicleNumber: String,
        equipment: [String],
        currentLocation: {
            coordinates: [Number],
            lastUpdated: { type: Date, default: Date.now }
        },
        isAvailable: { type: Boolean, default: true }
    }],
    pricing: {
        inspectionFee: Number,
        minimumCharge: Number,
        perKmCharge: Number,
        hourlyRate: Number,
        towingRate: Number
    },
    documents: [{
        type: { type: String },
        url: String,
        verified: { type: Boolean, default: false }
    }],
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    metrics: {
        totalJobs: { type: Number, default: 0 },
        completedJobs: { type: Number, default: 0 },
        averageResponseTime: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 }
    },
    availability: [{
        day: String,
        open: String,
        close: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for geospatial queries
ServiceProviderSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);
