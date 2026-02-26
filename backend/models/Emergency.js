const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['sos', 'accident', 'medical', 'breakdown'],
        default: 'sos'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    status: {
        type: String,
        enum: ['active', 'assigned', 'resolved', 'cancelled'],
        default: 'active'
    },
    notifiedContacts: [{
        name: String,
        phone: String,
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending'
        }
    }],
    media: [{
        type: { type: String, enum: ['audio', 'video', 'photo'] },
        url: String
    }],
    resolvedAt: Date,
    resolutionNote: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

EmergencySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Emergency', EmergencySchema);
