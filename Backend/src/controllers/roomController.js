const TransferLog = require('../models/TransferLog');

// Log completed transfer for analytics
exports.logTransfer = async (req, res) => {
  try {
    const { roomCode, fileName, fileSize, fileType, fileHash, senderPeerId, receiverPeerId, transferSpeedKBps, durationMs } = req.body;
    const log = await TransferLog.create({
      roomCode: roomCode?.toUpperCase(),
      fileName,
      fileSize,
      fileType,
      fileHash,
      senderPeerId,
      receiverPeerId,
      transferSpeedKBps,
      durationMs,
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Analytics & stats for a room
exports.getRoomAnalytics = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const logs = await TransferLog.find({ roomCode: roomCode.toUpperCase() }).sort({ createdAt: -1 });

    const totalBytes = logs.reduce((acc, curr) => acc + curr.fileSize, 0);

    res.status(200).json({
      success: true,
      transfers: logs,
      totalTransfers: logs.length,
      totalBytesTransferred: totalBytes,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};