import React from 'react';
import { ClipboardList, UserCheck, DollarSign, Star, Clock } from 'lucide-react';

const ProviderDashboard = () => {
    const stats = [
        { label: 'Total Jobs', value: '124', icon: <ClipboardList className="text-blue-500" /> },
        { label: 'Completion Rate', value: '98%', icon: <UserCheck className="text-green-500" /> },
        { label: 'Total Earnings', value: '₹45,200', icon: <DollarSign className="text-orange-500" /> },
        { label: 'Avg Rating', value: '4.8', icon: <Star className="text-yellow-500" /> },
    ];

    const recentOrders = [
        { id: 'REQ-123', user: 'Amit Kumar', service: 'Engine Repair', status: 'On the way', amount: '₹1,200' },
        { id: 'REQ-124', user: 'Sripriya', service: 'Towing', status: 'In Progress', amount: '₹3,500' },
        { id: 'REQ-125', user: 'Rahul Dev', service: 'Flat Tyre', status: 'Completed', amount: '₹450' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Provider Dashboard</h1>
                        <p className="text-gray-500">Welcome back, Super Mech Garages</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Available
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-900 text-lg">Active & Recent Requests</h2>
                            <button className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Request ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{order.user}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">{order.amount}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-xs font-bold text-primary hover:text-blue-700">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-primary text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Earnings Overview</h3>
                            <p className="opacity-80 text-sm mb-8">You've earned ₹12,500 more than last month. Keep it up!</p>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span>Consultations</span>
                                    <span>₹8,400</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span>Parts Sold</span>
                                    <span>₹22,100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service Fees</span>
                                    <span>₹14,700</span>
                                </div>
                            </div>
                        </div>
                        <button className="mt-8 bg-white text-primary py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                            Withdraw Earnings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
