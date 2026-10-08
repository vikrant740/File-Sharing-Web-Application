const mongoose = require('mongoose');

const transferLogSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true, // bytes
  },
  fileType: String,
  fileHash: String, // SHA-256 duplicate detection ke liye
  senderPeerId: String,
  receiverPeerId: String,
  transferSpeedKBps: Number,
  durationMs: Number,
  status: {
    type: String,
    enum: ['initiated', 'completed', 'failed'],
    default: 'completed',
  },
}, { timestamps: true });

module.exports = mongoose.model('TransferLog', transferLogSchema);