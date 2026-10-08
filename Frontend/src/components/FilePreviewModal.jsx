import React from 'react';
import { X, Send, File, Eye } from 'lucide-react';
import { fileService } from '../services/fileService';

export default function FilePreviewModal({ files = [], isOpen, onClose, onConfirmSend }) {
  if (!isOpen || files.length === 0) return null;

  const renderPreview = (file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    const isPDF = file.type === 'application/pdf';

    const url = URL.createObjectURL(file);

    if (isImage) {
      return (
        <img
          src={url}
          alt={file.name}
          className="max-h-60 rounded-xl object-contain mx-auto shadow-md"
        />
      );
    }
    if (isVideo) {
      return (
        <video controls className="max-h-60 rounded-xl mx-auto w-full">
          <source src={url} type={file.type} />
        </video>
      );
    }
    if (isAudio) {
      return (
        <audio controls className="w-full my-4">
          <source src={url} type={file.type} />
        </audio>
      );
    }
    if (isPDF) {
      return (
        <div className="p-8 border border-white/10 rounded-xl bg-slate-950 flex flex-col items-center">
          <File className="w-12 h-12 text-rose-400 mb-2" />
          <span className="text-xs text-slate-300 font-semibold">PDF Document</span>
        </div>
      );
    }

    return (
      <div className="p-8 border border-white/10 rounded-xl bg-slate-950 flex flex-col items-center">
        <File className="w-12 h-12 text-indigo-400 mb-2" />
        <span className="text-xs text-slate-400">Preview not available for this file type</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 fade-in">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-white max-w-lg w-full space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-lg">File Preview ({files.length})</h3>
        </div>

        {/* Preview Area (First file) */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex items-center justify-center">
          {renderPreview(files[0])}
        </div>

        {/* File Meta Info */}
        <div className="space-y-1 text-xs text-slate-300">
          <div className="font-bold text-sm truncate text-white">{files[0].name}</div>
          <div className="text-slate-400 flex items-center justify-between">
            <span>Size: {fileService.formatBytes(files[0].size)}</span>
            <span>Type: {files[0].type || 'Unknown'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="btn-secondary w-1/2 py-3 rounded-xl text-xs font-bold text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmSend(files);
              onClose();
            }}
            className="btn-primary w-1/2 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Send Directly
          </button>
        </div>
      </div>
    </div>
  );
}