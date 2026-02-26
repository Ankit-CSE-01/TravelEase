const Emergency = require('../models/Emergency');
const User = require('../models/User');

// @desc    Trigger SOS alert
// @route   POST /api/emergency/sos
// @access  Private
exports.triggerSOS = async (req, res) => {
    const { location, type } = req.body;

    try {
        const user = await User.findById(req.user._id).select('emergencyContacts');

        const emergency = await Emergency.create({
            userId: req.user._id,
            type: type || 'sos',
            location,
            notifiedContacts: user.emergencyContacts.map(contact => ({
                name: contact.name,
                phone: contact.phone,
                status: 'pending'
            }))
        });

        // In a real app, trigger SMS/Push notifications here (Twilio, Firebase)
        // For now, we'll mark them as 'sent'
        emergency.notifiedContacts = emergency.notifiedContacts.map(c => ({
            ...c,
            status: 'sent'
        }));
        await emergency.save();

        // Broadcast via Socket.io (handled in server.js/socket logic)
        if (global.io) {
            global.io.emit('emergency_alert', {
                id: emergency._id,
                user: req.user.name,
                location: emergency.location,
                type: emergency.type
            });
        }

        res.status(201).json(emergency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resolve an SOS alert
// @route   PUT /api/emergency/resolve/:id
// @access  Private
exports.resolveSOS = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);

        if (!emergency) {
            return res.status(404).json({ message: 'Emergency alert not found' });
        }

        emergency.status = 'resolved';
        emergency.resolvedAt = Date.now();
        emergency.resolutionNote = req.body.note;

        await emergency.save();

        res.json(emergency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept an SOS alert (For Service Providers)
// @route   PUT /api/emergency/accept/:id
// @access  Private
exports.acceptSOS = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);

        if (!emergency) {
            return res.status(404).json({ message: 'Emergency alert not found' });
        }

        if (emergency.status !== 'active') {
            return res.status(400).json({ message: 'Emergency alert is no longer active' });
        }

        emergency.assignedTo = req.user._id;
        emergency.status = 'assigned';
        await emergency.save();

        const mechanic = await User.findById(req.user._id).select('name phone');

        // Broadcast acceptance to everyone (or specifically to the user's room if implemented)
        if (global.io) {
            global.io.emit('emergency_assigned', {
                id: emergency._id,
                mechanic: mechanic.name,
                mechanicPhone: mechanic.phone,
                userId: emergency.userId
            });
        }

        res.json(emergency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
