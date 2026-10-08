/**
 * WebRTC Signaling Events
 * Browser-to-browser direct connection banane ke liye SDP Offer/Answer aur ICE Candidates exchange karta hai.
 */
function setupSignaling(io, socket) {
  // 1. Peer A sends SDP Offer to Peer B
  socket.on('webrtc:offer', ({ targetId, offer }) => {
    io.to(targetId).emit('webrtc:offer', {
      senderId: socket.id,
      offer,
    });
  });

  // 2. Peer B answers with SDP Answer to Peer A
  socket.on('webrtc:answer', ({ targetId, answer }) => {
    io.to(targetId).emit('webrtc:answer', {
      senderId: socket.id,
      answer,
    });
  });

  // 3. ICE Candidate exchange (NAT Traversal)
  socket.on('webrtc:ice-candidate', ({ targetId, candidate }) => {
    io.to(targetId).emit('webrtc:ice-candidate', {
      senderId: socket.id,
      candidate,
    });
  });

  // 4. Real-time transfer speed & progress sync
  socket.on('transfer:progress', ({ roomCode, fileId, progress, speedKBps }) => {
    socket.to(roomCode).emit('transfer:peer-progress', {
      peerId: socket.id,
      fileId,
      progress,
      speedKBps,
    });
  });
}

module.exports = setupSignaling;