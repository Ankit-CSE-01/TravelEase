import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    autoConnect: false,
});

export const connectSocket = () => {
    const token = localStorage.getItem('token');
    if (token) {
        socket.auth = { token };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export const joinRoom = (roomId) => {
    socket.emit('join_room', roomId);
};

export const onLocationUpdate = (callback) => {
    socket.on('location_updated', callback);
};

export const onEmergencyAlert = (callback) => {
    socket.on('emergency_alert', callback);
};

export const onEmergencyAssigned = (callback) => {
    socket.on('emergency_assigned', callback);
};

export const offEmergencyEvents = () => {
    socket.off('emergency_alert');
    socket.off('emergency_assigned');
    socket.off('location_updated');
};

export default socket;
