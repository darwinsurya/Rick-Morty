import React, { useState } from 'react';
import { soundFX } from '../utils/audio';

interface FooterProps {
  onOpenModal: (title: string, text: string) => void;
  onInitiateJump?: () => void;
  refillFluid?: () => void;
  fluidLevel?: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenModal,
  onInitiateJump,
  refillFluid,
  fluidLevel = 85,
}) => {
  const [pingTime, setPingTime] = useState<number>(0.4);

  const handlePing = () => {
    soundFX.playBleep();
    const newPing = parseFloat((Math.random() * 0.4 + 0.15).toFixed(2));
    setPingTime(newPing);
    soundFX.speak(`Telemetry ping confirmed. Latency ${newPing} milliseconds.`);
    onOpenModal(
      'Citadel Telemetry Matrix',
      `Sub-Space Relay Node C-137 Primary :: OPERATIONAL\nLatency: ${newPing}ms\nDimension Drift: 0.00014%\nGrav-Tether Lock: ACTIVE\nStatus: ALL SYSTEMS NOMINAL`
    );
  };

  const handleQuickRefill = () => {
    soundFX.playBleep();
    if (refillFluid) refillFluid();
    soundFX.speak('Portal fluid tank replenished to 100 percent.');
    onOpenModal(
      'Isotope 322 Refill Completed',
      'Portal gun reservoir has been recharged with 100% pure Isotope 322 fluid. All dimensional jump channels are unlocked.'
    );
  };

  const handleEmergencyExtraction = () => {
    soundFX.playPortalJump();
    soundFX.speak('Emergency extraction sequence engaged. Warping to Earth C-137.');
    if (onInitiateJump) {
      onInitiateJump();
    } else {
      onOpenModal(
        'Emergency Extraction Active',
        'Initiating immediate quantum tether warp back to Earth C-137 timeline.'
      );
    }
  };

  return (
    <footer className="w-full bg-[#140727]/90 backdrop-blur-xl border-t border-[#8c947a]/30 font-mono-tech text-[11px] text-[#ddfbff] relative z-30 py-4 px-4 md:px-10 mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.6)] pb-24 md:pb-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Node & Brand Info & Quick Fluid Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26193a] border border-[#8c947a]/40 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#aff81a] animate-pulse shadow-[0_0_8px_#aff81a]" />
            <span className="font-headline-md text-xs text-[#e5ffb6] font-bold tracking-wider">
              C-137 NODE
            </span>
          </div>

          <button
            onClick={handleQuickRefill}
            title="Click to refill portal fluid tank"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#190c2d] border border-[#00affe]/40 text-[#00affe] hover:bg-[#00affe]/20 transition-all cursor-pointer group text-[10px]"
          >
            <span className="material-symbols-outlined text-xs group-hover:scale-110">water_drop</span>
            <span>FLUID: <strong>{fluidLevel}%</strong> (REFILL)</span>
          </button>
        </div>

        {/* Center: Interactive Protocol Links */}
        <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs">
          <button
            onClick={() => {
              soundFX.playClick();
              soundFX.speak('Displaying Citadel Privacy Ciphers.');
              onOpenModal(
                'Privacy Protocol',
                'All interdimensional portal trajectories, mind-wipe logs, and memory vials are encrypted with 1024-bit Citadel Quantum Ciphers. The Council of Ricks reserves the right to monitor portal fluid usage across all timelines.'
              );
            }}
            className="text-[#c2caae]/70 hover:text-[#aff81a] hover:bg-[#aff81a]/10 px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-[#aff81a]/30"
          >
            <span className="material-symbols-outlined text-sm text-[#aff81a]">security</span>
            <span>Privacy Protocol</span>
          </button>

          <button
            onClick={handleEmergencyExtraction}
            className="text-[#ffb4ab] hover:bg-[#ffb4ab]/20 px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 border border-[#ffb4ab]/30 font-bold bg-[#ff9900]/10 shadow-[0_0_8px_rgba(255,180,171,0.2)]"
          >
            <span className="material-symbols-outlined text-sm text-[#ffb4ab] animate-pulse">warning</span>
            <span>Emergency Extraction</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              soundFX.speak('Lab Ethics Directive 4 0 4 loaded.');
              onOpenModal(
                'Lab Ethics',
                'Lab Ethics Directive #404: "What is ethics anyway? Don\'t think about it." - Rick Sanchez C-137. Microverse power harvesting is strictly for battery functionality and garage laser research.'
              );
            }}
            className="text-[#c2caae]/70 hover:text-[#8dcdff] hover:bg-[#8dcdff]/10 px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-[#8dcdff]/30"
          >
            <span className="material-symbols-outlined text-sm text-[#8dcdff]">science</span>
            <span>Lab Ethics</span>
          </button>
        </nav>

        {/* Right: Quantum Ping & System Status */}
        <div className="flex items-center gap-3 text-[10px] text-[#8c947a]">
          <button
            onClick={handlePing}
            title="Click to ping Citadel telemetry server"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#190c2d] border border-[#8c947a]/30 hover:border-[#aff81a] hover:text-[#aff81a] transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-xs text-[#aff81a] group-hover:rotate-180 transition-transform">
              cell_tower
            </span>
            <span>PING: {pingTime}ms</span>
          </button>

          <div className="tracking-wider text-center md:text-right text-[#c2caae]/80">
            © 2025 COUNCIL OF RICKS
          </div>
        </div>
      </div>
    </footer>
  );
};


