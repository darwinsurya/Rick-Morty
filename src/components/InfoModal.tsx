import React from 'react';
import { soundFX } from '../utils/audio';

interface InfoModalProps {
  title: string | null;
  text: string | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ title, text, onClose }) => {
  if (!title || !text) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="glass-panel glass-panel-active p-6 rounded-xl max-w-md w-full font-mono-tech border border-[#ddfbff]/50 shadow-[0_0_30px_rgba(221,251,255,0.2)] animate-fadeIn">
        <div className="flex justify-between items-center border-b border-[#ddfbff]/30 pb-3 mb-4">
          <h3 className="font-headline-md text-xl text-[#ddfbff] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#aff81a]">verified_user</span>
            <span>{title}</span>
          </h3>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="text-[#c2caae] hover:text-[#ffb4ab]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="font-body text-sm text-[#ecdcff] leading-relaxed my-4">
          {text}
        </p>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#ddfbff] text-[#00363b] font-bold text-xs rounded hover:bg-[#b3ecf3]"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
};
