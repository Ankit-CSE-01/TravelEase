const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
    const { amount, bookingId } = req.body;

    try {
        const orderId = `ORDER_${Date.now()}`;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe requires amounts in smallest currency unit (paise/cents)
            currency: 'inr',
            description: `TravelEase Booking ${orderId}`,
            metadata: { bookingId: bookingId || 'none', orderId },
        });

        res.json({
            success: true,
            orderId,
            clientSecret: paymentIntent.client_secret,
            amount: amount,
            currency: 'INR'
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    const { paymentId, orderId, bookingId, status } = req.body;

    try {
        if (status === 'success') {
            const booking = await Booking.findById(bookingId);
            if (booking) {
                booking.paymentStatus = 'paid';
                booking.transactionId = paymentId;
                booking.status = 'confirmed';
                await booking.save();
            }
            res.json({ success: true, message: 'Payment verified and booking confirmed' });
        } else {
            res.status(400).json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
