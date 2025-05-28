"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [filmReel, setFilmReel] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setFilmReel(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const filmStripFrames = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 text-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating film strips */}
        <div className="absolute top-20 left-10 rotate-12 opacity-10">
          <div className="flex gap-1">
            {filmStripFrames.map((frame) => (
              <div
                key={frame}
                className={`w-8 h-12 bg-slate-600 border border-slate-500 transition-all duration-200 ${
                  (filmReel + frame) % 3 === 0 ? 'bg-slate-500' : ''
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-32 right-16 -rotate-12 opacity-10">
          <div className="flex gap-1">
            {filmStripFrames.map((frame) => (
              <div
                key={frame}
                className={`w-8 h-12 bg-slate-600 border border-slate-500 transition-all duration-200 ${
                  (filmReel + frame + 1) % 3 === 0 ? 'bg-slate-500' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/20 to-slate-900/50"></div>
      </div>

      {/* Main content */}
      <div className={`relative max-w-2xl space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* 404 Display */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
          <h1 className="relative text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Movie reel icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={`w-24 h-24 border-8 border-slate-600 rounded-full flex items-center justify-center transition-transform duration-300 ${filmReel % 20 === 0 ? 'rotate-180' : ''}`}>
              <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
              {/* Film reel spokes */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-8 bg-slate-600 origin-bottom"
                  style={{
                    transform: `rotateZ(${i * 45}deg) translateY(-12px)`,
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Scene Not Found
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed max-w-lg mx-auto">
            Looks like this movie scene has been cut from the final edit. 
            The page you&apos;re looking for doesn&apos;t exist or has been moved to the director&apos;s cut.
          </p>
        </div>

        {/* Suggestions */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/" className="flex items-center gap-2">
                <span>🏠</span>
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Fun movie quotes */}
          <div className="mt-12 p-6 bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-700/50">
            <p className="text-slate-400 italic text-lg">
              &quot;I have a feeling we&apos;re not in Kansas anymore...&quot;
            </p>
            <p className="text-slate-500 text-sm mt-2">
              - Dorothy, The Wizard of Oz
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}