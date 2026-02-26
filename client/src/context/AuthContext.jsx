import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActive');
        setUser(null);
        disconnectSocket();
    };

    // Initial load: Check if user exists in localStorage
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');
                const lastActive = localStorage.getItem('lastActive');

                if (storedUser && storedToken) {
                    if (lastActive && Date.now() - parseInt(lastActive, 10) > SESSION_TIMEOUT) {
                        toast.error('Session expired due to inactivity. Please log in again.');
                        logout();
                        setLoading(false);
                        return;
                    }

                    setUser(JSON.parse(storedUser));
                    connectSocket();
                    localStorage.setItem('lastActive', Date.now().toString());
                }
            } catch (error) {
                console.error("Failed to parse local user state:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Activity tracker for auto-logout
    useEffect(() => {
        if (!user) return;

        const updateActivity = () => {
            localStorage.setItem('lastActive', Date.now().toString());
        };

        const checkInactivity = () => {
            const lastActive = localStorage.getItem('lastActive');
            if (lastActive && Date.now() - parseInt(lastActive, 10) > SESSION_TIMEOUT) {
                toast.error('Session expired due to inactivity. Please log in again.');
                logout();
            }
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('scroll', updateActivity, true);
        window.addEventListener('click', updateActivity);

        const intervalId = setInterval(checkInactivity, 60000); // check every minute

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('scroll', updateActivity, true);
            window.removeEventListener('click', updateActivity);
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Create a dummy user object to display initials in the UI since the backend doesn't provide them
    const formatUserData = (data) => {
        const initials = data.name
            ? data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            : 'U';

        return {
            ...data,
            initials: initials,
            role: data.userType === 'provider' ? 'Service Partner' : 'Traveler Pro' // Mock UI roles
        };
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/login', { email, password });

            const userData = formatUserData(response.data);

            // Save token and user details separately
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('lastActive', Date.now().toString());

            setUser(userData);
            connectSocket();
            toast.success('Login Successful!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userDataForm) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/register', userDataForm);

            const userData = formatUserData(response.data);

            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('lastActive', Date.now().toString());

            setUser(userData);
            connectSocket();
            toast.success('Registration successful! Welcome to TravelEase.');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
