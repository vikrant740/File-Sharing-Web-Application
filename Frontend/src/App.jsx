import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebRTCProvider } from './context/WebRTCContext';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import RoomDashboard from './pages/RoomDashboard';
import TransferHistory from './pages/TransferHistory';
import Settings from './pages/Settings';
import About from './pages/About';
import Login from './pages/Login';

export default function App() {
  return (
    <ThemeProvider>
      <WebRTCProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#07090e] dark:bg-[#07090e] light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200">
            {/* Background Video Animation */}
            <AnimatedBackground />

            {/* Top Navbar */}
            <Navbar />

            {/* Main App Routes */}
            <div className="relative z-10 flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/join" element={<JoinRoom />} />
                <Route path="/dashboard" element={<RoomDashboard />} />
                <Route path="/history" element={<TransferHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>

            {/* Exact Screenshot Footer */}
            <footer className="relative z-10 border-t border-white/5 light:border-slate-200/60 py-6 px-6 text-xs text-slate-500 light:text-slate-600 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full transition-colors duration-200">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300 light:text-slate-800">⚡ Serverless P2P</span>
                <span>Fast • Secure • Private</span>
              </div>

              <div className="flex items-center gap-6 text-slate-400 light:text-slate-600">
                <a href="/" className="hover:text-white light:hover:text-slate-950">Home</a>
                <a href="/dashboard" className="hover:text-white light:hover:text-slate-950">Transfer</a>
                <a href="/history" className="hover:text-white light:hover:text-slate-950">History</a>
                <a href="/create" className="hover:text-white light:hover:text-slate-950">Rooms</a>
                <a href="/settings" className="hover:text-white light:hover:text-slate-950">Settings</a>
                <a href="/about" className="hover:text-white light:hover:text-slate-950">About</a>
                <a href="/login" className="hover:text-white light:hover:text-slate-950">Login</a>
              </div>

              <div className="text-[11px] text-slate-500 light:text-slate-600">
                Built with ❤️ using React + WebRTC | © 2025 Serverless P2P
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </WebRTCProvider>
    </ThemeProvider>
  );
}