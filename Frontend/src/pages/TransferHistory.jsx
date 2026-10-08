import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { File, ArrowLeft } from 'lucide-react';

export default function TransferHistory() {
  const navigate = useNavigate();
  const { history } = useWebRTC();
  const [filter, setFilter] = useState('received');

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="p-8 rounded-3xl border bg-[#0f172a] border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold">Transfer History</h2>
          <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('sent')}
              className={`px-3 py-1.5 rounded-lg font-bold ${filter === 'sent' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-3 py-1.5 rounded-lg font-bold ${filter === 'received' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Received
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {history.filter(h => h.type === filter).map((h, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border bg-slate-950/60 border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-bold text-sm">{h.name}</div>
                  <div className="text-slate-500">{h.date}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">Success</span>
            </div>
          ))}
          {history.filter(h => h.type === filter).length === 0 && (
            <p className="text-slate-500 text-xs text-center py-12">No {filter} files recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}