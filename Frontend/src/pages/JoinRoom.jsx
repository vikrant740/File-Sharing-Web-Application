import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { Users, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

export default function JoinRoom() {
  const navigate = useNavigate();
  const { joinRoom } = useWebRTC();
  const [roomCode, setRoomCode] = useState('');
  const [peerName, setPeerName] = useState('Member');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await joinRoom(roomCode.trim().toUpperCase(), peerName.trim(), password.trim());
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

        <div className="glass-panel p-8 rounded-3xl shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
            <Users className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold mb-1 text-slate-100">Join a Room</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Enter the 6-digit code shared by your peer to connect instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">Room Code</label>
              <input
                type="text"
                placeholder="e.g. 7F3K9Q"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="input-modern w-full px-4 py-3 rounded-xl text-center font-mono font-bold tracking-widest text-lg text-indigo-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">Your Name</label>
              <input
                type="text"
                value={peerName}
                onChange={e => setPeerName(e.target.value)}
                className="input-modern w-full px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">Room Password (If required)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Enter PIN if protected"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-modern w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Join Room Now <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}