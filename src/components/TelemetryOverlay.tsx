import React, { useState, useEffect } from 'react';
import { GalacticTheme } from '../types';

interface TelemetryOverlayProps {
  enabled: boolean;
  theme: GalacticTheme;
}

export const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({ enabled, theme }) => {
  const [telemetry, setTelemetry] = useState({
    frequency: 142.8593,
    coherence: 98.42,
    neutrinoFlux: 8942,
    latency: 0.024,
    entropy: 0.0031,
    hexCode: '0x7F90A2',
    packets: 1048576,
    subWavelength: 432.19,
    gravTether: -9.81,
  });

  // High-frequency telemetry update tick (120ms)
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        frequency: Number((142.85 + (Math.random() * 0.02 - 0.01)).toFixed(4)),
        coherence: Number((98.4 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        neutrinoFlux: Math.floor(8900 + Math.random() * 90),
        latency: Number((0.02 + Math.random() * 0.01).toFixed(3)),
        entropy: Number((0.003 + Math.random() * 0.001).toFixed(4)),
        hexCode: `0x${Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0')}`,
        packets: Math.floor(1048000 + Math.random() * 1200),
        subWavelength: Number((432.1 + Math.random() * 0.2).toFixed(2)),
        gravTether: Number((-9.81 + (Math.random() * 0.04 - 0.02)).toFixed(2)),
      }));
    }, 120);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  // Theme color accents
  const getThemeColors = () => {
    switch (theme) {
      case 'deep_space':
        return {
          text: 'text-[#8dcdff]',
          border: 'border-[#8dcdff]/40',
          glow: 'shadow-[0_0_12px_rgba(0,175,254,0.4)]',
          bar: 'bg-[#00affe]',
        };
      case 'cyber_magenta':
        return {
          text: 'text-[#ff77e9]',
          border: 'border-[#ff77e9]/40',
          glow: 'shadow-[0_0_12px_rgba(255,119,233,0.4)]',
          bar: 'bg-[#ff77e9]',
        };
      case 'citadel_matrix':
        return {
          text: 'text-[#00ffff]',
          border: 'border-[#00ffff]/40',
          glow: 'shadow-[0_0_12px_rgba(0,255,255,0.4)]',
          bar: 'bg-[#00ffff]',
        };
      case 'cronenberg_crimson':
        return {
          text: 'text-[#ff6b6b]',
          border: 'border-[#ff6b6b]/40',
          glow: 'shadow-[0_0_12px_rgba(255,107,107,0.4)]',
          bar: 'bg-[#ff5533]',
        };
      case 'quantum_nebula':
      default:
        return {
          text: 'text-[#aff81a]',
          border: 'border-[#aff81a]/40',
          glow: 'shadow-[0_0_12px_rgba(175,248,26,0.4)]',
          bar: 'bg-[#aff81a]',
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden font-mono-tech select-none">
      {/* Top Border Ticker Stream */}
      <div className={`hidden md:flex absolute top-0 left-0 right-0 h-6 bg-black/80 backdrop-blur-sm border-b ${colors.border} items-center justify-between px-3 text-[10px] ${colors.text} tracking-wider z-20`}>
        <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1 font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            LIVE TELEMETRY STREAM
          </span>
          <span>|</span>
          <span>FREQ: {telemetry.frequency} THz</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">COHERENCE: {telemetry.coherence}%</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">REGISTER: {telemetry.hexCode}</span>
          <span className="hidden lg:inline">|</span>
          <span className="hidden lg:inline">GRAV-TETHER: {telemetry.gravTether} m/s²</span>
          <span className="hidden lg:inline">|</span>
          <span className="hidden lg:inline">PACKETS: {telemetry.packets.toLocaleString()} B/s</span>
        </div>

        <div className="flex items-center gap-2 font-bold shrink-0">
          <span className="text-[9px] opacity-80">HF-OVERLAY :: ON</span>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
        </div>
      </div>

      {/* Right Edge Vertical Signal Spectrum */}
      <div className={`hidden 2xl:flex absolute right-4 top-28 bottom-20 w-28 flex-col justify-between p-2 text-[9px] ${colors.text} opacity-50 hover:opacity-100 transition-opacity border-l ${colors.border} bg-black/40 backdrop-blur-[1px] z-20`}>
        <div>
          <div className="font-bold border-b border-current/30 pb-0.5 mb-2 text-[10px] text-right">
            SIGNAL MATRIX
          </div>
          <div className="flex items-end justify-between h-24 gap-1 px-1">
            {[65, 88, 42, 95, 70, 83, 50, 92, 77].map((val, i) => (
              <div
                key={i}
                className={`w-full ${colors.bar} rounded-t transition-all duration-150`}
                style={{
                  height: `${Math.min(100, Math.max(15, val + (Math.random() * 30 - 15)))}%`,
                  opacity: 0.6 + (i % 3) * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-right space-y-0.5 text-[9px]">
          <div>WAVE: {telemetry.subWavelength} nm</div>
          <div>FLUX: {telemetry.neutrinoFlux} RPM</div>
          <div className="font-bold text-emerald-400">STATUS: SYNCED</div>
        </div>
      </div>

      {/* Bottom Border HUD Bar - Hidden on mobile to avoid covering mobile bottom nav bar */}
      <div className={`hidden md:flex absolute bottom-0 left-0 right-0 h-5 bg-black/80 backdrop-blur-sm border-t ${colors.border} items-center justify-between px-3 text-[9px] ${colors.text} tracking-wider z-20`}>
        <div className="flex items-center gap-3">
          <span>PORTAL_MATRIX_V4.2</span>
          <span>•</span>
          <span>CHRONO_LOCK: ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LATENCY: {telemetry.latency}ms</span>
          <span>•</span>
          <span>FPS: 60.0</span>
        </div>
      </div>
    </div>
  );
};
