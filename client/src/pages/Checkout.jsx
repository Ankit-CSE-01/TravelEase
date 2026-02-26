import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, ShieldCheck, Calendar, MapPin, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';

// Initialize Stripe with a test publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const StripeCheckoutForm = ({ totalAmount, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Fetch the PaymentIntent client secret from the backend
        const fetchClientSecret = async () => {
            try {
                const response = await api.post('/payments/create-order', {
                    amount: totalAmount,
                    bookingId: bookingId
                });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.error('Failed to initialize payment:', error);
                toast.error('Failed to connect to payment gateway.');
            }
        };
        fetchClientSecret();
    }, [totalAmount, bookingId]);

    const handlePayment = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'card') {
            if (!stripe || !elements || !clientSecret) {
                return;
            }

            setIsProcessing(true);

            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'TravelEase User', // In real app, pass actual user details
                    },
                }
            });

            if (error) {
                setIsProcessing(false);
                toast.error(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                try {
                    await api.post('/payments/verify', {
                        paymentId: paymentIntent.id,
                        orderId: paymentIntent.id,
                        bookingId: bookingId,
                        status: 'success'
                    });
                    setIsProcessing(false);
                    toast.success('Payment Successful! Booking Confirmed.');
                    navigate('/dashboard');
                } catch (verifyError) {
                    setIsProcessing(false);
                    toast.error('Payment verification failed.');
                }
            }
        } else {
            // Mock UPI Path
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                toast.success('UPI Payment Successful! Booking Confirmed.');
                navigate('/dashboard');
            }, 2500);
        }
    };

    return (
        <form onSubmit={handlePayment} className="space-y-6">
            {/* Payment Options */}
            <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-500'}`}>
                    <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-gray-900 dark:text-white">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                    <CheckCircle className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-blue-500' : 'text-transparent'}`} />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-500'}`}>
                    <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-blue-600" />
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <span className="font-bold text-gray-900 dark:text-white">Credit / Debit Card</span>
                        </div>
                    </div>
                    <CheckCircle className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-blue-500' : 'text-transparent'}`} />
                </label>
            </div>

            {/* Card Details Integration */}
            {paymentMethod === 'card' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                },
                                invalid: { color: '#9e2146' },
                            },
                        }} />
                    </div>
                </motion.div>
            )}

            <button
                type="submit"
                disabled={isProcessing || (paymentMethod === 'card' && (!stripe || !clientSecret))}
                className="w-full block text-center font-bold py-4 px-4 rounded-xl transition-all shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                    </span>
                ) : (
                    <span>Pay ₹{totalAmount} Securely</span>
                )}
                <div className="absolute inset-0 h-full w-full border-2 border-white/20 rounded-xl group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all"></div>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-bit SSL Encryption
            </div>
        </form>
    );
};

const Checkout = () => {
    const { id } = useParams();

    // Mock data for the checkout summary
    const orderDetails = {
        serviceName: "Cosmic Rest Stop Hotel",
        item: "Stellar Suite",
        date: new Date().toLocaleDateString(),
        price: 4500,
        taxes: 810, // 18% GST
        total: 5310,
        location: "Sector 7G, Milky Way Highway"
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans">
            <Link to={`/services/${id}`} className="inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 font-semibold mb-6 transition-colors group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Details
            </Link>

            <div className="text-center mb-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold text-gray-900 dark:text-white font-space mb-2"
                >
                    Complete Your Booking
                </motion.h1>
                <p className="text-gray-600 dark:text-gray-400">Secure payment powered by encrypted gateways.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl h-fit"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{orderDetails.serviceName}</h3>
                            <p className="text-sm text-blue-600 dark:text-cyan-400 font-semibold">{orderDetails.item}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {orderDetails.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {orderDetails.date}
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-200 dark:border-gray-800 pt-4 mb-6">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Base Amount</span>
                            <span className="font-medium text-gray-900 dark:text-white">₹{orderDetails.price}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Taxes & Fees (18%)</span>
                            <span className="font-medium text-gray-900 dark:text-white">₹{orderDetails.taxes}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-cyan-400">₹{orderDetails.total}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 p-3 rounded-lg">
                        <ShieldCheck className="w-4 h-4" />
                        <span>TravelEase Booking Guarantee active. Free cancellation up to 24 hours before.</span>
                    </div>
                </motion.div>

                {/* Payment Form Wrapper */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Payment Method</h2>

                    <Elements stripe={stripePromise}>
                        <StripeCheckoutForm totalAmount={orderDetails.total} bookingId={id || `BK_${Date.now()}`} />
                    </Elements>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;
