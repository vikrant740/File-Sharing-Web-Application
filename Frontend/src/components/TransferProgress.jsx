import React from 'react';
import { File, Pause, Play, X, CheckCircle2 } from 'lucide-react';

function formatBytes(bytes) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function TransferProgress({ transfers, onPauseToggle, onCancel }) {
  const items = Object.entries(transfers || {});

  if (items.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Transfers</h4>
      <div className="space-y-3">
        {items.map(([id, tr]) => (
          <div key={id} className="p-4 rounded-2xl border border-white/5 bg-slate-950/60 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <File className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="font-bold truncate text-slate-200">{tr.name}</span>
                <span className="text-slate-500">({formatBytes(tr.size)})</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-400">{tr.speed}</span>
                <span className={tr.status === 'completed' ? 'text-emerald-400 font-bold' : 'text-indigo-400'}>
                  {tr.status === 'completed' ? 'Completed' : `${tr.progress}%`}
                </span>
                {tr.status !== 'completed' && (
                  <div className="flex items-center gap-1">
                    {onPauseToggle && (
                      <button onClick={() => onPauseToggle(id)} className="p-1 hover:bg-slate-800 rounded text-slate-400">
                        {tr.status === 'paused' ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    {onCancel && (
                      <button onClick={() => onCancel(id)} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  tr.status === 'completed' 
                    ? 'bg-emerald-500' 
                    : tr.status === 'paused'
                      ? 'bg-amber-500'
                      : 'progress-shimmer'
                }`}
                style={{ width: `${tr.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}