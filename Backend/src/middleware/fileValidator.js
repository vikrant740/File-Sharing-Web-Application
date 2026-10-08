// Block dangerous executable files
const FORBIDDEN_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.vbs', '.msi', '.scr'];

exports.validateFileMetadata = (req, res, next) => {
  const { fileName, fileSize } = req.body;

  if (fileName) {
    const lower = fileName.toLowerCase();
    const isDangerous = FORBIDDEN_EXTENSIONS.some(ext => lower.endsWith(ext));
    if (isDangerous) {
      return res.status(400).json({
        success: false,
        message: 'Security Alert: Executable or malicious files are blocked.',
      });
    }
  }

  // 5GB Max limit
  const MAX_LIMIT = 5 * 1024 * 1024 * 1024;
  if (fileSize && fileSize > MAX_LIMIT) {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds maximum allowed limit (5GB).',
    });
  }

  next();
};