import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Settings, Clock, MapPin, Heart, CreditCard, LogOut, ChevronRight, Edit3 } from 'lucide-react';

const Profile = () => {
    // Mock user data
    const user = {
        name: "John Traveler",
        email: "john.doe@galaxy.com",
        phone: "+91 98765 43210",
        memberSince: "Oct 2024",
        tier: "Pro Member",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop"
    };

    const tabs = [
        { id: 'history', label: 'Booking History', icon: Clock },
        { id: 'saved', label: 'Saved Routes', icon: Heart },
        { id: 'vehicles', label: 'My Vehicles', icon: Settings },
        { id: 'payments', label: 'Payment Methods', icon: CreditCard }
    ];

    const [activeTab, setActiveTab] = useState('history');

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Sidebar Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-sky-900 dark:to-blue-900"></div>

                        <div className="relative pt-12 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden shadow-lg mb-4 bg-gray-100 dark:bg-gray-800">
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-space mt-2">{user.name}</h2>
                            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 tracking-widest uppercase mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800">
                                {user.tier}
                            </span>

                            <div className="w-full space-y-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Email</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Phone</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{user.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Joined</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{user.memberSince}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 text-sm">
                                <Edit3 className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xl">
                        <button className="w-full flex items-center text-red-600 dark:text-red-400 font-bold p-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                            <LogOut className="w-5 h-5 mr-3" /> Logout
                        </button>
                    </div>
                </motion.div>

                {/* Right Content Area */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3"
                >
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">

                        {/* Tabs Header */}
                        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 scrollbar-none bg-white/40 dark:bg-gray-900/40">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id
                                            ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400 bg-white dark:bg-black/20'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-8 flex-grow">
                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-space">Recent Bookings</h3>

                                    {[1, 2].map(item => (
                                        <div key={item} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-300 dark:hover:border-gray-500 transition-colors">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">Cosmic Rest Stop Hotel</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Oct 24, 2024 • Stellar Suite</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-900 dark:text-white">₹5,310</div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 dark:bg-green-900/30 px-2 rounded">Completed</span>
                                                </div>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center pt-4">
                                        <button className="text-blue-600 dark:text-cyan-400 font-bold text-sm hover:underline">View All History</button>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'history' && (
                                <div className="h-full flex flex-col items-center justify-center opacity-70 py-20">
                                    <Settings className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4 animate-spin-slow" />
                                    <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 font-space">Section in Development</h3>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-2 max-w-md">API integrations for {activeTab} are pending connection to the MongoDB backend.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
