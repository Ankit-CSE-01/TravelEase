import axios from 'axios';

// Create an Axios instance configured for our Node.js backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Adjust if your backend port differs
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach the JWT token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Backend expects "Bearer <token>"
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors like expired tokens (401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.error('Authentication error, logging out...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // We'll handle the UI redirect gracefully in the AuthContext or components
        }
        return Promise.reject(error);
    }
);

export default api;
