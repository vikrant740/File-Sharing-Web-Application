import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

let socketInstance = null;

export const socketService = {
  connect() {
    if (!socketInstance) {
      socketInstance = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {
        console.log('⚡ Socket connected successfully:', socketInstance.id);
      });

      socketInstance.on('connect_error', (err) => {
        console.warn('⚠️ Socket connection error:', err.message);
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