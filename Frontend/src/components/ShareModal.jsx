import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';

export default function ShareModal({ roomCode, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !roomCode) return null;

  const shareUrl = `${window.location.origin}/join?code=${roomCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 fade-in">
      <div className="glass-panel p-8 rounded-3xl text-white max-w-sm w-full space-y-6 relative text-center shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="font-bold text-lg mb-1">Share Room</h3>
          <p className="text-xs text-slate-400">Scan QR or share the link with your peer</p>
        </div>

        {/* QR Code */}
        <div className="p-4 bg-white rounded-2xl flex justify-center shadow-inner">
          <QRCodeSVG value={shareUrl} size={180} />
        </div>

        <div className="p-3 rounded-xl border border-white/10 bg-slate-950 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-indigo-400 truncate max-w-[180px]">
            {roomCode}
          </span>
          <button
            onClick={handleCopy}
            className="btn-primary px-3 py-1.5 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}