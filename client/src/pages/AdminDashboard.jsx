import React from 'react';
import { Users, ShieldCheck, AlertCircle, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-8 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-primary">AdminPanel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 p-3 bg-primary text-white rounded-lg">
                        <BarChart3 size={20} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-800 rounded-lg">
                        <Users size={20} /> User Management
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-800 rounded-lg">
                        <ShieldCheck size={20} /> Provider Verification
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-800 rounded-lg">
                        <AlertCircle size={20} /> SOS Incidents
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-800 rounded-lg mt-auto">
                        <Settings size={20} /> System Settings
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <header className="bg-white border-b p-6 flex justify-between items-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">System Overview</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-gray-100 rounded-full"><AlertCircle size={20} className="text-gray-500" /></button>
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Total Users</p>
                            <p className="text-3xl font-extrabold text-gray-900">4,829</p>
                            <p className="text-xs text-green-500 mt-2 font-bold">+12% from last week</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Active Providers</p>
                            <p className="text-3xl font-extrabold text-gray-900">1,240</p>
                            <p className="text-xs text-green-500 mt-2 font-bold">+5% increase</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Daily SOS Alerts</p>
                            <p className="text-3xl font-extrabold text-emergency">12</p>
                            <p className="text-xs text-red-500 mt-2 font-bold">4 currently active</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border shadow-sm p-8">
                        <h3 className="text-lg font-bold mb-6">Recent Platform Activity</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-start gap-4 pb-6 border-b last:border-0">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">New Service Provider Registered</p>
                                        <p className="text-xs text-gray-500 mt-1">"Biker's Paradise" submitted documents for verification (3 hours ago)</p>
                                    </div>
                                    <button className="ml-auto px-4 py-1 text-xs font-bold border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                                        Review
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
