export const CHUNK_SIZE = 64 * 1024; // 64 KB

export const fileService = {
  // Format bytes to human readable (KB, MB, GB)
  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },

  // Fast SHA-256 calculation for duplicate checking
  async calculateHash(file) {
    const slice = await file.slice(0, 1024 * 1024).arrayBuffer(); // First 1MB
    const hashBuffer = await crypto.subtle.digest('SHA-256', slice);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Trigger browser download from binary buffer
  triggerDownload(chunks, fileName, mimeType = 'application/octet-stream') {
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};