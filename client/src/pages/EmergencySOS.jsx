import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Navigation, PhoneCall, MessageSquare, Wrench, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { onEmergencyAssigned, offEmergencyEvents } from '../services/socket';

const EmergencySOS = () => {
    const { t } = useTranslation();
    const [assignedMechanic, setAssignedMechanic] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, searching, assigned
    const [eta, setEta] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');

    // Listen for live socket assignments
    useEffect(() => {
        onEmergencyAssigned((data) => {
            console.log('Emergency Assigned:', data);
            setStatus('assigned');
            setAssignedMechanic(data);
            setEta(Math.floor(Math.random() * 10) + 5); // Mock ETA calculation for now
            setMessages(prev => [...prev, { sender: 'system', text: `${data.mechanic} assigned.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            toast.success(`${data.mechanic} is on the way!`);
        });

        // Reduce ETA every minute down to 1
        const timer2 = setInterval(() => {
            if (status === 'assigned') {
                setEta(prev => prev > 1 ? prev - 1 : 1);
            }
        }, 60000);

        return () => {
            clearInterval(timer2);
            offEmergencyEvents();
        };
    }, [status]);

    const requestHelp = async () => {
        setIsRequesting(true);
        try {
            // Send the request with some mock coordinates, in real life you'd use HTML5 Geolocation
            await api.post('/emergency/sos', {
                type: 'breakdown',
                location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'Hwy-99, MM 112' }
            });
            setStatus('searching');
            toast.success('SOS Broadcast sent to nearby partners.');
        } catch (error) {
            console.error('SOS Failed', error);
            toast.error('Failed to broadcast SOS. Check connection.');
            setStatus('idle');
        } finally {
            setIsRequesting(false);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMsg.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInputMsg('');

        // Mock partner reply
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'partner', text: 'I see your location. I will be there shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 pb-16 px-4 font-sans relative overflow-hidden">
            {/* Dramatic Alert Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/20 blur-[120px] rounded-full"></div>
                {status === 'searching' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] border border-red-500/30 rounded-full animate-ping opacity-20"></div>
                )}
            </div>

            <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Status & Chat */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Status Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                    >
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center animate-pulse">
                                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">{t('sos_active')}</h1>
                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    {status === 'searching' && t('locating_partners')}
                                    {status === 'assigned' && t('eta', { eta })}
                                    {status === 'idle' && t('standby')}
                                </p>
                            </div>
                        </div>

                        {status === 'assigned' && assignedMechanic && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 font-bold flex items-center justify-center overflow-hidden border border-blue-500/50">
                                    {assignedMechanic.mechanic.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{assignedMechanic.mechanic}</h4>
                                    <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">{t('verified_partner')}</p>
                                </div>
                                <a href={`tel:${assignedMechanic.mechanicPhone || '123'}`} className="ml-auto w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 hover:bg-green-200 transition-colors">
                                    <PhoneCall className="w-4 h-4" />
                                </a>
                            </motion.div>
                        )}

                        {status === 'idle' && (
                            <motion.button
                                onClick={requestHelp}
                                disabled={isRequesting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold shadow-xl transition-all ${isRequesting ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/30'}`}
                            >
                                {isRequesting ? t('broadcasting') : t('broadcast_sos')}
                            </motion.button>
                        )}

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('incident_type')}</span>
                                <span className="font-bold border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md text-gray-900 dark:text-white">{t('engine_failure')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('location_sent')}</span>
                                <span className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> HWY-99, MM 112</span>
                            </div>
                        </div>

                        {status !== 'idle' && (
                            <button onClick={() => setStatus('idle')} className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                <XCircle className="w-5 h-5" />
                                {t('cancel_request')}
                            </button>
                        )}
                    </motion.div>

                    {/* Chat Interface */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col h-[400px] shadow-xl overflow-hidden"
                    >
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('live_updates')}</h3>
                        </div>

                        <div className="flex-grow p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.sender === 'system' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-200 text-xs w-full text-center' :
                                        msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' :
                                            'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-gray-700'
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {msg.sender !== 'system' && <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendMessage} className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                            <input
                                type="text"
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                placeholder={t('type_message')}
                                className="flex-grow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                            <button type="submit" disabled={!inputMsg.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
                                {t('send')}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Right Column: Radar Map */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 h-[500px] lg:h-auto bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative shadow-2xl flex flex-col items-center justify-center"
                >
                    {/* Simulated Radar Background */}
                    <div className="absolute inset-0 z-0 opacity-60"
                        style={{
                            backgroundImage: `radial-gradient(circle at center, rgba(34,211,238,0.15) 0%, transparent 60%), repeating-radial-gradient(circle at center, transparent 0, transparent 40px, rgba(34,211,238,0.1) 40px, rgba(34,211,238,0.1) 41px)`,
                            backgroundPosition: 'center, center'
                        }}
                    ></div>

                    {/* Radar Sweep Animation */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-r-2 border-cyan-400/50 rounded-full animate-[spin_4s_linear_infinite] origin-center z-0" style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(34,211,238,0.1) 100%)' }}></div>

                    {/* User Location Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white dark:border-gray-900 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></div>
                        <span className="mt-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-white/10">{t('you')}</span>
                    </div>

                    {/* Mock Approaching Mechanic */}
                    {status === 'assigned' && (
                        <motion.div
                            initial={{ top: '20%', left: '80%' }}
                            animate={{ top: '40%', left: '60%' }}
                            transition={{ duration: 60, ease: "linear" }}
                            className="absolute z-20 flex flex-col items-center"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                                <Wrench className="w-4 h-4 text-white" />
                            </div>
                            <span className="mt-1 bg-blue-900/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-blue-100 border border-blue-500/30 whitespace-nowrap">{t('service_unit')}</span>
                        </motion.div>
                    )}

                    <div className="absolute bottom-4 left-4 z-30 bg-black/50 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                        <h3 className="text-white font-bold font-space flex items-center gap-2 mb-1">
                            <Navigation className="w-4 h-4 text-cyan-400" />
                            {t('live_telemetry')}
                        </h3>
                        <div className="text-xs text-cyan-200/70 font-mono space-y-1">
                            <p>LAT: 45.432° N</p>
                            <p>LNG: 12.345° E</p>
                            <p>SYS: SECURE CONNECTION</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmergencySOS;
