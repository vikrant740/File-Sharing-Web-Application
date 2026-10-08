import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { aiAssistant } from '../services/aiAssistant';
import FilePreviewModal from '../components/FilePreviewModal';
import AnalyticsWidget from '../components/AnalyticsWidget';
import { 
  Cloud, 
  UploadCloud, 
  Users, 
  Copy, 
  Check, 
  File, 
  LogOut, 
  QrCode, 
  Settings, 
  History, 
  Files, 
  UserX, 
  Search,
  Sparkles,
  Gauge,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

function formatBytes(bytes) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function RoomDashboard() {
  const navigate = useNavigate();
  const { 
    roomCode, 
    role, 
    peers, 
    transfers, 
    history, 
    branding, 
    speedLimitMBps, 
    setSpeedLimitMBps, 
    leaveRoom, 
    kickPeer, 
    changePeerRole, 
    sendFile 
  } = useWebRTC();

  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFiles, setPreviewFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  if (!roomCode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center fade-in">
        <p className="text-slate-400 mb-4">No active session found.</p>
        <button onClick={() => navigate('/')} className="btn-primary px-6 py-2.5 text-white rounded-xl text-xs font-bold">
          Go to Home
        </button>
      </div>
    );
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFilesChosen = (files) => {
    const list = Array.from(files);
    setPreviewFiles(list);
    setShowPreview(true);
  };

  const filteredTransfers = Object.entries(transfers).filter(([_, tr]) => {
    return aiAssistant.matchesSearch(tr, searchQuery);
  });

  return (
    <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6 fade-in">
      {/* File Preview Modal */}
      <FilePreviewModal
        files={previewFiles}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirmSend={(files) => files.forEach(f => sendFile(f))}
      />

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 rounded-3xl glass-panel p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] text-indigo-400 font-bold uppercase">{branding}</div>
              <div className="font-mono text-xl font-black text-indigo-400">{roomCode}</div>
            </div>
            <button onClick={copyCode} className="p-2 hover:bg-indigo-600/20 rounded-lg text-indigo-400">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Bandwidth Limiter Slider */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Speed Limit
              </span>
              <span className="font-mono text-indigo-400 font-bold">
                {speedLimitMBps === 0 ? 'Max' : `${speedLimitMBps} MB/s`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={speedLimitMBps}
              onChange={e => setSpeedLimitMBps(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <nav className="space-y-1.5">
            <button className="btn-primary w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white">
              <Files className="w-4 h-4" /> Files & Hub
            </button>
            <button onClick={() => navigate('/history')} className="btn-secondary w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 cursor-pointer">
              <History className="w-4 h-4" /> Transfer History
            </button>
            <button onClick={() => navigate('/settings')} className="btn-secondary w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 cursor-pointer">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>
        </div>

        <button
          onClick={() => { leaveRoom(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-bold cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Leave Room
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6">
        {/* Top Search & Room Bar */}
        <div className="glass-panel p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Smart Search by name or AI summary..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-modern w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              Role: {role}
            </span>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 badge-online" />
              {peers.length + 1} Connected
            </div>
          </div>
        </div>

        {/* Upload Zone & Telemetry */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files) handleFilesChosen(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById('dashInput').click()}
              className="border-2 border-dashed border-slate-800 bg-slate-900/40 hover:border-indigo-500/50 rounded-3xl p-10 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[260px]"
            >
              <input
                id="dashInput"
                type="file"
                multiple
                className="hidden"
                onChange={e => e.target.files && handleFilesChosen(e.target.files)}
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-1">Drag files here or click to preview & send</h3>
              <p className="text-xs text-slate-400 mb-4">AI content extraction & E2E Encrypted</p>
              <button className="btn-primary px-5 py-2 rounded-xl text-white text-xs font-bold">
                Select Files
              </button>
            </div>

            {/* Live Transfers with AI Summary */}
            {filteredTransfers.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Files & AI Insights
                </h4>
                <div className="space-y-3">
                  {filteredTransfers.map(([id, tr]) => (
                    <div key={id} className="p-4 rounded-2xl border border-white/5 bg-slate-950/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <File className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold truncate">{tr.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold">
                            {tr.category || 'File'}
                          </span>
                        </div>
                        <div className="font-mono text-slate-400">{tr.speed} • {tr.progress}%</div>
                      </div>

                      {tr.summary && (
                        <p className="text-[11px] text-slate-400 italic bg-white/5 p-2 rounded-lg">
                          🤖 {tr.summary}
                        </p>
                      )}

                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${tr.status === 'completed' ? 'bg-emerald-500' : 'progress-shimmer'}`}
                          style={{ width: `${tr.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-Time Telemetry & Graph Widget */}
            <AnalyticsWidget history={history} />
          </div>

          {/* Right Granular RBAC Participants */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace Members ({peers.length + 1})
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
                <span>You ({role})</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              {peers.map(p => (
                <div key={p.id} className="p-3 rounded-xl border border-white/5 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">[{p.role || 'Member'}]</span>
                  </div>

                  {role === 'Admin' && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <select
                        value={p.role || 'Member'}
                        onChange={e => changePeerRole(p.id, e.target.value)}
                        className="bg-slate-900 text-[10px] rounded px-1.5 py-0.5 border border-white/10"
                      >
                        <option value="Manager">Manager</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer (Read-only)</option>
                      </select>
                      <button onClick={() => kickPeer(p.id)} className="text-rose-400 text-[10px] hover:underline">
                        Kick
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}