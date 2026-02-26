import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, Hotel, Wrench, Fuel, Star, MapPin, Search, Loader2, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const getIcon = (type) => {
    switch (type) {
        case 'restaurant': return <Coffee className="w-4 h-4" />;
        case 'hotel': return <Hotel className="w-4 h-4" />;
        case 'repair': return <Wrench className="w-4 h-4" />;
        case 'fuel': return <Fuel className="w-4 h-4" />;
        case 'petrol_pump': return <Fuel className="w-4 h-4" />;
        case 'market': return <ShoppingBag className="w-4 h-4" />;
        case 'markets': return <ShoppingBag className="w-4 h-4" />;
        default: return <MapPin className="w-4 h-4" />;
    }
};

const getColorClass = (type) => {
    switch (type) {
        case 'restaurant': return "text-orange-500 bg-orange-50 dark:bg-orange-500/10";
        case 'hotel': return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
        case 'repair': return "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50";
        case 'fuel': return "text-red-500 bg-red-50 dark:bg-red-500/10";
        case 'petrol_pump': return "text-red-500 bg-red-50 dark:bg-red-500/10";
        case 'market': return "text-green-500 bg-green-50 dark:bg-green-500/10";
        case 'markets': return "text-green-500 bg-green-50 dark:bg-green-500/10";
        default: return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
    }
};

const Services = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialType = queryParams.get('type') || 'all';

    // Map common dashboard labels to backend DB enums
    const mapTypeToBackend = (t) => {
        if (t === 'food') return 'restaurant';
        if (t === 'lodging') return 'hotel';
        if (t === 'markets') return 'market';
        if (t === 'fuel') return 'petrol_pump';
        return t;
    };

    const [filter, setFilter] = useState(mapTypeToBackend(initialType));
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Keep filter in sync with URL
    useEffect(() => {
        const t = new URLSearchParams(location.search).get('type') || 'all';
        setFilter(mapTypeToBackend(t));
    }, [location.search]);

    const handleFilterChange = (type) => {
        setFilter(type);
        if (type === 'all') {
            navigate('/services');
        } else {
            navigate(`/services?type=${type}`);
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const queryParam = filter === 'all' ? '' : `?type=${filter}`;
                const response = await api.get(`/services${queryParam}`);
                setServices(response.data.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [filter]);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-space">
                        Discover Services
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Find the best spots and emergency coverage along your journey.
                    </p>
                </motion.div>

                {/* Filter Pills */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap gap-2"
                >
                    {['all', 'restaurant', 'hotel', 'petrol_pump', 'market'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange(type)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === type
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {type === 'petrol_pump' ? 'Fuel' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </motion.div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id || index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                {service.images && service.images.length > 0 ? (
                                    <img
                                        src={service.images[0]}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{service.rating || 'New'}</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">({service.type})</span>
                                </div>
                                <div className={`absolute top-3 left-3 p-2 rounded-lg backdrop-blur-md shadow-sm border border-white/20 ${getColorClass(service.type)}`}>
                                    {getIcon(service.type)}
                                </div>
                            </div>

                            <div className="p-5 flex-grow flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {service.name}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>~{Math.floor(Math.random() * 20) + 1} km away (Location Access Req)</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {service.amenities && service.amenities.map((amenity, i) => (
                                        <span key={i} className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    to={`/services/${service._id}`}
                                    className="mt-auto w-full block text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2.5 rounded-xl transition-colors text-sm border border-gray-200 dark:border-gray-600"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && services.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">No services found in this category.</h3>
                </div>
            )}
        </div>
    );
};

export default Services;
