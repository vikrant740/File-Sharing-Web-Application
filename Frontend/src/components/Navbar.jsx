import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ roomCode, onLeaveClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // LocalStorage se logged in user nikalne ke liye
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('filedrop_user') || 'null');
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('filedrop_token');
    localStorage.removeItem('filedrop_user');
    window.location.reload();
  };

  return (
    <nav className="w-full border-b border-white/5 dark:border-white/5 light:border-slate-200 bg-[#07090e]/80 dark:bg-[#07090e]/80 light:bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Brand Logo */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2.5 cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
          <Zap className="w-4 h-4 fill-white" />
        </div>
        <span className="font-black text-sm tracking-tight text-white light:text-slate-900">
          Serverless P2P
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400 light:text-slate-600">
        <button 
          onClick={() => navigate('/')} 
          className={`hover:text-white light:hover:text-slate-950 transition cursor-pointer ${location.pathname === '/' ? 'text-blue-400 font-bold' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`hover:text-white light:hover:text-slate-950 transition cursor-pointer ${location.pathname === '/dashboard' ? 'text-blue-400 font-bold' : ''}`}
        >
          Transfer
        </button>
        <button 
          onClick={() => navigate('/history')} 
          className={`hover:text-white light:hover:text-slate-950 transition cursor-pointer ${location.pathname === '/history' ? 'text-blue-400 font-bold' : ''}`}
        >
          History
        </button>
        <button 
          onClick={() => navigate('/create')} 
          className={`hover:text-white light:hover:text-slate-950 transition cursor-pointer ${location.pathname === '/create' ? 'text-blue-400 font-bold' : ''}`}
        >
          Rooms
        </button>
        <button 
          onClick={() => navigate('/settings')} 
          className={`hover:text-white light:hover:text-slate-950 transition cursor-pointer ${location.pathname === '/settings' ? 'text-blue-400 font-bold' : ''}`}
        >
          Settings
        </button>
        <button 
          onClick={() => navigate('/about')} 
          className={`hover:text-white light:hover:text-slate-950 transition cursor-pointer ${location.pathname === '/about' ? 'text-blue-400 font-bold' : ''}`}
        >
          About
        </button>
      </div>

      {/* Controls: WebRTC Ready Badge, Theme Switcher & Login/Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-800/60 light:bg-slate-200/80 hover:bg-slate-700/60 text-slate-300 light:text-slate-700 transition cursor-pointer border border-white/10 light:border-slate-300"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          )}
        </button>

        {/* WebRTC Ready Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          WebRTC Ready
        </div>

        {/* User Login / Profile Avatar */}
        {user ? (
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/20"
              title={user.name || user.email}
            >
              {(user.name ? user.name[0] : 'U').toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs cursor-pointer transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        )}

        {/* Leave Room Button */}
        {roomCode && (
          <button
            onClick={onLeaveClick}
            className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 cursor-pointer transition"
          >
            Leave
          </button>
        )}
      </div>
    </nav>
  );
}