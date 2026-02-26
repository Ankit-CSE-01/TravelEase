import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Search, AlertTriangle, Utensils, Hotel, Fuel, ShoppingBag, Bell, Shield, Sun, Moon, CheckCircle, Home } from 'lucide-react';
import { onEmergencyAlert, onLocationUpdate, offEmergencyEvents } from '../services/socket';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';
import { useTranslation } from 'react-i18next';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const Dashboard = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('route');
    const [activeEmergencies, setActiveEmergencies] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [map, setMap] = useState(null);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || "UNSET",
        libraries,
    });

    const calculateRoute = async () => {
        if (source === '' || destination === '') return;
        try {
            // eslint-disable-next-line no-undef
            const directionsService = new google.maps.DirectionsService();
            const results = await directionsService.route({
                origin: source,
                destination: destination,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
            });
            setDirectionsResponse(results);
        } catch (error) {
            console.error("Routing error", error);
            toast.error("Failed to calculate route.");
        }
    };

    useEffect(() => {
        onEmergencyAlert((data) => {
            toast.error(`SOS ALERT: ${data.user} is in distress!`, { duration: 5000, icon: '🆘' });
            setActiveEmergencies(prev => {
                // Prevent duplicates
                if (!prev.find(e => e.id === data.id)) {
                    return [data, ...prev];
                }
                return prev;
            });
        });

        return () => {
            offEmergencyEvents();
        }
    }, []);

    const handleAcceptSOS = async (emergencyId) => {
        try {
            await api.put(`/emergency/accept/${emergencyId}`);
            toast.success('SOS Accepted! The traveler has been notified of your ETA.');
            setActiveEmergencies(prev => prev.filter(e => e.id !== emergencyId));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to accept SOS.');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-base overflow-hidden font-sans transition-colors duration-300">
            {/* Sidebar for Controls */}
            <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-80 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl shadow-2xl z-20 flex flex-col border-r border-gray-200 dark:border-gray-800"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2 tracking-tight">
                        <Navigation className="fill-current w-6 h-6" /> TravelEase
                    </h1>
                    <div className="flex items-center gap-1">
                        <Link to="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Home">
                            <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('route')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'route' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                    >
                        {t('route_plan')}
                    </button>
                    <button
                        onClick={() => setActiveTab('emergency')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'emergency' ? 'text-emergency border-b-2 border-emergency bg-emergency/5' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                    >
                        {t('dashboard_emergency')}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {activeTab === 'route' ? (
                            <motion.div
                                key="route"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('starting_point')}</label>
                                        <div className="mt-1.5 relative group">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                value={source}
                                                onChange={(e) => setSource(e.target.value)}
                                                placeholder="Enter location"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('destination')}</label>
                                        <div className="mt-1.5 relative group">
                                            <Navigation className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                placeholder="Where to?"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={calculateRoute}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Search className="w-4 h-4" /> {t('plan_route')}
                                    </motion.button>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        Discover along the way
                                    </label>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Utensils, label: 'Food', color: 'orange' },
                                            { icon: Hotel, label: 'Lodging', color: 'purple' },
                                            { icon: Fuel, label: 'Fuel', color: 'blue' },
                                            { icon: ShoppingBag, label: 'Markets', color: 'green' }
                                        ].map((item, idx) => (
                                            <Link to={`/services?type=${item.label.toLowerCase()}`} key={item.label} className="block">
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`w-full flex flex-col items-center p-4 bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-${item.color}-500 dark:hover:border-${item.color}-500 hover:shadow-md transition-all group`}
                                                >
                                                    <item.icon className={`w-6 h-6 text-${item.color}-500 mb-2 group-hover:scale-110 transition-transform`} />
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                                                </motion.button>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="emergency"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-100 dark:border-red-900/50 shadow-sm"
                                >
                                    <h3 className="text-emergency font-bold flex items-center gap-2 mb-2 text-lg">
                                        <AlertTriangle className="w-5 h-5 animate-pulse" /> Breakdown Assistance
                                    </h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">Immediate help for vehicle failure, flat tyres, or empty fuel. Mechanics dispatched instantly.</p>
                                    <Link to="/sos">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-emergency text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emergency/40 hover:bg-red-600 transition-all cursor-pointer"
                                        >
                                            Request Immediate Help
                                        </motion.button>
                                    </Link>
                                </motion.div>

                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ x: 4 }}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 rounded-xl hover:border-emergency dark:hover:border-emergency transition-all group shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-emergency">
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-900 dark:text-white">SOS Emergency</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Alert family & local authorities</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ x: 4 }}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 rounded-xl hover:border-emergency dark:hover:border-emergency transition-all group shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-emergency">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-900 dark:text-white">Police Assistance</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Contact nearest authorities</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>

                                {activeEmergencies.length > 0 && (
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emergency animate-ping"></span> Active SOS Alerts
                                        </h4>
                                        <div className="space-y-3">
                                            {activeEmergencies.map((alert, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={alert.id || index}
                                                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm flex flex-col gap-3"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                                                            <AlertTriangle className="w-4 h-4" /> {alert.user}
                                                        </p>
                                                        <p className="text-xs text-red-600 dark:text-red-500 mt-1 ml-6">{alert.type.toUpperCase()} alert near your route</p>
                                                    </div>

                                                    {user?.role === 'Service Partner' && (
                                                        <button
                                                            onClick={() => handleAcceptSOS(alert.id)}
                                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                                        >
                                                            <CheckCircle className="w-4 h-4" /> Accept Dispatch
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Main Map View Placeholder */}
            <div className="flex-1 relative bg-gray-200 dark:bg-dark-surface/50 overflow-hidden">
                {!isLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-500 dark:text-gray-400 z-10">
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                            <Navigation className="w-16 h-16 mb-4 text-primary opacity-50" />
                        </motion.div>
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Loading Map...</p>
                    </div>
                ) : (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{ lat: 20.5937, lng: 78.9629 }}
                        zoom={5}
                        options={{
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                        }}
                        onLoad={map => setMap(map)}
                    >
                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                        {activeEmergencies.map((alert, index) => (
                            <Marker
                                key={alert.id || index}
                                position={{ lat: alert.location?.lat || 20.5937, lng: alert.location?.lng || 78.9629 }} // Fallback coordinates if location not sent
                                icon={{
                                    url: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='red' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'/%3E%3Cline x1='12' y1='9' x2='12' y2='13'/%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'/%3E%3C/svg%3E",
                                    scaledSize: new window.google.maps.Size(32, 32),
                                }}
                            />
                        ))}
                    </GoogleMap>
                )}

                {/* Search Bar Overlay on Map */}
                <div className="absolute top-6 left-6 right-32 z-20 pointer-events-none">
                    <div className="max-w-2xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md shadow-xl border border-gray-100 dark:border-gray-800 rounded-full flex items-center px-4 py-3 pointer-events-auto">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input type="text" placeholder="Search for nearby services, hotels, or mechanics..." className="bg-transparent w-full outline-none text-sm dark:text-white font-medium" />
                    </div>
                </div>

                {/* User Profile overlay */}
                <div className="absolute top-6 right-6 z-20">
                    <ProfileDropdown
                        user={user}
                        onLogout={() => {
                            logout();
                            toast.success('Logged out successfully');
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
