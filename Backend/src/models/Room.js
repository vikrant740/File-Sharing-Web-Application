const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    default: 'P2P Drop Room',
  },
  passwordHash: {
    type: String,
    default: null, // Hashed PIN / Password
  },
  creatorSocketId: {
    type: String,
    required: true,
  },
  creatorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  maxPeers: {
    type: Number,
    default: 10,
  },
  allowedMimeTypes: {
    type: [String],
    default: [], // Empty means all allowed except blocked executable extensions
  },
  maxFileSizeMB: {
    type: Number,
    default: 2048, // 2GB
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL Index: Auto delete from DB on expiry
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);