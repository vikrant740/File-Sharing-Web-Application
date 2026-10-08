import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { Cloud, ArrowRight, ArrowLeft, Shield, Eye, Flame, Gauge } from 'lucide-react';

export default function CreateRoom() {
  const navigate = useNavigate();
  const { createRoom } = useWebRTC();
  const [peerName, setPeerName] = useState('Host');
  const [password, setPassword] = useState('');
  const [expiry, setExpiry] = useState(60);
  const [maxDownloads, setMaxDownloads] = useState(0); // 0 = unlimited, 1 = one-time
  const [customBranding, setCustomBranding] = useState('My Secure P2P Room');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoom({
        peerName: peerName.trim(),
        password: password.trim(),
        expiryMinutes: Number(expiry),
        maxDownloads: Number(maxDownloads),
        customBranding: customBranding.trim(),
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 fade-in">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cloud className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-1 text-slate-100">Create Advanced Room</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure Zero-Knowledge room with AI intelligence & limits.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Your Name</label>
              <input
                type="text"
                value={peerName}
                onChange={e => setPeerName(e.target.value)}
                className="input-modern w-full px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Custom Room Name</label>
              <input
                type="text"
                placeholder="e.g. Design Team Sync"
                value={customBranding}
                onChange={e => setCustomBranding(e.target.value)}
                className="input-modern w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Room Password / PIN (Optional)</label>
              <input
                type="password"
                placeholder="Protect room with PIN"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-modern w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Expiry</label>
                <select
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  className="input-modern w-full px-3 py-2.5 rounded-xl text-xs"
                >
                  <option value={15}>15 Mins</option>
                  <option value={60}>1 Hour</option>
                  <option value={1440}>24 Hours</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Limit
                </label>
                <select
                  value={maxDownloads}
                  onChange={e => setMaxDownloads(e.target.value)}
                  className="input-modern w-full px-3 py-2.5 rounded-xl text-xs"
                >
                  <option value={0}>Unlimited</option>
                  <option value={1}>1-Time Download</option>
                  <option value={3}>Max 3 Downloads</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Launch Room Now <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}