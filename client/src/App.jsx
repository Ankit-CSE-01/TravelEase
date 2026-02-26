import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import AnimatedBackground from './components/AnimatedBackground'
import ProfileDropdown from './components/ProfileDropdown'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoutePlanner = lazy(() => import('./pages/RoutePlanner'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const EmergencySOS = lazy(() => import('./pages/EmergencySOS'));
const Profile = lazy(() => import('./pages/Profile'));
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Toaster position="top-center" />
            <Suspense fallback={
                <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <Routes>
                    <Route path="/" element={
                        <div className="relative min-h-screen overflow-hidden flex flex-col">
                            {/* Interactive Animated Node Background */}
                            <AnimatedBackground />

                            {/* Sci-Fi Header */}
                            <header className="relative z-20 bg-white/60 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm top-0 w-full transition-colors duration-300">
                                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3"
                                    >
                                        <img src="/logo.png" alt="TravelEase Logo" className="w-8 h-8 rounded-xl object-cover shadow-sm" />
                                        <h1 className="text-2xl font-bold text-blue-600 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-md">
                                            TravelEase
                                        </h1>
                                    </motion.div>
                                    <nav className="space-x-6 flex items-center font-medium text-sm text-gray-700 dark:text-gray-300">
                                        <Link to="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('home')}</Link>
                                        <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('emergency')}</Link>

                                        {/* Profile Sidebar Dropdown & Auth Rendering */}
                                        <ProfileDropdown
                                            user={user}
                                            onLogout={() => {
                                                logout();
                                                toast.success('Logged out successfully');
                                            }}
                                        />

                                        {/* Theme Toggle */}
                                        <button onClick={toggleTheme} className="p-2 ml-2 rounded-full bg-gray-100 dark:bg-transparent hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-transparent">
                                            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
                                        </button>

                                        {/* Language Toggle */}
                                        <button
                                            onClick={toggleLanguage}
                                            className="px-3 py-1.5 bg-white text-gray-900 shadow-sm border border-gray-200 dark:border-transparent rounded-md font-bold hover:bg-gray-50 transition-colors uppercase"
                                        >
                                            {i18n.language === 'en' ? 'EN' : 'HI'}
                                        </button>
                                    </nav>
                                </div>
                            </header>

                            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-12 pb-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                                {/* Header Text */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-center w-full mt-4"
                                >
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg tracking-wide transition-colors duration-300">
                                        {t('welcome')}
                                    </h2>
                                    <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-200 drop-shadow-sm dark:drop-shadow-md max-w-2xl mx-auto transition-colors duration-300">
                                        {t('subtitle')}
                                    </p>
                                </motion.div>

                                {/* Center Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="mt-8 relative w-full max-w-4xl mx-auto flex items-center justify-center py-6 z-40"
                                >
                                    <div className="relative z-40 flex gap-4 mb-8">
                                        <Link to="/route-planner" className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-md dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                            {t('plan_route')}
                                        </Link>
                                        <Link to="/sos" className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-600 transition-all shadow-md dark:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                            {t('sos_emergency')}
                                        </Link>
                                    </div>
                                </motion.div>

                                {/* Bottom Glassmorphism Feature Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-30"
                                >
                                    <Link to="/sos" className="block">
                                        <div className="bg-white/90 dark:bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-transparent hover:-translate-y-2 transition-transform duration-300 group h-full cursor-pointer">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-xl transition-colors">
                                                🚗
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{t('feature1_title')}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{t('feature1_desc')}</p>
                                        </div>
                                    </Link>

                                    <Link to="/route-planner" className="block">
                                        <div className="bg-white/90 dark:bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-transparent hover:-translate-y-2 transition-transform duration-300 group h-full cursor-pointer">
                                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl transition-colors">
                                                🍽️
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">{t('feature2_title')}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{t('feature2_desc')}</p>
                                        </div>
                                    </Link>

                                    <Link to="/services?type=fuel" className="block">
                                        <div className="bg-white/90 dark:bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-transparent hover:-translate-y-2 transition-transform duration-300 group h-full cursor-pointer">
                                            <div className="w-10 h-10 bg-red-50 dark:bg-red-100 rounded-lg flex items-center justify-center mb-4 text-xl transition-colors">
                                                ⛽
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-red-600 transition-colors">{t('feature3_title')}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{t('feature3_desc')}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            </main>
                        </div>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/route-planner" element={<RoutePlanner />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetails />} />
                    <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/sos" element={<ProtectedRoute><EmergencySOS /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default App
