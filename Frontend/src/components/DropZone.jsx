import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function DropZone({ onFilesSelected, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && document.getElementById('dropzoneInput').click()}
      className={`border-2 border-dashed rounded-3xl p-12 text-center transition flex flex-col items-center justify-center min-h-[320px] ${
        disabled 
          ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900/20' 
          : isDragging 
            ? 'dropzone-active cursor-pointer' 
            : 'border-slate-800 bg-slate-900/40 hover:border-indigo-500/50 cursor-pointer'
      }`}
    >
      <input
        id="dropzoneInput"
        type="file"
        multiple
        disabled={disabled}
        className="hidden"
        onChange={handleFileInput}
      />
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="font-bold text-lg mb-1 text-slate-100">
        {disabled ? 'Waiting for a peer to join...' : 'Drag & Drop files here'}
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        {disabled ? 'Connect with a friend to unlock transfer' : 'or click to browse from device'}
      </p>
      <button 
        disabled={disabled}
        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
          disabled ? 'bg-slate-800 text-slate-500' : 'btn-primary text-white cursor-pointer'
        }`}
      >
        Select Files
      </button>
      <span className="text-[11px] text-slate-500 mt-4">
        Direct P2P Stream • Any size up to 2GB • Encrypted
      </span>
    </div>
  );
}