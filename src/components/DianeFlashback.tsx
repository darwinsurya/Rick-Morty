import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';
import { FamilyPhoto } from './MemoryFrames';

interface DianeFlashbackProps {
  variant: 'memory-vial' | 'avatar';
  onClose: () => void;
}

export const DianeFlashback: React.FC<DianeFlashbackProps> = ({ variant, onClose }) => {
  useEffect(() => {
    if (variant === 'memory-vial') soundFX.playMusicBox();
    const duration = variant === 'memory-vial' ? 6500 : 3000;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [variant, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onClose}
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-[#07060f]/95 backdrop-blur-xl cursor-pointer"
      style={{ filter: 'saturate(0.4)' }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.8) 100%)' }}
      />

      <div className="relative max-w-md w-full text-center">
        {variant === 'memory-vial' && (
          <div className="text-[10px] font-mono-tech text-[#c2caae] tracking-[0.3em] mb-4 flicker-text">
            MEMORY VIAL #137 · CLASSIFIED
          </div>
        )}

        {/* Restored memory photograph */}
        <div
          className="relative overflow-hidden rounded-lg border-2 border-[#8c947a]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-[#19130f]"
          style={{ filter: 'sepia(0.35) saturate(0.6)' }}
        >
          <div className="h-44 sm:h-52 bg-[#14100c] p-3 flex items-center justify-center">
            <FamilyPhoto />
          </div>
          <div className="absolute bottom-2 right-3 text-[9px] font-mono-tech text-[#8c947a]/80 tracking-widest">
            SANCHES FAMILY · DIMENSION C-137
          </div>
        </div>

        {variant === 'memory-vial' ? (
          <>
            <p className="font-display text-lg sm:text-xl text-[#d8cfc0] italic mt-5 leading-relaxed">
              "Thanks... but I have everything I need."
            </p>
            <p className="font-mono-tech text-[10px] text-[#8c947a] mt-3 tracking-wider">
              — RICK C-137 · THE LAST DINNER BEFORE THE CRATER
            </p>
          </>
        ) : (
          <p className="font-mono-tech text-[10px] text-[#8c947a] mt-5 tracking-[0.3em]">
            MEMORY
          </p>
        )}
      </div>
    </motion.div>
  );
};
