import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.25; // Smooth fast flight
      videoRef.current.play().catch(err => {
        console.warn('Autoplay prevented:', err);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07090e]">
      {/* 1. Fast Background Cyber Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 scale-105"
      >
        <source src="/bg-video.mp4.mp4" type="video/mp4" />
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* 2. Dark Vignette Overlay (Text & buttons clarity ke liye) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-[#07090e]/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07090e_85%)]" />
    </div>
  );
}