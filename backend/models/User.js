const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    profileImage: String,
    userType: {
        type: String,
        enum: ['traveler', 'provider', 'admin'],
        default: 'traveler'
    },
    vehicleDetails: [{
        type: { type: String },
        brand: String,
        model: String,
        registrationNumber: String,
        fuelType: String
    }],
    emergencyContacts: [{
        name: String,
        relation: String,
        phone: String
    }],
    savedPlaces: [{
        name: String,
        location: {
            lat: Number,
            lng: Number
        },
        address: String
    }],
    preferences: {
        cuisine: [String],
        hotelAmenities: [String],
        language: {
            type: String,
            default: 'English'
        }
    },
    verificationLevel: {
        type: String,
        enum: ['none', 'basic', 'standard', 'premium'],
        default: 'none'
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
