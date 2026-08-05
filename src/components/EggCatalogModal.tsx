import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASTER_EGGS } from '../utils/easterEggs';

interface EggCatalogModalProps {
  isOpen: boolean;
  discovered: string[];
  onClose: () => void;
}

export const EggCatalogModal: React.FC<EggCatalogModalProps> = ({ isOpen, discovered, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[360] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.85, y: 30, rotateX: 12, filter: 'blur(8px)' }}
          animate={{ scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          exit={{ scale: 0.9, y: 20, filter: 'blur(5px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          style={{ transformPerspective: 1000 }}
          onClick={(e) => e.stopPropagation()}
          className="relative glass-panel glass-panel-active rounded-2xl border-2 border-[#aff81a] p-5 sm:p-6 max-w-2xl w-full font-mono-tech shadow-[0_0_80px_rgba(175,248,26,0.3)]"
        >
          <div className="flex justify-between items-start border-b border-[#aff81a]/30 pb-3 mb-4">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#aff81a] flex items-center gap-2">
                <span className="material-symbols-outlined">menu_book</span>
                <span>EASTER EGG DIRECTORY</span>
              </h3>
              <p className="text-[10px] text-[#c2caae] mt-1 tracking-wider">
                CLASSIFIED DOSSIER · {discovered.length}/{EASTER_EGGS.length} SECRETS DISCOVERED · TYPE "EGG" TO REOPEN
              </p>
            </div>
            <button onClick={onClose} className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer shrink-0">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 egg-catalog-scroll overscroll-contain scroll-smooth [scrollbar-gutter:stable]">
            {EASTER_EGGS.map((egg, idx) => {
              const found = discovered.includes(egg.id);
              return (
                <motion.div
                  key={egg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.035 * idx, 0.24), duration: 0.3, ease: 'easeOut' }}
                  className={`transform-gpu flex gap-3 items-start rounded-xl border p-3 ${
                    found
                      ? 'border-[#aff81a]/60 bg-[#aff81a]/10'
                      : 'border-[#8c947a]/25 bg-[#140727]/70'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      found ? 'bg-[#aff81a]/20 text-[#aff81a]' : 'bg-[#26193a] text-[#8c947a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{egg.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-xs ${found ? 'text-[#e5ffb6]' : 'text-[#ecdcff]'}`}>
                        {egg.title}
                      </span>
                      {found ? (
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#aff81a] text-[#121f00] font-bold tracking-wider">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#26193a] text-[#8c947a] tracking-wider">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#c2caae]/90 leading-relaxed mt-1">{egg.description}</p>
                    <div className="text-[10px] text-[#8dcdff] mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">keyboard_arrow_right</span>
                      <span>{egg.activation}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#aff81a] text-[#121f00] font-bold rounded-lg hover:bg-[#a6ee00] shadow-[0_0_15px_#aff81a] cursor-pointer transition-all"
            >
              CLOSE DOSSIER
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
