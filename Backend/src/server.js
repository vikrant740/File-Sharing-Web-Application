require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const setupSocketIO = require('./sockets/roomSocket');

const app = express();
const server = http.createServer(app);

// Connect MongoDB Database
connectDB();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
}));

// CORS Configuration (Allow both localhost and 127.0.0.1)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Dev environment me allow karein
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'P2P File Drop Backend is running',
    uptime: process.uptime(),
  });
});

// STUN / TURN Configuration endpoint (NAT Traversal)
app.get('/api/turn-credentials', (req, res) => {
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  if (process.env.TURN_SERVER_URL) {
    iceServers.push({
      urls: process.env.TURN_SERVER_URL,
      username: process.env.TURN_USERNAME || '',
      credential: process.env.TURN_CREDENTIAL || '',
    });
  }

  res.status(200).json({ success: true, iceServers });
});

// Setup Socket.IO Server with Stable Transports
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize Socket.io WebRTC & Room listeners
setupSocketIO(io);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready for WebRTC connections`);
  console.log(`===============================================`);
});