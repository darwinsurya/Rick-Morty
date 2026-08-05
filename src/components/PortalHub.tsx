import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DimensionInfo } from '../types';
import { soundFX } from '../utils/audio';
import { PortalFluidMonitor } from './PortalFluidMonitor';

interface PortalHubProps {
  currentDimension: DimensionInfo;
  targetDimension: DimensionInfo;
  allDimensions: DimensionInfo[];
  setTargetDimension: (dim: DimensionInfo) => void;
  fluidLevel: number;
  refillFluid: () => void;
  onInitiateJump: () => void;
  isJumping: boolean;
}

export const PortalHub: React.FC<PortalHubProps> = ({
  currentDimension,
  targetDimension,
  allDimensions,
  setTargetDimension,
  fluidLevel,
  refillFluid,
  onInitiateJump,
  isJumping,
}) => {
  const [portalMouseOffset, setPortalMouseOffset] = useState({ x: 0, y: 0 });
  const [activeGaugeTooltip, setActiveGaugeTooltip] = useState<string | null>(null);

  const handlePortalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    setPortalMouseOffset({ x, y });
  };

  const handlePortalMouseLeave = () => {
    setPortalMouseOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center min-h-[calc(100vh-180px)] my-auto relative z-10"
    >
      {/* Left HUD Panel: Stability */}
      <motion.div
        whileHover={{ rotateY: 8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="hidden lg:flex lg:col-span-3 flex-col gap-6 hud-panel-left h-[620px] justify-center cursor-default"
      >
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-[#8dcdff]/30 shadow-[0_0_25px_rgba(141,205,255,0.15)]">
          <div className="flex items-center gap-2 border-b border-[#8c947a]/30 pb-3">
            <span className="material-symbols-outlined text-[#8dcdff] animate-pulse">monitoring</span>
            <h2 className="font-headline-md text-xl text-[#8dcdff] font-bold tracking-wider">STABILITY</h2>
          </div>

          <div className="space-y-4 font-mono-tech text-xs">
            {/* Coherence gauge with hover details */}
            <div
              onMouseEnter={() => setActiveGaugeTooltip('coherence')}
              onMouseLeave={() => setActiveGaugeTooltip(null)}
              className="p-2 rounded-lg transition-colors hover:bg-[#8dcdff]/10 relative cursor-pointer"
            >
              <div className="flex justify-between text-[#c2caae] mb-1.5">
                <span>Coherence State</span>
                <span className="text-[#aff81a] flicker-text font-bold">
                  {currentDimension.coherence}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#3c2e50] rounded-full overflow-hidden p-0.5 border border-[#aff81a]/20">
                <motion.div
                  className="h-full bg-[#aff81a] rounded-full shadow-[0_0_12px_#aff81a]"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentDimension.coherence}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              {activeGaugeTooltip === 'coherence' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 -bottom-8 bg-[#140727] border border-[#aff81a] p-1.5 rounded text-[10px] text-[#e5ffb6] z-30 shadow-xl font-mono-tech text-center"
                >
                  Quantum Sub-Particle Alignment: Nominal
                </motion.div>
              )}
            </div>

            {/* Temporal Flux gauge */}
            <div
              onMouseEnter={() => setActiveGaugeTooltip('temporal')}
              onMouseLeave={() => setActiveGaugeTooltip(null)}
              className="p-2 rounded-lg transition-colors hover:bg-[#ffb4ab]/10 relative cursor-pointer"
            >
              <div className="flex justify-between text-[#c2caae] mb-1.5">
                <span>Temporal Flux</span>
                <span className="text-[#ffb4ab] font-bold">{currentDimension.temporalFlux}</span>
              </div>
              <div className="w-full h-2.5 bg-[#3c2e50] rounded-full overflow-hidden p-0.5 border border-[#ffb4ab]/20">
                <motion.div
                  className="h-full bg-[#ffb4ab] rounded-full shadow-[0_0_12px_#ffb4ab]"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentDimension.temporalFluxPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              {activeGaugeTooltip === 'temporal' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 -bottom-8 bg-[#140727] border border-[#ffb4ab] p-1.5 rounded text-[10px] text-[#ffb4ab] z-30 shadow-xl font-mono-tech text-center"
                >
                  Time Dilation Shift: Low Interference
                </motion.div>
              )}
            </div>

            <div className="pt-4 border-t border-[#8c947a]/30">
              <div className="font-mono-tech text-[11px] font-bold text-[#c2caae] mb-2 flex justify-between items-center">
                <span>TARGET DIMENSION</span>
                <span className="text-[10px] text-[#aff81a] animate-pulse">● READY</span>
              </div>
              <div className="font-display text-2xl text-[#aae3ea] tracking-widest font-bold flex items-center justify-between mb-3">
                <span>{targetDimension.code}</span>
                <span className="text-[#aff81a] text-sm font-mono-tech px-2 py-0.5 rounded bg-[#aff81a]/15 border border-[#aff81a]/30">
                  {targetDimension.name.split(' ')[0]}
                </span>
              </div>

              {/* Dimension Selector Dropdown with hover styling */}
              <div className="mt-2">
                <select
                  value={targetDimension.id}
                  onChange={(e) => {
                    soundFX.playClick();
                    const selected = allDimensions.find((d) => d.id === e.target.value);
                    if (selected) setTargetDimension(selected);
                  }}
                  className="w-full bg-[#140727] text-[#e5ffb6] border border-[#8dcdff]/50 rounded-lg px-3 py-2 text-xs font-mono-tech focus:outline-none focus:border-[#aff81a] cursor-pointer hover:border-[#aff81a] transition-all shadow-inner"
                >
                  {allDimensions.map((dim) => (
                    <option key={dim.id} value={dim.id} className="bg-[#190c2d] text-[#ecdcff]">
                      {dim.name} ({dim.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[10px] text-[#8c947a] mt-3 font-mono-tech flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-[#aff81a]">verified</span>
                  <span>COORDINATES LOCKED</span>
                </span>
                <span className="text-[#aae3ea]">
                  VARIANCE: <span className="text-[#aff81a] font-bold">{targetDimension.varianceIndex.toFixed(4)}</span>
                </span>
              </div>
              <div className="text-[10px] text-[#8c947a] mt-1.5 font-mono-tech flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${targetDimension.status === 'STABLE' ? 'bg-[#aff81a]' : 'bg-[#ffb4ab]'} animate-pulse`} />
                <span>TRAJECTORY: <span className="text-[#c2caae]">{targetDimension.status}</span></span>
                <span className="ml-auto">THREAT: <span className={targetDimension.threatLevel === 'Low' ? 'text-[#aff81a]' : 'text-[#ffb4ab]'}>{targetDimension.threatLevel}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Small readout widget: Grav-Tether */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-panel p-4 rounded-xl flex items-center justify-between border border-[#8c947a]/30"
        >
          <div className="font-mono-tech text-[11px] font-bold text-[#c2caae] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#aff81a]">anchor</span>
            GRAV-TETHER
          </div>
          <div className="flex gap-1.5">
            <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2.5 h-6 bg-[#aff81a] rounded-sm shadow-[0_0_8px_#aff81a]" />
            <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="w-2.5 h-6 bg-[#aff81a] rounded-sm shadow-[0_0_8px_#aff81a]" />
            <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="w-2.5 h-6 bg-[#aff81a] rounded-sm shadow-[0_0_8px_#aff81a]" />
            <div className="w-2.5 h-6 bg-[#3c2e50] rounded-sm" />
          </div>
        </motion.div>
      </motion.div>

      {/* Center: The Portal Hub */}
      <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center h-full relative z-10 py-6">
        {/* Interactive 3D Portal Container */}
        <motion.div
          onMouseMove={handlePortalMouseMove}
          onMouseLeave={handlePortalMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${portalMouseOffset.y * -0.6}deg) rotateY(${portalMouseOffset.x * 0.6}deg)`,
          }}
          className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center transition-transform duration-150 ease-out cursor-pointer group"
        >
          {/* Outer Rotating Energy Ring 1 */}
          <div className="absolute inset-0 rounded-full border-2 border-[#aff81a]/40 animate-[spin_20s_linear_infinite] group-hover:border-[#aff81a]" />
          {/* Middle Ring 2 */}
          <div className="absolute inset-4 rounded-full border border-[#00affe]/50 animate-[spin_15s_linear_infinite_reverse] group-hover:scale-105 transition-transform" />
          {/* Inner Ring 3 */}
          <div className="absolute inset-8 rounded-full border border-[#e5ffb6]/60 animate-[spin_10s_linear_infinite]" />

          {/* Core Portal Glow */}
          <motion.div
            animate={{
              scale: isJumping ? [1, 1.25, 1.1] : [1, 1.03, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute inset-10 rounded-full portal-glow bg-[#26193a]/70 overflow-hidden flex items-center justify-center transition-all duration-500 shadow-[0_0_60px_rgba(175,248,26,0.6)] group-hover:shadow-[0_0_90px_rgba(175,248,26,0.9)] ${
              isJumping ? 'scale-115 shadow-[0_0_120px_#aff81a]' : ''
            }`}
          >
            <div className="w-[170%] h-[170%] rounded-full portal-swirl bg-[radial-gradient(circle_at_center,rgba(175,248,26,0.95)_0%,rgba(0,175,254,0.45)_50%,transparent_80%)] filter blur-md" />
            {/* Pulsing White Core */}
            <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-white blur-xl opacity-90 animate-pulse" />
          </motion.div>

          {/* Floating UI Gateway Tag */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#302445]/90 border border-[#aff81a] px-5 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(175,248,26,0.5)] z-20 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#aff81a] animate-ping" />
            <span className="font-mono-tech text-[11px] text-[#aff81a] tracking-widest font-bold">
              GATEWAY ACTIVE: {currentDimension.code}
            </span>
          </motion.div>
        </motion.div>

        {/* Giant Interactive CTA Button */}
        <motion.button
          whileHover={{ scale: fluidLevel > 0 ? 1.08 : 1, y: -2 }}
          whileTap={{ scale: fluidLevel > 0 ? 0.94 : 1 }}
          onClick={() => {
            soundFX.playPortalJump();
            onInitiateJump();
          }}
          disabled={isJumping || fluidLevel <= 0}
          className={`mt-10 group relative px-10 md:px-14 py-4 rounded-full font-display text-xl md:text-2xl font-bold overflow-hidden transition-all shadow-[0_0_35px_rgba(175,248,26,0.6)] cursor-pointer select-none ${
            fluidLevel <= 0
              ? 'bg-[#3c2e50] text-[#c2caae] opacity-60 cursor-not-allowed shadow-none border border-[#8c947a]/30'
              : 'bg-[#aff81a] text-[#121f00] hover:bg-[#c6ff4d]'
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            {isJumping ? (
              <>
                <span>WARPING REALITY...</span>
                <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
              </>
            ) : fluidLevel <= 0 ? (
              <>
                <span>FLUID DEPLETED</span>
                <span className="material-symbols-outlined text-2xl">warning</span>
              </>
            ) : (
              <>
                <span>INITIATE JUMP</span>
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="material-symbols-outlined font-bold text-2xl"
                >
                  bolt
                </motion.span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 transition-opacity z-0" />
        </motion.button>

        {/* Subtitle Readout */}
        <div className="mt-5 text-center font-mono-tech text-xs text-[#c2caae] flex flex-wrap items-center justify-center gap-2 bg-[#140727]/60 px-4 py-1.5 rounded-full border border-[#8c947a]/30">
          <span>Current:</span>
          <span className="text-[#aff81a] font-bold">{currentDimension.name}</span>
          <span className="text-[#8c947a]">|</span>
          <span>Target:</span>
          <span className="text-[#8dcdff] font-bold">{targetDimension.name}</span>
        </div>

        {/* Mobile & Tablet Compact Controls (lg:hidden) */}
        <div className="lg:hidden w-full mt-6 bg-[#140727]/80 backdrop-blur-md p-4 rounded-2xl border border-[#aff81a]/30 space-y-4">
          <div className="flex justify-between items-center text-xs font-mono-tech">
            <span className="text-[#c2caae]">TARGET DIMENSION:</span>
            <select
              value={targetDimension.id}
              onChange={(e) => {
                soundFX.playClick();
                const selected = allDimensions.find((d) => d.id === e.target.value);
                if (selected) setTargetDimension(selected);
              }}
              className="bg-[#190c2d] text-[#aff81a] border border-[#aff81a]/50 rounded px-2.5 py-1 text-xs font-bold focus:outline-none"
            >
              {allDimensions.map((dim) => (
                <option key={dim.id} value={dim.id}>
                  {dim.name} ({dim.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#8c947a]/20 text-xs font-mono-tech">
            <div className="flex items-center gap-1.5 text-[#aff81a]">
              <span className="material-symbols-outlined text-sm">water_drop</span>
              <span>FLUID LEVEL: <strong>{fluidLevel}%</strong></span>
            </div>
            {fluidLevel < 100 && (
              <button
                onClick={() => {
                  soundFX.playBleep();
                  refillFluid();
                }}
                className="px-3 py-1 bg-[#aff81a]/20 border border-[#aff81a] text-[#aff81a] rounded hover:bg-[#aff81a] hover:text-[#121f00] font-bold transition-colors cursor-pointer text-[11px]"
              >
                REFILL ISOTOPE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right HUD Panel: Fluid Metrics */}
      <motion.div
        whileHover={{ rotateY: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="hidden lg:flex lg:col-span-3 flex-col gap-6 hud-panel-right h-[620px] justify-center cursor-default"
      >
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-[#aae3ea]/30 shadow-[0_0_25px_rgba(170,227,234,0.15)]">
          <div className="flex items-center gap-2 border-b border-[#8c947a]/30 pb-3 justify-end">
            <h2 className="font-headline-md text-xl text-[#aae3ea] font-bold tracking-wider">FLUID METRICS</h2>
            <span className="material-symbols-outlined text-[#aae3ea] animate-pulse">water_drop</span>
          </div>

          <div className="flex flex-col items-center gap-5 py-2">
            {/* Fluid Tank Visual with wobbling liquid & bubbles */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-36 h-52 border-2 border-[#aff81a]/50 rounded-b-3xl rounded-t-xl relative overflow-hidden bg-[#140727] shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_0_20px_rgba(175,248,26,0.2)]"
            >
              {/* Fluid fill */}
              <div
                className="absolute bottom-0 w-full bg-[linear-gradient(180deg,#aff81a_0%,#3b5600_100%)] shadow-[0_0_25px_#aff81a_inset] transition-all duration-700"
                style={{ height: `${fluidLevel}%` }}
              >
                {/* Surface Wave */}
                <div className="absolute -top-2 left-0 w-[200%] h-4 bg-white/40 blur-[1px] animate-[drift_2s_infinite_alternate]" />
                {/* Rising Isotope Bubbles */}
                <motion.div
                  animate={{ y: [0, -120], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-2 left-4 w-2.5 h-2.5 bg-white/70 rounded-full shadow-[0_0_5px_white]"
                />
                <motion.div
                  animate={{ y: [0, -140], opacity: [0, 1, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: 0.8 }}
                  className="absolute bottom-4 left-16 w-3.5 h-3.5 bg-white/50 rounded-full shadow-[0_0_8px_white]"
                />
                <motion.div
                  animate={{ y: [0, -100], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
                  className="absolute bottom-6 right-6 w-2 h-2 bg-white/80 rounded-full"
                />
              </div>

              {/* Tank Glass Glare Reflection */}
              <div className="absolute top-0 right-3 w-5 h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] skew-x-12 pointer-events-none" />
            </motion.div>

            <div className="w-full text-center font-mono-tech text-xs">
              <div className="text-[#aff81a] text-2xl font-bold mb-1 flicker-text drop-shadow-[0_0_10px_#aff81a]">
                {fluidLevel}% VOL
              </div>
              <div className="text-[#c2caae] text-[10px] font-semibold">
                {fluidLevel > 30 ? 'ISOTOPE CONCENTRATION: OPTIMAL' : '⚠️ WARNING: ISOTOPE DEPLETED'}
              </div>
            </div>

            {/* Refill Button if fluid low */}
            {fluidLevel < 100 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundFX.playBleep();
                  refillFluid();
                }}
                className="w-full py-2 bg-[#aff81a]/20 border-2 border-[#aff81a] text-[#aff81a] hover:bg-[#aff81a] hover:text-[#121f00] rounded-lg font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(175,248,26,0.3)] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                REFILL ISOTOPE FLUID
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Real-time Portal Fluid Usage & Trends Recharts Monitor */}
      <div className="col-span-1 lg:col-span-12 w-full">
        <PortalFluidMonitor
          fluidLevel={fluidLevel}
          refillFluid={refillFluid}
          onInitiateJump={onInitiateJump}
          isJumping={isJumping}
        />
      </div>
    </motion.div>
  );
};

