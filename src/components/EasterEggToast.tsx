import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface EggFlash {
  key: number;
  title: string;
  message: string;
  icon: string;
  accent: string;
  tint?: boolean;
}

interface EasterEggToastProps {
  flash: EggFlash | null;
  onClose: () => void;
}

export const EasterEggToast: React.FC<EasterEggToastProps> = ({ flash, onClose }) => {
  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(onClose, 3800);
    return () => clearTimeout(timer);
  }, [flash, onClose]);

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key={flash.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-[#07060f]/80 backdrop-blur-sm cursor-pointer"
        >
          {flash.tint && (
            <motion.div
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.6, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${flash.accent}55 0%, transparent 72%)` }}
            />
          )}

          <motion.div
            initial={{ scale: 0.7, y: 30, rotateX: 15, filter: 'blur(6px)' }}
            animate={{ scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.85, y: 18, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ transformPerspective: 900, borderColor: flash.accent }}
            className="relative glass-panel glass-panel-active rounded-2xl border-2 p-6 max-w-md w-full text-center shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${flash.accent}`,
                boxShadow: `0 0 24px ${flash.accent}66`,
                color: flash.accent,
              }}
            >
              <span className="material-symbols-outlined text-3xl">{flash.icon}</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color: flash.accent }}>
              {flash.title}
            </h2>
            <p className="font-mono-tech text-xs sm:text-sm text-[#d8cfc0]/90 leading-relaxed">{flash.message}</p>

            <div className="mt-4 font-mono-tech text-[9px] text-[#8c947a] tracking-[0.3em]">
              CLICK ANYWHERE TO DISMISS
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
