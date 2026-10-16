import io from 'socket.io-client';

// Dynamic URL detector: Laptop, Phone (Same Wi-Fi) aur Vercel sab par kaam karega
const getSocketServerUrl = () => {
  // 1. Agar .env me VITE_SOCKET_URL diya hai
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  // 2. Agar browser me run ho raha hai
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Agar laptop par localhost chal raha hai
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }

    // Agar phone se laptop ke IP par open kiya (e.g. 192.168.1.15:5173)
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return `http://${hostname}:5000`;
    }

    // Agar Vercel ya kisi live domain par hai:
    // (Jab aap backend deploy karein, toh apna Render/Railway URL yahan daal sakte hain)
    return 'https://filedrop-backend.onrender.com'; 
  }

  return 'http://localhost:5000';
};

const SOCKET_SERVER_URL = getSocketServerUrl();

let socketInstance = null;

export const socketService = {
  connect() {
    if (!socketInstance) {
      socketInstance = io(SOCKET_SERVER_URL, {
        transports: ['polling', 'websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 1000,
        timeout: 20000,
        withCredentials: true,
      });

      socketInstance.on('connect', () => {
        console.log('⚡ Socket connected successfully to:', SOCKET_SERVER_URL, 'ID:', socketInstance.id);
      });

      socketInstance.on('connect_error', (err) => {
        console.warn('⚠️ Socket connection error with', SOCKET_SERVER_URL, ':', err.message);
      });
    }
    return socketInstance;
  },

  getSocket() {
    return socketInstance || this.connect();
  },

  disconnect() {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  },
};

export const socket = socketService.getSocket();