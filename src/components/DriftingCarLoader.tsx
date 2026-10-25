import React, { useEffect, useState, useCallback } from 'react';
import { Gauge, Zap, ChevronRight } from 'lucide-react';

interface DriftingCarLoaderProps {
  onFinish: () => void;
  minDurationMs?: number; // Target duration under 3s, default ~2100ms
}

export const DriftingCarLoader: React.FC<DriftingCarLoaderProps> = ({
  onFinish,
  minDurationMs = 2100,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const completeAndExit = useCallback(() => {
    setIsFadingOut(true);
    const exitTimer = setTimeout(() => {
      onFinish();
    }, 280);
    return () => clearTimeout(exitTimer);
  }, [onFinish]);

  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawPct = Math.min(100, Math.round((elapsed / (minDurationMs - 300)) * 100));
      setProgress(rawPct);

      if (elapsed < minDurationMs - 300) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        completeAndExit();
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    // Keyboard listener to skip with Escape or Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        completeAndExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [minDurationMs, completeAndExit]);

  return (
    <div
      role="dialog"
      aria-label="Loading screen"
      onClick={completeAndExit}
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-white text-slate-900 select-none overflow-hidden transition-opacity duration-300 ease-out cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Header / Branding */}
      <div className="pt-8 px-6 sm:px-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
            E
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Fuel Compatibility System
            </div>
            <div className="text-[11px] text-slate-400">
              Indian Automotive Powertrain Diagnostics
            </div>
          </div>
        </div>

        {/* Skip Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            completeAndExit();
          }}
          className="text-xs text-slate-400 hover:text-slate-900 font-medium px-3 py-1.5 rounded-full border border-slate-200/80 hover:border-slate-400 transition-all flex items-center gap-1 group bg-white/80"
        >
          <span>Skip</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Center Drifting Car Stage */}
      <div className="relative w-full flex flex-col justify-center items-center py-6">
        {/* Track Line / Road Surface */}
        <div className="w-full relative flex items-center">
          {/* Subtle asphalt road strip */}
          <div className="w-full h-1 bg-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-600/40 to-indigo-500/30 animate-skid-track" />
          </div>

          {/* Drifting tire skid marks */}
          <div className="absolute left-0 right-0 h-6 -top-3 pointer-events-none overflow-hidden opacity-35">
            <div className="w-full h-[2px] bg-slate-600/40 my-1 animate-skid-track" style={{ transformOrigin: '0% 50%' }} />
            <div className="w-full h-[2px] bg-slate-600/30 my-1.5 animate-skid-track" style={{ animationDelay: '0.1s', transformOrigin: '0% 50%' }} />
          </div>

          {/* The Drifting Car Element */}
          <div className="absolute -top-32 sm:-top-44 md:-top-52 left-0 w-full pointer-events-none overflow-visible">
            <div className="animate-car-drift inline-block relative">
              <div className="relative w-72 sm:w-[440px] md:w-[540px] aspect-[16/10] overflow-hidden mix-blend-multiply">
                <img
                  src="/assets/aistudio/62876b0187d2e50b2ff1cc86e0343d41_3e4027e7.jpg"
                  alt="Drifting performance vehicle"
                  className="w-full h-full object-cover scale-x-[-1] pointer-events-none select-none filter contrast-105"
                  style={{ objectPosition: 'center 65%' }}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              {/* Extra animated smoke particle wisps */}
              <div className="absolute left-8 bottom-6 w-16 h-8 bg-slate-400/20 rounded-full blur-md animate-ping pointer-events-none" />
              <div className="absolute left-16 bottom-8 w-24 h-12 bg-slate-300/30 rounded-full blur-lg pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Dynamic Speed & Calibrating Status */}
        <div className="mt-28 sm:mt-36 text-center space-y-1.5 z-10 px-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 tracking-wide uppercase">
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span>Calibrating Engine Database & Fuel Blends</span>
          </div>
          <div className="text-[12px] text-slate-500 font-mono">
            Checking 116+ Indian BS4/BS6 vehicles · IS 2796 standards
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Telemetry Indicator */}
      <div className="pb-10 px-6 sm:px-12 max-w-xl mx-auto w-full z-10">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>FAST LAUNCH</span>
          </div>
          <span className="font-bold text-slate-900 tabular-nums">{progress}%</span>
        </div>

        {/* Progress track */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-75 ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 text-center text-[11px] text-slate-400">
          Click anywhere or press Esc to enter immediately
        </div>
      </div>
    </div>
  );
};
