const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Check if room exists & if password required
  async getRoomStatus(roomCode) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}`);
      return await res.json();
    } catch (err) {
      console.error('API Error (getRoomStatus):', err);
      return { success: false, message: 'Server unreachable' };
    }
  },

  // Verify room password/PIN
  async verifyPassword(roomCode, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, password }),
      });
      return await res.json();
    } catch (err) {
      console.error('API Error (verifyPassword):', err);
      return { success: false, message: 'Server unreachable' };
    }
  },

  // Log completed transfer for analytics
  async logTransfer(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/transfer-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.warn('Transfer log skipped:', err);
    }
  },

  // Fetch STUN / TURN credentials for NAT Traversal
  async getTurnCredentials() {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/turn-credentials`);
      return await res.json();
    } catch (err) {
      return { success: false, iceServers: [] };
    }
  },
};