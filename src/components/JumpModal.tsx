import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DimensionInfo } from '../types';
import { DinnerTableFrame } from './MemoryFrames';

interface JumpModalProps {
  targetDimension: DimensionInfo;
}

// 1-in-20 jump flashback: during warp, briefly flicker to the last dinner in D-137
const FLICKER_ODDS = 0.05;
const FLICKER_IN_MS = 950;
const FLICKER_DURATION_MS = 550;

export const JumpModal: React.FC<JumpModalProps> = ({ targetDimension }) => {
  // Rolled once per mount (fresh on every jump) so the egg is rare and re-playable
  const [flickerRolled] = useState(() => Math.random() < FLICKER_ODDS);
  const [showFlicker, setShowFlicker] = useState(false);

  useEffect(() => {
    if (!flickerRolled) return;
    const t1 = setTimeout(() => setShowFlicker(true), FLICKER_IN_MS);
    const t2 = setTimeout(() => setShowFlicker(false), FLICKER_IN_MS + FLICKER_DURATION_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [flickerRolled]);

  return (
    <div className="fixed inset-0 bg-[#140727]/95 backdrop-blur-2xl z-[300] flex flex-col items-center justify-center p-6 text-center animate-fadeIn overflow-hidden">
      {/* Hyperspace Vortex Graphic */}
      <div className="relative w-48 h-48 sm:w-80 sm:h-80 md:w-96 md:h-96 mb-8 flex items-center justify-center max-w-full">
        {/* Outer Swirl Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-[#aff81a] animate-[spin_3s_linear_infinite] shadow-[0_0_50px_#aff81a]" />
        <div className="absolute inset-4 rounded-full border-2 border-[#8dcdff] animate-[spin_2s_linear_infinite_reverse]" />

        {/* Swirling Core */}
        <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(175,248,26,1)_0%,rgba(0,175,254,0.8)_50%,transparent_80%)] animate-pulse filter blur-md" />
        <div className="absolute w-40 h-40 bg-white rounded-full blur-2xl opacity-90 animate-ping" />

        {/* Warp Rays */}
        <div className="absolute inset-0 bg-[repeating-conic-gradient(#aff81a_0_15deg,transparent_15deg_30deg)] opacity-30 animate-[spin_1s_linear_infinite]" />
      </div>

      <div className="space-y-3 font-mono-tech max-w-lg z-10">
        <span className="px-3 py-1 rounded bg-[#aff81a]/20 text-[#aff81a] border border-[#aff81a]/40 text-xs font-bold tracking-widest animate-pulse">
          INTERDIMENSIONAL WARP ACTIVE
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#e5ffb6] drop-shadow-[0_0_20px_#aff81a]">
          WARPING TO {targetDimension.code}
        </h2>
        <p className="text-sm text-[#aae3ea] font-semibold">
          Target: {targetDimension.name} | Coherence Matrix Recalibrating...
        </p>

        <div className="w-full h-3 bg-[#302445] rounded-full overflow-hidden border border-[#aff81a]/40 mt-4">
          <div className="h-full bg-gradient-to-r from-[#00affe] via-[#aff81a] to-[#e5ffb6] animate-[pulse_0.5s_infinite] w-full" />
        </div>
        <p className="text-[10px] text-[#c2caae] tracking-wider">
          PLEASE HOLD ONTO YOUR MORTY. SPATIAL DILATION IN PROGRESS...
        </p>
      </div>

      {/* 1-in-20 Memory Flicker: the last dinner, half a second, then the warp continues */}
      <AnimatePresence>
        {showFlicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.09 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0806]/90 pointer-events-none"
          >
            <div className="relative w-full max-w-md px-6" style={{ filter: 'sepia(0.45) saturate(0.55) contrast(1.05)' }}>
              <div className="rounded-lg overflow-hidden border border-[#8c947a]/40 bg-[#19130f] shadow-[0_0_80px_rgba(0,0,0,0.95)]">
                <div className="h-40 sm:h-48 bg-[#14100c] p-3 flex items-center justify-center">
                  <DinnerTableFrame />
                </div>
              </div>
              <div className="mt-3 font-mono-tech text-[10px] text-[#d8cfc0]/70 tracking-[0.3em]">
                MEMORY FRAGMENT · D-137 · UNCLASSIFIED
              </div>
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
