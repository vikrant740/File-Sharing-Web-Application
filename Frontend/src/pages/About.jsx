import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  Globe, 
  Lock, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Laptop, 
  FileCode 
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-10 fade-in text-slate-100">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" /> Project Specification & Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          About <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Serverless P2P File Drop</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
          An ultra-secure, decentralized peer-to-peer file transfer engine engineered directly on the browser's WebRTC DataChannel standard.
        </p>
      </div>

      {/* 4 Pillars of Architecture */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap, title: 'Zero Cloud Storage', desc: 'No files are ever stored on or relayed through our database or servers.' },
          { icon: ShieldCheck, title: 'AES-256-GCM', desc: 'Military-grade end-to-end client-side cryptographic cipher.' },
          { icon: HardDrive, title: 'Chunked Streaming', desc: '64KB binary buffer chunks designed to handle huge 2GB+ files safely.' },
          { icon: Globe, title: 'Mesh NAT Traversal', desc: 'STUN/TURN automatic route optimization for worldwide low-latency transfer.' },
        ].map((item, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <item.icon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-200">{item.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* How the Protocol Works (Diagram Details) */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-400" /> How the P2P Protocol Works
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="font-bold text-blue-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
              Signaling Handshake (Socket.IO)
            </div>
            <p className="text-slate-400 text-xs">
              When a user generates or joins a 6-digit room, the Node.js signaling server only exchanges SDP Offers, Answers, and ICE candidates. No file bytes pass through this server.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="font-bold text-teal-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">2</span>
              Direct WebRTC Peer Connection
            </div>
            <p className="text-slate-400 text-xs">
              Once candidates agree on the shortest network path (LAN or WAN), a direct browser-to-browser tunnel opens. WebCrypto derives ephemeral AES-256 session keys.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="font-bold text-purple-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">3</span>
              Parallel Chunk Slicing & Auto-Download
            </div>
            <p className="text-slate-400 text-xs">
              Files are sliced into 64KB ArrayBuffers, encrypted, transmitted with congestion control, and immediately reconstructed into a Blob on the receiver side for one-click download.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span className="font-bold text-slate-200">Frontend: </span> React 18, Vite, Tailwind CSS, Lucide Icons
        </div>
        <div>
          <span className="font-bold text-slate-200">Signaling: </span> Node.js, Express, Socket.IO, MongoDB
        </div>
        <div>
          <span className="font-bold text-slate-200">Security: </span> Web Crypto API, AES-256-GCM, SHA-256
        </div>
      </div>
    </div>
  );
}