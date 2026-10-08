import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kuch galat hua, dobara koshish karein.');
      }

      // Save token and user details
      localStorage.setItem('filedrop_token', data.token);
      localStorage.setItem('filedrop_user', JSON.stringify(data.user));

      setSuccess(isLogin ? 'Login Safal Raha! Redirecting...' : 'Account Safalta-purvak ban gaya! Redirecting...');
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative z-10 py-10">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 dark:bg-[#0b0f19]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-slate-100 transition-all duration-300">
        
        {/* Header Tabs */}
        <div className="flex bg-slate-800/60 p-1.5 rounded-2xl mb-8 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isLogin 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" /> Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              !isLogin 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back to FileDrop' : 'Join Peer-to-Peer Network'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Enter your credentials to access secured rooms' : 'Create an encrypted decentralized account'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Aapka Naam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-700/60 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/60 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/60 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                {isLogin ? 'Login Now' : 'Create Free Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Decentralized End-to-End Encrypted Auth</span>
        </div>
      </div>
    </div>
  );
};

export default Login;