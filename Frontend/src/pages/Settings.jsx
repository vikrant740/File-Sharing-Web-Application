import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { roomCode } = useWebRTC();

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="p-8 rounded-3xl border bg-[#0f172a] border-slate-800 space-y-6">
        <h2 className="text-xl font-bold">Room Settings</h2>
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-sm">Room Code</div>
              <div className="text-slate-500 font-mono">{roomCode || 'Not in a room'}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-sm">End-to-End Encryption</div>
              <div className="text-slate-500">AES-256 GCM client-side security</div>
            </div>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}