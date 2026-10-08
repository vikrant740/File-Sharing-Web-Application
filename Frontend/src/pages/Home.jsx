import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Zap, 
  Cloud, 
  Users, 
  ArrowRight, 
  Shield, 
  Lock, 
  Smartphone, 
  UploadCloud, 
  File, 
  CheckCircle2, 
  Laptop, 
  Radio, 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  Pause, 
  Play, 
  X, 
  HardDrive, 
  Share2, 
  Clock, 
  Send, 
  MessageSquare, 
  FileText, 
  Film, 
  Music, 
  Image as ImageIcon, 
  CheckCheck, 
  Wifi, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { roomCode, peers, createRoom, joinRoom, sendFile, transfers } = useWebRTC();

  const [quickCode, setQuickCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [historyTab, setHistoryTab] = useState('all'); // 'all' | 'sent' | 'received' | 'failed'
  
  // In-Room Live Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'System', text: 'Rahul joined the room', time: '2m ago', isSystem: true },
    { id: 2, sender: 'Aman', text: 'Hello! 👋', time: '1m ago', isSystem: false },
    { id: 3, sender: 'You', text: 'File transfer started.', time: '30s ago', isSystem: false, isYou: true },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Active Transfer State simulation
  const [isPaused, setIsPaused] = useState(false);

  const displayCode = roomCode || 'ABC-7X9';

  const copyCode = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickJoin = async (e) => {
    e.preventDefault();
    if (!quickCode.trim()) return alert('Please enter room code');
    try {
      await joinRoom(quickCode.trim().toUpperCase(), 'Raj', '');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateClick = async () => {
    try {
      await createRoom({ peerName: "Raj's Laptop", password: '', expiryMinutes: 60 });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'You', text: messageInput.trim(), time: 'Just now', isYou: true }
    ]);
    setMessageInput('');
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      createRoom({ peerName: "Raj's Laptop", password: '', expiryMinutes: 60 }).then(() => {
        sendFile(f);
        navigate('/dashboard');
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 fade-in text-slate-100">

      {/* =========================================================
          1. HERO ROW: HEADING + P2P DEVICE MESH + SCAN / SETTINGS
      ========================================================= */}
      <section className="w-full grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Direct WebRTC P2P Data Streaming
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1]">
            Serverless P2P <br />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              File Drop
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
            Share files directly between devices with zero cloud storage. Encrypted, blazing fast, and 100% private.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleCreateClick}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition hover:scale-105 cursor-pointer"
            >
              Create Room →
            </button>
            <button
              onClick={() => navigate('/join')}
              className="px-6 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition hover:scale-105 cursor-pointer"
            >
              <Users className="w-4 h-4" /> Join Room
            </button>
          </div>

          {/* Quick Join Capsule */}
          <form onSubmit={handleQuickJoin} className="pt-2 max-w-sm">
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl p-1.5 focus-within:border-blue-500 transition shadow-inner">
              <span className="pl-3 pr-2 text-slate-500 font-mono text-xs">🔗</span>
              <input
                type="text"
                placeholder="Enter room code (e.g. ABC-7X9)"
                value={quickCode}
                onChange={e => setQuickCode(e.target.value.toUpperCase())}
                className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none flex-1 font-mono tracking-wider"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                Join →
              </button>
            </div>
          </form>
        </div>

        {/* Center: Device Mesh Hologram (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl relative">
          <div className="w-full flex items-center justify-between px-2">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-1.5 shadow-lg shadow-blue-500/20">
                <Laptop className="w-8 h-8" />
              </div>
              <div className="text-xs font-bold text-slate-200">You</div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
              </div>
              <div className="text-[9px] text-slate-500 font-mono">(Raj's Laptop)</div>
            </div>

            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] font-bold text-blue-400 tracking-wider">P2P</span>
              <span className="text-[9px] text-slate-500 font-mono">WebRTC</span>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 via-teal-300 to-indigo-500 my-1 animate-pulse" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-1.5 shadow-lg shadow-indigo-500/20">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="text-xs font-bold text-slate-200">Friend</div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
              </div>
              <div className="text-[9px] text-slate-500 font-mono">(Aman's Phone)</div>
            </div>
          </div>
        </div>

        {/* Right: QR Scan Box & Room Settings (3 Cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2.5">
            <div className="text-[11px] font-bold text-slate-300">Scan to Join Room</div>
            <div className="p-2 bg-white rounded-2xl inline-block shadow-lg">
              <QRCodeSVG value={`${window.location.origin}/join?code=${displayCode}`} size={85} />
            </div>
            <div className="font-mono text-xs font-black text-blue-400 tracking-wider">{displayCode}</div>
            <button
              onClick={copyCode}
              className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 text-[11px]">Room Settings</div>
            <div className="space-y-1 text-[10px] text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-400" /> <span>Password Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-400" /> <span>Expires in 1 hour</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-3 h-3 text-purple-400" /> <span>Max Size: 5 GB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. MAIN TRANSFER STRIP & NETWORK QUALITY
      ========================================================= */}
      <section className="w-full grid lg:grid-cols-12 gap-6">
        {/* Dropzone & Active Progress (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl grid md:grid-cols-2 gap-6 items-center">
          {/* Dropzone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('heroInput').click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 bg-slate-950/40"
          >
            <input
              id="heroInput"
              type="file"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  createRoom({ peerName: "Raj's Laptop", password: '', expiryMinutes: 60 }).then(() => {
                    sendFile(f);
                    navigate('/dashboard');
                  });
                }
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-200">Drag & Drop files here</h3>
            <p className="text-[11px] text-slate-500">or</p>
            <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer">
              Choose Files
            </button>
            <span className="text-[10px] text-slate-500 pt-1">Supports all file types • Max size: 5 GB per file</span>
          </div>

          {/* Active File Card with Pause / Resume / Cancel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <File className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">project.zip</div>
                  <div className="text-[10px] text-slate-500">82 MB</div>
                </div>
              </div>
              <span className="font-mono text-blue-400 font-bold">72%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500 w-[72%] rounded-full" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>8.4 MB/s</span>
              <span>~ 12 sec left</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white cursor-pointer"
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Network Quality Card (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Network Quality</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">📶 100%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Excellent
              </span>
              <span className="text-[10px] text-slate-400 font-mono">4G / 5G / LAN</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Ping:</span>
                <span className="font-mono text-slate-200">24ms</span>
              </div>
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className="font-mono text-slate-200">WebRTC</span>
              </div>
              <div className="flex justify-between">
                <span>P2P:</span>
                <span className="font-mono text-blue-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. 4 FEATURE PILLS GRID
      ========================================================= */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap, title: 'P2P Connections', desc: 'Direct & Fast' },
          { icon: ShieldCheck, title: 'E2E Encryption', desc: 'Your Data, Your Control' },
          { icon: HardDrive, title: '0 Cloud Storage', desc: 'No Limits, No Middleman' },
          { icon: Smartphone, title: 'Multi-Device Support', desc: 'Mobile, PC, Tablet' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200">{item.title}</h4>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* =========================================================
          4. 3-COLUMN ACTIVITY ROW (Recent, Queue, Live Room Chat)
      ========================================================= */}
      <section className="w-full grid lg:grid-cols-12 gap-6 text-left">
        {/* Col 1: Recent Transfers (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Recent Transfers</span>
            <button onClick={() => navigate('/history')} className="text-blue-400 hover:underline text-[11px]">View All →</button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <File className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-bold text-slate-200">project.zip</div>
                  <div className="text-[10px] text-slate-500">82 MB • <span className="text-emerald-400">Completed</span></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">2 min ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <File className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-bold text-slate-200">image.png</div>
                  <div className="text-[10px] text-slate-500">2.4 MB • <span className="text-emerald-400">Completed</span></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">5 min ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-bold text-slate-200">video.mp4</div>
                    <div className="text-[10px] text-slate-500">120 MB</div>
                  </div>
                </div>
                <span className="text-[10px] text-blue-400 font-mono">78%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 w-[78%]" />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="font-bold text-slate-200">resume.pdf</div>
                  <div className="text-[10px] text-slate-500">1.2 MB • <span className="text-emerald-400">Completed</span></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">12 min ago</span>
            </div>
          </div>
        </div>

        {/* Col 2: Transfer Queue (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Transfer Queue</span>
            <span className="text-[10px] text-slate-500">3 active • 1 completed</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">project.zip (82 MB)</span>
                <span className="text-emerald-400 text-[10px]">100% ✓</span>
              </div>
              <div className="w-full h-1 bg-emerald-500 rounded-full" />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">video.mp4 (120 MB)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-purple-400 text-[10px] font-mono">64%</span>
                  <Pause className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[64%]" />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">source.zip (45 MB)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-[10px] font-mono">0%</span>
                  <Play className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button className="px-3 py-1 rounded-lg bg-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer">
                <Pause className="w-3 h-3" /> Pause All
              </button>
              <button className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-[10px] hover:bg-rose-500/20 flex items-center gap-1 cursor-pointer">
                <Trash2 className="w-3 h-3" /> Clear Queue
              </button>
            </div>
          </div>
        </div>

        {/* Col 3: Live Room & In-Room Collaboration Chat (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Live Room: {displayCode}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mb-3">3 Members Connected</div>

            {/* Chat Messages Feed */}
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-2 rounded-xl ${msg.isSystem ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px]' : msg.isYou ? 'bg-indigo-600/30 text-slate-200 ml-4' : 'bg-slate-950 text-slate-300 mr-4'}`}>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                    <span className="font-bold">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none flex-1 focus:border-blue-500"
            />
            <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* =========================================================
          5. HOW IT WORKS (3 STEPS STEPPER)
      ========================================================= */}
      <section className="w-full text-left space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-100 mb-1">How It Works</h2>
          <p className="text-xs text-slate-400">Get started in 3 simple steps and transfer files in seconds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {[
            { step: '1', title: 'Create Room', desc: 'Generate a unique room code and wait for your friend.' },
            { step: '2', title: 'Share Room Code', desc: 'Share the code with your friend to join the same room.' },
            { step: '3', title: 'Transfer Directly', desc: 'Start sharing files instantly via secure WebRTC.' },
          ].map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 text-center flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20">
                {s.step}
              </div>
              <h4 className="font-bold text-sm text-slate-200">{s.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          6. LOWER 4-COLUMN ROW (Preview, Multi-File, Speed, Collaboration)
      ========================================================= */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* Card 1: File Preview Grid */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-400" /> File Preview
          </div>
          <p className="text-[10px] text-slate-400">View files before downloading</p>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { icon: ImageIcon, label: 'Images', color: 'text-emerald-400' },
              { icon: FileText, label: 'PDF', color: 'text-rose-400' },
              { icon: Film, label: 'Video', color: 'text-purple-400' },
              { icon: Music, label: 'Audio', color: 'text-amber-400' },
            ].map((p, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <p.icon className={`w-5 h-5 mx-auto ${p.color}`} />
                <div className="text-[9px] text-slate-400">{p.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Multi-File Transfer */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-blue-400" /> Multi-File Transfer
          </div>
          <p className="text-[10px] text-slate-400">Send multiple files at once</p>
          <div className="space-y-1.5 text-[10px] text-slate-300 pt-1">
            <div className="flex justify-between">
              <span>project.zip</span>
              <span className="text-emerald-400 font-mono">100%</span>
            </div>
            <div className="flex justify-between">
              <span>docs.pdf</span>
              <span className="text-emerald-400 font-mono">100%</span>
            </div>
            <div className="flex justify-between">
              <span>image.png</span>
              <span className="text-blue-400 font-mono">64%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Transfer Speed Wave */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Transfer Speed
          </div>
          <div>
            <div className="text-xl font-black text-white">8.4 MB/s</div>
            <div className="text-[10px] text-slate-500 font-mono">82 MB / 120 MB • 68%</div>
          </div>
          <div className="h-10 w-full overflow-hidden opacity-80 pt-1">
            <svg viewBox="0 0 100 25" className="w-full h-full stroke-blue-400 fill-none" preserveAspectRatio="none">
              <path d="M0,15 Q25,2 50,15 T100,8" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 4: Room Chat Preview */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" /> Room Collaboration
          </div>
          <div className="space-y-1.5 text-[10px] text-slate-300">
            <div className="p-1.5 rounded-lg bg-slate-950">
              <span className="text-blue-400 font-bold">Aman: </span>Great! Received the file. 👍
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950">
              <span className="text-indigo-400 font-bold">You: </span>Check this out!
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="w-full py-1 text-center text-blue-400 text-[10px] font-bold hover:underline cursor-pointer">
            Open Chatroom →
          </button>
        </div>
      </section>

      {/* =========================================================
          7. BOTTOM 3-COLUMN SECURITY & PRO FEATURES
      ========================================================= */}
      <section className="w-full grid lg:grid-cols-12 gap-6 text-left">
        {/* Col 1: Security & Privacy (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="font-bold text-sm text-slate-200">Security & Privacy</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> End-to-end encryption (AES-256)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No data stored on our servers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Self-destructing rooms</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> File integrity check (SHA-256)</li>
            </ul>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        {/* Col 2: Transfer History (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Transfer History</span>
            <div className="flex gap-1 text-[10px]">
              {['all', 'sent', 'received'].map(t => (
                <button
                  key={t}
                  onClick={() => setHistoryTab(t)}
                  className={`px-2 py-0.5 rounded uppercase font-bold cursor-pointer ${historyTab === t ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-bold text-slate-200">project.zip</div>
                  <div className="text-[10px] text-slate-500">82 MB • <span className="text-blue-400">Sent</span></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Today, 10:24 AM ›</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="font-bold text-slate-200">resume.pdf</div>
                  <div className="text-[10px] text-slate-500">1.2 MB • <span className="text-emerald-400">Received</span></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Yesterday, 06:12 PM ›</span>
            </div>
          </div>
        </div>

        {/* Col 3: Advanced Features Pro (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Advanced Features</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">Pro</span>
          </div>

          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> QR Code Room Join</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Password Protected Rooms</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Room Expiry & Auto Delete</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Resume Interrupted Transfer</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> PWA - Install as App</li>
          </ul>
        </div>
      </section>

    </div>
  );
}