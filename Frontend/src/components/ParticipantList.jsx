import React from 'react';
import { UserX } from 'lucide-react';

export default function ParticipantList({ peers = [], role = 'member', onKick }) {
  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4 h-fit">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Participants ({peers.length + 1})</h3>
      <div className="space-y-2 text-xs">
        {/* Current User */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
          <span>You ({role === 'admin' ? 'Host' : 'Member'})</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 badge-online" />
        </div>

        {/* Remote Peers */}
        {peers.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/40">
            <span className="text-slate-300">{p.name}</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {role === 'admin' && onKick && (
                <button 
                  onClick={() => onKick(p.id)} 
                  className="text-rose-400 hover:text-rose-300 transition cursor-pointer"
                  title="Kick Peer"
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {peers.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4">Waiting for peer to join...</p>
        )}
      </div>
    </div>
  );
}