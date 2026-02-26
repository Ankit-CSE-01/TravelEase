import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, Clock, CreditCard, ChevronLeft, Calendar as CalendarIcon, Check, Loader2 } from 'lucide-react';
import api from '../services/api';

const ServiceDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/services/${id}`);
                setService(response.data.data);
            } catch (error) {
                console.error("Error fetching service details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchServiceDetails();
        }
    }, [id]);

    if (loading || !service) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    // Generate mock options for the generic checkout flow based on service type
    const getOptions = () => {
        if (service.type === 'hotel') {
            return [
                { id: 101, name: "Premium Suite", price: 4500, type: "Suite", available: true },
                { id: 102, name: "Standard Room", price: 2500, type: "Standard", available: true }
            ];
        }
        if (service.type === 'restaurant') {
            return [
                { id: 201, name: "Table for 2 (Dinner)", price: 1500, type: "Reservation", available: true },
                { id: 202, name: "Family Booth", price: 3000, type: "Reservation", available: true }
            ];
        }
        if (service.type === 'market') {
            return [
                { id: 301, name: "Survival Gear Kit", price: 2000, type: "Package", available: true },
                { id: 302, name: "Basic Groceries", price: 800, type: "Package", available: true }
            ];
        }
        return [
            { id: 401, name: "Standard Service", price: 1000, type: "Booking", available: true },
            { id: 402, name: "Premium Service", price: 2500, type: "Booking", available: true }
        ];
    };

    const options = getOptions();

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">

            <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 font-semibold mb-6 transition-colors group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Services
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 shadow-sm font-space">
                                        {service.name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-gray-200 text-sm">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-blue-400" />
                                            {service.location?.address || 'Location Access Required'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 text-center">
                                    <div className="flex items-center gap-1 text-white font-bold text-lg">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        {service.rating || 'New'}
                                    </div>
                                    <div className="text-xs text-blue-200">({Math.floor(Math.random() * 50) + 12} reviews)</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-2 scrollbar-none">
                        {['overview', 'rooms/menu', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap border-b-2 ${activeTab === tab
                                    ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400 bg-blue-50/50 dark:bg-cyan-900/20 rounded-t-lg'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                    } uppercase tracking-wider`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-md">
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                                        Experience premium {service.type} services. Recognized by travelers for our standard and excellence. We offer top of the line modern amenities and 5-star customer service across the entire region.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Premium Amenities</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {service.amenities.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'rooms/menu' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Selection</h3>
                                {options.map((room) => (
                                    <div key={room.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${selectedRoom === room.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'} ${!room.available && 'opacity-50 pointer-events-none'}`}>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{room.name}</h4>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{room.type}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600 dark:text-cyan-400 text-xl">₹{room.price}</div>
                                            <div className="text-xs text-gray-500">per unit/night</div>
                                            {room.available ? (
                                                <button onClick={() => setSelectedRoom(room.id)} className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${selectedRoom === room.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                                    {selectedRoom === room.id ? 'Selected' : 'Select'}
                                                </button>
                                            ) : (
                                                <span className="text-red-500 text-xs font-bold uppercase mt-2 block">Sold Out</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10 opacity-70">
                                <Star className="w-12 h-12 text-gray-400 mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">Reviews integration pending...</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Reservation / Action Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl sticky top-28">
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <span className="font-medium">
                                    {service.operatingHours?.open ? `${service.operatingHours.open} - ${service.operatingHours.close}` : 'Open 24x7'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <span className="font-medium">{service.contactPhone || 'Contact Not Provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                <span className="font-medium">Accepting UPI & Cards</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reserve Now</h3>

                        <div className="space-y-4 mb-6">
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="date" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:border-blue-500" />
                            </div>

                            {selectedRoom && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
                                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Selected Option:</span>
                                    <span className="text-sm font-bold text-blue-900 dark:text-white">₹{options.find(r => r.id === selectedRoom).price}</span>
                                </div>
                            )}
                        </div>

                        <Link
                            to={`/checkout/${service._id}`}
                            className={`w-full block text-center font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg text-white ${selectedRoom ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed border border-gray-300 dark:border-gray-600 text-gray-200 dark:text-gray-500 shadow-none'}`}
                            onClick={(e) => !selectedRoom && e.preventDefault()}
                        >
                            {selectedRoom ? "Proceed to Checkout" : "Select an Option"}
                        </Link>
                        {!selectedRoom && (
                            <p className="text-center text-xs text-gray-500 mt-2">Please select an option from the Rooms/Menu tab</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ServiceDetails;
