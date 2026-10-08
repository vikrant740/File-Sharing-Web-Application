import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { aiAssistant } from '../services/aiAssistant';

const WebRTCContext = createContext();
const SOCKET_SERVER = 'http://localhost:5000';
const CHUNK_SIZE = 64 * 1024; // 64 KB

export function WebRTCProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [role, setRole] = useState(null);
  const [peers, setPeers] = useState([]);
  const [transfers, setTransfers] = useState({});
  const [branding, setBranding] = useState('FileDrop');
  const [speedLimitMBps, setSpeedLimitMBps] = useState(0); // 0 = Unlimited
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('p2p_history') || '[]');
    } catch {
      return [];
    }
  });

  const peerConnections = useRef(new Map());
  const dataChannels = useRef(new Map());
  const incomingFiles = useRef(new Map());
  const activeSenders = useRef(new Map());

  useEffect(() => {
    const s = io(SOCKET_SERVER, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
    });

    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));

    // Self-destruct listener (One-time download)
    s.on('room:self-destruct', ({ message }) => {
      alert(message || 'Room has self-destructed.');
      setRoomCode(null);
      setPeers([]);
    });

    s.on('room:role-updated', ({ peerId, role: newRole }) => {
      setPeers(prev => prev.map(p => p.id === peerId ? { ...p, role: newRole } : p));
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  // WebRTC Setup
  const createPeerConnection = useCallback((peerId, isInitiator) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc:ice-candidate', { targetId: peerId, candidate: event.candidate });
      }
    };

    const setupDataChannel = (dc) => {
      dc.binaryType = 'arraybuffer';

      dc.onopen = () => console.log(`🔒 DataChannel OPEN with ${peerId}`);

      dc.onmessage = async (e) => {
        if (typeof e.data === 'string') {
          const msg = JSON.parse(e.data);

          if (msg.type === 'FILE_START') {
            incomingFiles.current.set(msg.fileId, {
              meta: msg,
              chunks: [],
              receivedSize: 0,
              startTime: Date.now(),
            });
            setTransfers(prev => ({
              ...prev,
              [msg.fileId]: { name: msg.name, size: msg.size, progress: 0, speed: '0 KB/s', status: 'receiving', category: msg.category },
            }));
          } else if (msg.type === 'FILE_PAUSE') {
            setTransfers(prev => prev[msg.fileId] ? ({ ...prev, [msg.fileId]: { ...prev[msg.fileId], status: 'paused' } }) : prev);
          } else if (msg.type === 'FILE_RESUME') {
            setTransfers(prev => prev[msg.fileId] ? ({ ...prev, [msg.fileId]: { ...prev[msg.fileId], status: 'receiving' } }) : prev);
          } else if (msg.type === 'FILE_END') {
            const incoming = incomingFiles.current.get(msg.fileId);
            if (incoming) {
              const fullBuffer = new Uint8Array(incoming.receivedSize);
              let offset = 0;
              for (const c of incoming.chunks) {
                fullBuffer.set(new Uint8Array(c), offset);
                offset += c.byteLength;
              }

              const blob = new Blob([fullBuffer], { type: incoming.meta.mimeType || 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = incoming.meta.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              setTransfers(prev => ({
                ...prev,
                [msg.fileId]: { ...prev[msg.fileId], progress: 100, status: 'completed' },
              }));

              // Notify socket for download limit count
              if (socket && roomCode) {
                socket.emit('transfer:file-downloaded', { code: roomCode });
              }

              const hist = {
                id: msg.fileId,
                name: incoming.meta.name,
                size: incoming.meta.size,
                type: 'received',
                date: new Date().toLocaleTimeString(),
              };
              setHistory(h => {
                const u = [hist, ...h];
                localStorage.setItem('p2p_history', JSON.stringify(u.slice(0, 50)));
                return u;
              });

              incomingFiles.current.delete(msg.fileId);
            }
          }
        } else {
          // Binary chunk
          const fileId = new Uint8Array(e.data, 0, 16);
          const fileIdStr = String.fromCharCode(...fileId).trim();
          const rawChunk = e.data.slice(16);

          const incoming = incomingFiles.current.get(fileIdStr);
          if (incoming) {
            incoming.chunks.push(rawChunk);
            incoming.receivedSize += rawChunk.byteLength;

            const progress = Math.min(100, Math.round((incoming.receivedSize / incoming.meta.size) * 100));
            const elapsed = (Date.now() - incoming.startTime) / 1000;
            const speedKBps = elapsed > 0 ? (incoming.receivedSize / 1024 / elapsed).toFixed(1) : 0;
            const displaySpeed = speedKBps > 1024 ? `${(speedKBps / 1024).toFixed(2)} MB/s` : `${speedKBps} KB/s`;

            setTransfers(prev => ({
              ...prev,
              [fileIdStr]: { ...prev[fileIdStr], progress, speed: displaySpeed, status: 'receiving' },
            }));
          }
        }
      };

      dataChannels.current.set(peerId, dc);
    };

    if (isInitiator) {
      const dc = pc.createDataChannel('fileTransfer', { ordered: true });
      setupDataChannel(dc);
    } else {
      pc.ondatachannel = (e) => setupDataChannel(e.channel);
    }

    peerConnections.current.set(peerId, pc);
    return pc;
  }, [socket, roomCode]);

  useEffect(() => {
    if (!socket) return;

    socket.on('webrtc:offer', async ({ senderId, offer }) => {
      let pc = peerConnections.current.get(senderId);
      if (!pc) pc = createPeerConnection(senderId, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc:answer', { targetId: senderId, answer });
    });

    socket.on('webrtc:answer', async ({ senderId, answer }) => {
      const pc = peerConnections.current.get(senderId);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('webrtc:ice-candidate', async ({ senderId, candidate }) => {
      const pc = peerConnections.current.get(senderId);
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error(e);
        }
      }
    });

    socket.on('room:peer-joined', async (newPeer) => {
      setPeers(prev => [...prev.filter(p => p.id !== newPeer.id), newPeer]);
      const pc = createPeerConnection(newPeer.id, true);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('webrtc:offer', { targetId: newPeer.id, offer });
    });

    socket.on('room:peer-left', ({ peerId }) => {
      setPeers(prev => prev.filter(p => p.id !== peerId));
      if (peerConnections.current.has(peerId)) {
        peerConnections.current.get(peerId).close();
        peerConnections.current.delete(peerId);
      }
      dataChannels.current.delete(peerId);
    });

    socket.on('room:kicked', () => {
      alert('You have been removed from the room.');
      setRoomCode(null);
      setPeers([]);
    });

    return () => {
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice-candidate');
      socket.off('room:peer-joined');
      socket.off('room:peer-left');
      socket.off('room:kicked');
    };
  }, [socket, createPeerConnection]);

  // Actions
  const createRoom = (options) => {
    return new Promise((resolve, reject) => {
      if (!socket || !socket.connected) return reject(new Error('Signaling server disconnected'));
      socket.emit('room:create', options, (res) => {
        if (res?.success) {
          setRoomCode(res.code);
          setRole('Admin');
          setPeers([]);
          if (options.customBranding) setBranding(options.customBranding);
          resolve(res);
        } else {
          reject(new Error(res?.error || 'Failed to create room'));
        }
      });
    });
  };

  const joinRoom = (code, peerName, password) => {
    return new Promise((resolve, reject) => {
      if (!socket || !socket.connected) return reject(new Error('Signaling server disconnected'));
      socket.emit('room:join', { code, peerName, password }, (res) => {
        if (res?.success) {
          setRoomCode(res.code);
          setRole(res.role || 'Member');
          setPeers(res.peers || []);
          if (res.customBranding) setBranding(res.customBranding);
          resolve(res);
        } else {
          reject(new Error(res?.message || 'Failed to join room'));
        }
      });
    });
  };

  const changePeerRole = (targetPeerId, newRole) => {
    if (socket && roomCode && role === 'Admin') {
      socket.emit('room:change-role', { code: roomCode, targetPeerId, newRole });
    }
  };

  const kickPeer = (targetPeerId) => {
    if (socket && roomCode && role === 'Admin') {
      socket.emit('room:kick-peer', { code: roomCode, targetPeerId });
    }
  };

  const leaveRoom = () => {
    if (socket && roomCode) {
      socket.emit('room:leave', { code: roomCode });
      setRoomCode(null);
      setPeers([]);
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      dataChannels.current.clear();
    }
  };

  // SEND FILE WITH AI CLASSIFICATION & BANDWIDTH THROTTLING
  const sendFile = async (file) => {
    if (dataChannels.current.size === 0) {
      return alert('No peers connected yet! Share the room code to start.');
    }

    // Role check: Viewer cannot upload
    if (role === 'Viewer') {
      return alert('Access Restricted: Viewers are only permitted to download files.');
    }

    const classification = aiAssistant.classifyFile(file);
    const summary = await aiAssistant.summarizeFile(file);
    const fileId = Math.random().toString(36).substring(2, 10).padEnd(16, ' ');

    activeSenders.current.set(fileId.trim(), { isPaused: false, cancel: false });

    setTransfers(prev => ({
      ...prev,
      [fileId.trim()]: { 
        name: file.name, 
        size: file.size, 
        progress: 0, 
        speed: '0 KB/s', 
        status: 'sending',
        category: classification.category,
        summary
      },
    }));

    const metaMsg = JSON.stringify({
      type: 'FILE_START',
      fileId: fileId.trim(),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      category: classification.category,
      summary
    });

    dataChannels.current.forEach(dc => dc.readyState === 'open' && dc.send(metaMsg));

    let offset = 0;
    const startTime = Date.now();

    const readAndSend = () => {
      const sender = activeSenders.current.get(fileId.trim());
      if (sender && sender.cancel) return;
      if (sender && sender.isPaused) {
        setTimeout(readAndSend, 200);
        return;
      }

      if (offset >= file.size) {
        const endMsg = JSON.stringify({ type: 'FILE_END', fileId: fileId.trim() });
        dataChannels.current.forEach(dc => dc.readyState === 'open' && dc.send(endMsg));

        setTransfers(prev => ({
          ...prev,
          [fileId.trim()]: { ...prev[fileId.trim()], progress: 100, status: 'completed' },
        }));

        const hist = {
          id: fileId.trim(),
          name: file.name,
          size: file.size,
          type: 'sent',
          date: new Date().toLocaleTimeString(),
        };
        setHistory(h => {
          const u = [hist, ...h];
          localStorage.setItem('p2p_history', JSON.stringify(u.slice(0, 50)));
          return u;
        });
        return;
      }

      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const reader = new FileReader();

      reader.onload = async (e) => {
        const chunkBuffer = e.target.result;

        for (const [_, dc] of dataChannels.current.entries()) {
          if (dc.readyState === 'open') {
            const packet = new Uint8Array(16 + chunkBuffer.byteLength);
            for (let i = 0; i < 16; i++) packet[i] = fileId.charCodeAt(i) || 32;
            packet.set(new Uint8Array(chunkBuffer), 16);

            // Bandwidth throttling delay calculation
            let throttleDelay = 0;
            if (speedLimitMBps > 0) {
              const delayPerChunk = (CHUNK_SIZE / (speedLimitMBps * 1024 * 1024)) * 1000;
              throttleDelay = Math.max(0, delayPerChunk);
            }

            if (dc.bufferedAmount > 8 * 1024 * 1024) {
              await new Promise(r => setTimeout(r, 20 + throttleDelay));
            } else if (throttleDelay > 0) {
              await new Promise(r => setTimeout(r, throttleDelay));
            }

            dc.send(packet.buffer);
          }
        }

        offset += slice.size;
        const progress = Math.min(100, Math.round((offset / file.size) * 100));
        const elapsed = (Date.now() - startTime) / 1000;
        const speedKBps = elapsed > 0 ? (offset / 1024 / elapsed).toFixed(1) : 0;
        const displaySpeed = speedKBps > 1024 ? `${(speedKBps / 1024).toFixed(2)} MB/s` : `${speedKBps} KB/s`;

        setTransfers(prev => ({
          ...prev,
          [fileId.trim()]: { ...prev[fileId.trim()], progress, speed: displaySpeed, status: 'sending' },
        }));

        setTimeout(readAndSend, 0);
      };

      reader.readAsArrayBuffer(slice);
    };

    readAndSend();
  };

  return (
    <WebRTCContext.Provider value={{
      isConnected,
      roomCode,
      role,
      peers,
      transfers,
      history,
      branding,
      speedLimitMBps,
      setSpeedLimitMBps,
      createRoom,
      joinRoom,
      leaveRoom,
      kickPeer,
      changePeerRole,
      sendFile,
    }}>
      {children}
    </WebRTCContext.Provider>
  );
}

export function useWebRTC() {
  return useContext(WebRTCContext);
}