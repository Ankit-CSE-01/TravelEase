const mongoose = require('mongoose');

const VehicleRepairSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    breakdownLocation: {
        coordinates: {
            type: [Number],
            required: true
        },
        address: String,
        landmark: String
    },
    vehicleDetails: {
        type: { type: String },
        brand: String,
        model: String,
        registrationNumber: String
    },
    issueType: {
        type: String,
        required: true
    },
    issueDescription: String,
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },
    photos: [String],
    assignedMechanic: {
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
        name: String,
        phone: String,
        eta: Number,
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: [Number],
            lastUpdated: Date
        }
    },
    status: {
        type: String,
        enum: ['requested', 'searching', 'assigned', 'on_way', 'arrived', 'repairing', 'completed', 'cancelled'],
        default: 'requested'
    },
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    repairDetails: {
        diagnosis: String,
        partsReplaced: [{
            name: String,
            cost: Number
        }],
        laborCharges: Number,
        totalAmount: Number,
        completedAt: Date
    },
    payment: {
        method: String,
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        amount: Number,
        transactionId: String
    },
    rating: {
        score: Number,
        review: String,
        responseTime: Number,
        serviceQuality: Number
    },
    isEmergency: {
        type: Boolean,
        default: false
    },
    sosActivated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

VehicleRepairSchema.index({ 'breakdownLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('VehicleRepair', VehicleRepairSchema);
