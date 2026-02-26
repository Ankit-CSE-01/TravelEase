import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Settings, CreditCard, Clock, LogOut, ChevronRight, Star } from 'lucide-react';

const ProfileDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user) {
        return (
            <Link to="/login" className="px-5 py-2 rounded-lg bg-blue-100 dark:bg-blue-100/90 text-blue-900 font-bold hover:bg-blue-200 transition-colors shadow-sm">
                Login
            </Link>
        );
    }

    const menuItems = [
        { icon: User, label: 'Update Profile', link: '/profile', color: 'text-blue-500' },
        { icon: Clock, label: 'Purchase History', link: '/profile', color: 'text-green-500' },
        { icon: Star, label: 'Membership Options', link: '/profile', color: 'text-yellow-500' },
        { icon: CreditCard, label: 'Payment Methods', link: '/profile', color: 'text-purple-500' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The trigger badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/50 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-black/60 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <div className="flex flex-col items-end">
                    <span className="text-gray-900 dark:text-white font-bold text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">{user.name}</span>
                    <span className="text-blue-600 dark:text-cyan-500/80 text-[10px] tracking-widest uppercase font-semibold">{user.role}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    {user.initials}
                </div>
            </button>

            {/* The Dropdown Menu (Sidebar style on mobile, dropdown on desktop) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
                    >
                        {/* Header Area */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {user.initials}
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">{user.name}</h4>
                                    <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">{user.email || 'user@example.com'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 relative">
                                        <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors shadow-sm`}>
                                            <item.icon className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm group-hover:text-gray-900 dark:group-hover:text-white">{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>

                        {/* Logout Footer */}
                        <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    if (onLogout) onLogout();
                                }}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-500/20 hover:shadow-sm transition-colors group"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Secure Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
