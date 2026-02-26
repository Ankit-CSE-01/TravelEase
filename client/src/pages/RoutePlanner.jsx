import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Coffee, Hotel, Wrench, Fuel, Search, Filter } from 'lucide-react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const RoutePlanner = () => {
    const { t } = useTranslation();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [placesMarkers, setPlacesMarkers] = useState([]);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || "UNSET",
        libraries,
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const calculateRoute = async () => {
        if (source === '' || destination === '') {
            return;
        }

        setActiveCategory(null);
        setPlacesMarkers([]);

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
            setDistance(results.routes[0].legs[0].distance.text);
            setDuration(results.routes[0].legs[0].duration.text);
        } catch (error) {
            console.error("Directions request failed due to mock key or valid error", error);

            // Format the error message
            let errorMessage = "Unknown error";
            if (error && typeof error === 'string') errorMessage = error;
            else if (error && error.message) errorMessage = error.message;
            else if (error && error.code) errorMessage = error.code;

            toast.error(`Map Routing Error: ${errorMessage}`);

            // Fallback mock visualization if API key is a dummy
            setDistance("42 km (Mock)");
            setDuration("1h 15m (Mock)");
        }
    };

    const categories = [
        { id: 'restaurant', label: t('restaurants'), icon: Coffee, color: 'orange' },
        { id: 'lodging', label: t('hotels'), icon: Hotel, color: 'blue' },
        { id: 'car_repair', label: t('repair_shops'), icon: Wrench, color: 'gray' },
        { id: 'gas_station', label: t('petrol_pumps'), icon: Fuel, color: 'red' },
    ];

    const searchPlacesAlongRoute = (categoryId) => {
        if (!directionsResponse || !map) {
            toast.error(t('plan_route_first_to_find_services') || "Please calculate a route first before searching for services.");
            return;
        }

        try {
            setActiveCategory(categoryId);
            setPlacesMarkers([]); // Clear old markers

            // eslint-disable-next-line no-undef
            const service = new google.maps.places.PlacesService(map);

            // Get the route's overview path
            const route = directionsResponse.routes[0];
            const path = route.overview_path;

            if (!path || path.length === 0) {
                toast.error("Route path is unavailable.");
                return;
            }

            // Sample points along the route to search (start, middle, end)
            const pointsToSearch = [
                path[0], // Start
                path[Math.floor(path.length / 2)], // Midpoint
                path[path.length - 1] // Destination
            ];

            let allResults = [];
            let completedRequests = 0;

            pointsToSearch.forEach((point) => {
                const lat = typeof point.lat === 'function' ? point.lat() : point.lat;
                const lng = typeof point.lng === 'function' ? point.lng() : point.lng;

                // Convert category to search query
                let query = categoryId;
                if (categoryId === 'restaurant') query = 'restaurants';
                if (categoryId === 'lodging') query = 'hotels';
                if (categoryId === 'car_repair') query = 'mechanics';
                if (categoryId === 'gas_station') query = 'petrol pumps';

                // eslint-disable-next-line no-undef
                const request = {
                    location: new google.maps.LatLng(lat, lng),
                    radius: '5000', // 5km search radius
                    query: query
                };

                service.textSearch(request, (results, status) => {
                    completedRequests++;
                    // eslint-disable-next-line no-undef
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        allResults = [...allResults, ...results];
                    }

                    // When all searches are done, filter duplicates and update state
                    if (completedRequests === pointsToSearch.length) {
                        // Filter out duplicates by place_id
                        const uniquePlaces = Array.from(new Map(allResults.map(item => [item.place_id, item])).values());
                        setPlacesMarkers(uniquePlaces);

                        if (uniquePlaces.length === 0) {
                            toast.error(t('no_services_found') || "No services found along this route.");
                        } else {
                            toast.success((t('found_services') || "Found ") + uniquePlaces.length + " services.");
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Error searching for places:", error);
            toast.error("Failed to search for services. Please try again.");
            setActiveCategory(null);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

            {/* Sidebar Controls */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/3 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl flex flex-col"
            >
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 mb-6 font-space">
                    {t('plan_your_route')}
                </h2>

                <div className="space-y-4 mb-4">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('starting_location')}
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all font-medium"
                        />
                    </div>
                    <div className="relative flex justify-center py-2">
                        <div className="w-1 h-8 border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
                        </button>
                    </div>
                    <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('destination_location')}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all font-medium"
                        />
                    </div>

                    <button
                        onClick={calculateRoute}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        {t('calculate_route')}
                    </button>
                </div>

                {/* Route Data */}
                {distance && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex flex-col text-center">
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('distance')}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{distance}</span>
                        </div>
                        <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex flex-col text-center">
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('duration')}</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">{duration}</span>
                        </div>
                    </motion.div>
                )}

                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider font-space">{t('services_to_find')}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => searchPlacesAlongRoute(cat.id)}
                            className={`bg-white/40 dark:bg-gray-800/40 border ${activeCategory === cat.id ? 'border-blue-500 ring-2 ring-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'} rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all group`}
                        >
                            <cat.icon className={`w-6 h-6 text-${cat.color}-500 dark:text-${cat.color}-400 group-hover:scale-110 transition-transform`} />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">{t('traveler_pro_tip')}</h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400/80 leading-relaxed">{t('pro_tip_desc')}</p>
                    </div>
                </div>
            </motion.div>

            {/* Map Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-2/3 h-[600px] lg:h-auto bg-gray-200 dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-800 overflow-hidden relative shadow-lg flex items-center justify-center"
            >
                {!apiKey ? (
                    <div className="z-10 text-center p-8 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-sm m-4">
                        <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-space">Map API Key Required</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Google Maps is structurally integrated but requires authentication to render.
                        </p>
                        <p className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            Add <code className="text-red-500 font-bold font-mono">VITE_GOOGLE_MAPS_API_KEY="your_key"</code> to your frontend <code className="text-blue-500 font-bold font-mono">.env</code> file to enable live premium routing.
                        </p>
                    </div>
                ) : isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={defaultCenter}
                        zoom={5}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                        }}
                    >
                        {directionsResponse && (
                            <DirectionsRenderer
                                directions={directionsResponse}
                                options={{
                                    polylineOptions: {
                                        strokeColor: '#3b82f6', // Tailwind blue-500
                                        strokeWeight: 5,
                                    }
                                }}
                            />
                        )}
                        {!directionsResponse && (
                            <Marker position={defaultCenter} />
                        )}
                        {placesMarkers.map((place) => (
                            <Marker
                                key={place.place_id}
                                position={place.geometry.location}
                                title={place.name}
                            />
                        ))}
                    </GoogleMap>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default RoutePlanner;
