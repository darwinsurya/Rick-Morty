import React from 'react';
import { GalacticTheme } from '../types';
import { soundFX } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  scanlinesEnabled: boolean;
  setScanlinesEnabled: (val: boolean) => void;
  scanlineIntensity: number;
  setScanlineIntensity: (val: number) => void;
  telemetryEnabled: boolean;
  setTelemetryEnabled: (val: boolean) => void;
  galacticTheme: GalacticTheme;
  setGalacticTheme: (theme: GalacticTheme) => void;
  onRefillFluid: () => void;
  onResetSystem: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  audioEnabled,
  setAudioEnabled,
  scanlinesEnabled,
  setScanlinesEnabled,
  scanlineIntensity,
  setScanlineIntensity,
  telemetryEnabled,
  setTelemetryEnabled,
  galacticTheme,
  setGalacticTheme,
  onRefillFluid,
  onResetSystem,
}) => {
  if (!isOpen) return null;

  const handleHoverScrollVertical = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    if (!rect.height) return;
    const maxScrollTop = container.scrollHeight - container.clientHeight;
    if (maxScrollTop > 0) {
      const mouseY = e.clientY - rect.top;
      const ratioY = Math.max(0, Math.min(1, mouseY / rect.height));
      container.scrollTop = ratioY * maxScrollTop;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="glass-panel glass-panel-active p-6 rounded-xl max-w-md w-full font-mono-tech border border-[#8dcdff]/50 shadow-[0_0_40px_rgba(0,175,254,0.3)] animate-fadeIn">
        <div className="flex justify-between items-center border-b border-[#8dcdff]/30 pb-3 mb-4">
          <h3 className="font-headline-md text-xl text-[#8dcdff] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">settings</span>
            <span>SYSTEM CONFIGURATION</span>
          </h3>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div 
          onMouseMove={handleHoverScrollVertical}
          className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1 scrollbar-none"
        >
          {/* Live Telemetry Overlay Toggle */}
          <div className="flex justify-between items-center bg-[#140727]/80 p-3 rounded border border-[#8c947a]/20">
            <div>
              <div className="text-[#ecdcff] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#aff81a]">monitoring</span>
                Live Telemetry Overlay
              </div>
              <div className="text-[10px] text-[#c2caae]">High-frequency screen border numerical data stream</div>
            </div>
            <button
              onClick={() => {
                soundFX.playBleep();
                setTelemetryEnabled(!telemetryEnabled);
              }}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                telemetryEnabled ? 'bg-[#aff81a] text-[#121f00] shadow-[0_0_10px_#aff81a]' : 'bg-[#3c2e50] text-[#c2caae]'
              }`}
            >
              {telemetryEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Galactic Theme Selector */}
          <div className="bg-[#140727]/80 p-3 rounded border border-[#8c947a]/20 space-y-2">
            <div className="text-[#ecdcff] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#8dcdff]">palette</span>
              Galactic Visual Theme
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {[
                { id: 'quantum_nebula', name: '🌌 Quantum Nebula', color: 'border-[#aff81a]' },
                { id: 'deep_space', name: '✨ Deep Space', color: 'border-[#8dcdff]' },
                { id: 'cyber_magenta', name: '💥 Cyber Supernova', color: 'border-[#ff77e9]' },
                { id: 'citadel_matrix', name: '🌐 Citadel Matrix', color: 'border-[#00ffff]' },
                { id: 'cronenberg_crimson', name: '☣️ Cronenberg Crimson', color: 'border-[#ff5533]' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    soundFX.playClick();
                    setGalacticTheme(th.id as GalacticTheme);
                  }}
                  className={`p-2 rounded border text-left cursor-pointer transition-all ${
                    galacticTheme === th.id
                      ? `${th.color} bg-[#aff81a]/20 text-[#aff81a] font-bold shadow-md`
                      : 'border-[#8c947a]/30 text-[#c2caae] hover:bg-[#26193a]'
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          </div>

          {/* Audio FX Toggle */}
          <div className="flex justify-between items-center bg-[#140727]/80 p-3 rounded border border-[#8c947a]/20">
            <div>
              <div className="text-[#ecdcff] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#aae3ea]">volume_up</span>
                Audio Synthesizer FX
              </div>
              <div className="text-[10px] text-[#c2caae]">Portal jump sounds & telemetry beeps</div>
            </div>
            <button
              onClick={() => {
                const next = !audioEnabled;
                setAudioEnabled(next);
                soundFX.enabled = next;
                if (next) soundFX.playBleep();
              }}
              className={`px-3 py-1 rounded font-bold cursor-pointer ${
                audioEnabled ? 'bg-[#aff81a] text-[#121f00]' : 'bg-[#3c2e50] text-[#c2caae]'
              }`}
            >
              {audioEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* CRT Scanline Toggle & Aesthetic Intensity Slider */}
          <div className="bg-[#140727]/80 p-3 rounded border border-[#8c947a]/20 space-y-2.5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[#ecdcff] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-sm">tv</span>
                  HUD CRT Scanline Filter
                </div>
                <div className="text-[10px] text-[#c2caae]">Retro laboratory display scanlines</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#26193a] text-[#aff81a] font-mono-tech text-[10px] font-bold border border-[#aff81a]/30">
                  {scanlinesEnabled ? `${scanlineIntensity}%` : 'OFF'}
                </span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setScanlinesEnabled(!scanlinesEnabled);
                  }}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                    scanlinesEnabled ? 'bg-[#aff81a] text-[#121f00]' : 'bg-[#3c2e50] text-[#c2caae]'
                  }`}
                >
                  {scanlinesEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Aesthetic Scanline Intensity Slider */}
            {scanlinesEnabled && (
              <div className="pt-2 border-t border-[#8c947a]/20 space-y-1.5">
                <div className="flex justify-between text-[10px] text-[#c2caae] font-mono-tech">
                  <span>SCANLINE INTENSITY</span>
                  <span className="text-[#aff81a] font-bold">{scanlineIntensity}% OPACITY</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={scanlineIntensity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setScanlineIntensity(val);
                    if (!scanlinesEnabled) setScanlinesEnabled(true);
                  }}
                  className="w-full accent-[#aff81a] cursor-pointer h-1.5 bg-[#26193a] rounded-lg appearance-none"
                />
              </div>
            )}
          </div>

          {/* Emergency Isotope Refill */}
          <div className="bg-[#140727]/80 p-3 rounded border border-[#8c947a]/20 flex justify-between items-center">
            <div>
              <div className="text-[#ecdcff] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00affe] text-sm">local_gas_station</span>
                Isotope 322 Tank
              </div>
              <div className="text-[10px] text-[#c2caae]">Instant portal fluid replenish</div>
            </div>
            <button
              onClick={() => {
                soundFX.playBleep();
                onRefillFluid();
              }}
              className="px-3 py-1 bg-[#00affe] text-[#001e30] font-bold rounded hover:bg-[#8dcdff] cursor-pointer"
            >
              REFILL (100%)
            </button>
          </div>

          {/* Reset System State */}
          <div className="pt-2 border-t border-[#8c947a]/30 flex justify-between items-center">
            <span className="text-[#ffb4ab] text-[10px]">FACTORY PURGE C-137 STATE</span>
            <button
              onClick={() => {
                soundFX.playError();
                onResetSystem();
                onClose();
              }}
              className="px-3 py-1.5 bg-[#93000a] text-[#ffdad6] font-bold rounded hover:bg-[#ffb4ab] hover:text-[#690005] border border-[#ffb4ab]/30 cursor-pointer"
            >
              RESET RICK-OS
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#aff81a] text-[#121f00] font-bold rounded hover:bg-[#a6ee00] cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

