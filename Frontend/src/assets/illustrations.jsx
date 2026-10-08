import React from 'react';
import { ShieldCheck, Wifi } from 'lucide-react';

export function EmptyFilesIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <Wifi className="w-8 h-8 animate-pulse" />
      </div>
      <p className="text-sm font-semibold text-slate-300">No transfers active yet</p>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
        Drag files into the dropzone or click select to start streaming directly to your peer.
      </p>
    </div>
  );
}

export function SecurityBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>AES-256 Client-Side Encrypted</span>
    </div>
  );
}