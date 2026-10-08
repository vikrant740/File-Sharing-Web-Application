const Room = require('../models/Room');
const setupSignaling = require('./signaling');

const activeRooms = new Map();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    setupSignaling(io, socket);

    // 1. CREATE ROOM (With Granular RBAC, Branding, & Download Limit)
    socket.on('room:create', async (options, callback) => {
      try {
        const { 
          peerName = 'Host', 
          password = null, 
          expiryMinutes = 60,
          maxDownloads = 0, // 0 = unlimited, 1 = one-time
          customBranding = 'FileDrop Room',
          themeColor = '#6366f1'
        } = options;

        let code = generateCode();
        while (activeRooms.has(code)) code = generateCode();

        const roomPeers = new Map();
        roomPeers.set(socket.id, {
          id: socket.id,
          name: peerName,
          role: 'Admin', // Admin / Manager / Member / Viewer
          device: socket.handshake.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
          joinedAt: Date.now(),
        });

        const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

        activeRooms.set(code, {
          password: password || null,
          creatorSocketId: socket.id,
          expiresAt,
          maxDownloads: Number(maxDownloads) || 0,
          downloadCount: 0,
          customBranding,
          themeColor,
          peers: roomPeers,
        });

        socket.join(code);
        console.log(`✅ Room Created: ${code} [Role: Admin]`);

        if (callback) callback({ 
          success: true, 
          code, 
          role: 'Admin', 
          expiresAt,
          customBranding,
          themeColor
        });
      } catch (err) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // 2. JOIN ROOM (RBAC Assignment & Download Check)
    socket.on('room:join', async ({ code, peerName, password }, callback) => {
      try {
        const roomCode = code?.trim().toUpperCase();
        const room = activeRooms.get(roomCode);

        if (!room) {
          return callback && callback({ success: false, message: 'Room not found or expired.' });
        }

        if (Date.now() > room.expiresAt) {
          activeRooms.delete(roomCode);
          return callback && callback({ success: false, message: 'Room has expired.' });
        }

        if (room.password && room.password !== password) {
          return callback && callback({ success: false, message: 'Incorrect Room PIN.' });
        }

        // Assign Member Role
        const newPeer = {
          id: socket.id,
          name: peerName || 'Guest Member',
          role: 'Member',
          device: socket.handshake.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
          joinedAt: Date.now(),
        };

        const existingPeers = Array.from(room.peers.values());
        room.peers.set(socket.id, newPeer);
        socket.join(roomCode);

        if (callback) callback({ 
          success: true, 
          code: roomCode, 
          role: 'Member', 
          peers: existingPeers,
          customBranding: room.customBranding,
          themeColor: room.themeColor
        });

        socket.to(roomCode).emit('room:peer-joined', newPeer);
      } catch (err) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // 3. ONE-TIME DOWNLOAD COUNTER TRIGGER
    socket.on('transfer:file-downloaded', ({ code }) => {
      const room = activeRooms.get(code?.trim().toUpperCase());
      if (!room) return;

      room.downloadCount += 1;
      console.log(`📥 Download count for ${code}: ${room.downloadCount}`);

      // If one-time download reached -> Self destruct room
      if (room.maxDownloads > 0 && room.downloadCount >= room.maxDownloads) {
        console.log(`💣 Self-destructing room ${code}: Reached max download limit (${room.maxDownloads})`);
        io.to(code).emit('room:self-destruct', { 
          message: 'One-time download completed. Room has self-destructed for security.' 
        });
        activeRooms.delete(code);
      }
    });

    // 4. ROLE CHANGE (Admin Granular RBAC: Admin can promote/demote to Manager/Viewer)
    socket.on('room:change-role', ({ code, targetPeerId, newRole }) => {
      const room = activeRooms.get(code?.trim().toUpperCase());
      if (!room || room.creatorSocketId !== socket.id) return;

      const target = room.peers.get(targetPeerId);
      if (target) {
        target.role = newRole;
        io.to(code).emit('room:role-updated', { peerId: targetPeerId, role: newRole });
      }
    });

    // 5. KICK PEER
    socket.on('room:kick-peer', ({ code, targetPeerId }) => {
      const room = activeRooms.get(code?.trim().toUpperCase());
      if (!room || room.creatorSocketId !== socket.id) return;

      const target = io.sockets.sockets.get(targetPeerId);
      if (target) {
        target.leave(code);
        target.emit('room:kicked');
      }

      room.peers.delete(targetPeerId);
      socket.to(code).emit('room:peer-left', { peerId: targetPeerId });
    });

    // 6. LEAVE ROOM
    socket.on('room:leave', ({ code }) => handlePeerLeave(socket, code?.trim().toUpperCase()));
    socket.on('disconnect', () => {
      for (const [code, room] of activeRooms.entries()) {
        if (room.peers.has(socket.id)) handlePeerLeave(socket, code);
      }
    });
  });

  function handlePeerLeave(socket, code) {
    const room = activeRooms.get(code);
    if (!room) return;

    room.peers.delete(socket.id);
    socket.leave(code);
    socket.to(code).emit('room:peer-left', { peerId: socket.id });

    if (room.peers.size === 0) {
      activeRooms.delete(code);
      console.log(`🧹 Room ${code} destroyed`);
    }
  }
}

module.exports = setupSocketIO;