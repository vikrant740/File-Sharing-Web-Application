const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true, // 'ROOM_CREATED', 'USER_KICKED', 'PASSWORD_CHANGE', 'RATE_LIMITED'
  },
  roomCode: String,
  socketId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  ipAddress: String,
  details: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);