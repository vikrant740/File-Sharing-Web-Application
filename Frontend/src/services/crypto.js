export const cryptoService = {
  // Generate random AES-256 key
  async generateKey() {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  },

  // Export key to send over secure DataChannel handshake
  async exportKey(key) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  },

  // Import received key
  async importKey(base64Key) {
    const binaryString = atob(base64Key);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return await window.crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  },

  // Encrypt chunk using 12-byte IV
  async encrypt(chunkBuffer, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      chunkBuffer
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    return combined.buffer;
  },

  // Decrypt chunk
  async decrypt(combinedBuffer, key) {
    const iv = new Uint8Array(combinedBuffer, 0, 12);
    const data = new Uint8Array(combinedBuffer, 12);
    return await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
  },
};