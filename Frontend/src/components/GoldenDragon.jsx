import React from 'react';

export default function GoldenDragon() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Fast Flying Golden Dragon Entity */}
      <div className="dragon-fly-path absolute">
        <div className="dragon-wrapper">
          {/* Golden Fire Particle Aura */}
          <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full animate-pulse" />

          {/* Golden Dragon SVG with Articulated Wings & Fiery Trail */}
          <svg
            className="w-44 h-44 drop-shadow-[0_0_25px_rgba(251,191,36,0.9)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Golden Dragon Foil Gradient */}
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Flame Breath / Tail Glow */}
              <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dragon Serpentine Body */}
            <path
              d="M10,85 Q30,65 50,75 T80,50 Q85,40 75,30 Q65,25 60,35 Q50,45 40,35 Q30,25 20,40 Q15,55 5,75 Z"
              fill="url(#goldGradient)"
              className="dragon-body-wave"
            />

            {/* Glowing Golden Spines / Horns */}
            <path
              d="M75,25 L88,15 L78,32 L95,28 L82,40 L70,30 Z"
              fill="#fef08a"
              filter="drop-shadow(0 0 8px #fbbf24)"
            />

            {/* Radiant Ruby/Gold Eye */}
            <circle cx="82" cy="27" r="2.2" fill="#ef4444" filter="drop-shadow(0 0 5px #f87171)" />
            <circle cx="82" cy="27" r="1" fill="#fff" />

            {/* Left Majestic Wing (Flapping Animation) */}
            <g className="wing-left">
              <path
                d="M50,55 Q65,10 90,5 Q75,35 60,50 Q45,30 50,55 Z"
                fill="url(#goldGradient)"
                stroke="#fef08a"
                strokeWidth="1.2"
                opacity="0.95"
              />
              <path d="M50,55 L80,12 M55,52 L70,22" stroke="#fef08a" strokeWidth="0.8" />
            </g>

            {/* Right Wing (Back Depth) */}
            <g className="wing-right">
              <path
                d="M40,55 Q55,18 75,12 Q65,40 50,50 Z"
                fill="url(#goldGradient)"
                opacity="0.75"
              />
            </g>

            {/* Burning Fire Particle Tail */}
            <circle cx="8" cy="80" r="8" fill="url(#fireGlow)" className="animate-ping" style={{ animationDuration: '0.8s' }} />
            <circle cx="14" cy="74" r="5" fill="url(#fireGlow)" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* 2. Secondary Distant Dragon (Shadow Twin for 3D Depth) */}
      <div className="dragon-fly-path-2 absolute opacity-40 scale-75">
        <div className="dragon-wrapper">
          <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" viewBox="0 0 100 100" fill="none">
            <path
              d="M10,85 Q30,65 50,75 T80,50 Q85,40 75,30 Q65,25 60,35 Q50,45 40,35 Q30,25 20,40 Z"
              fill="#fbbf24"
            />
            <g className="wing-left">
              <path d="M50,55 Q65,10 90,5 Q75,35 60,50 Z" fill="#fef08a" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}