import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { soundFX } from '../utils/audio';

interface FluidDataPoint {
  time: string;
  fluidLevel: number;
  consumptionRate: number;
  jumpsRemaining: number;
}

interface PortalFluidMonitorProps {
  fluidLevel: number;
  refillFluid: () => void;
  onInitiateJump: () => void;
  isJumping: boolean;
}

export const PortalFluidMonitor: React.FC<PortalFluidMonitorProps> = ({
  fluidLevel,
  refillFluid,
  onInitiateJump,
  isJumping,
}) => {
  const [history, setHistory] = useState<FluidDataPoint[]>(() => {
    // Generate initial historical trend
    const now = new Date();
    const initial: FluidDataPoint[] = [];
    let lvl = 100;
    for (let i = 6; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 45000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initial.push({
        time: timeStr,
        fluidLevel: lvl,
        consumptionRate: Math.round((100 - lvl) * 0.4),
        jumpsRemaining: Math.floor(lvl / 15),
      });
      lvl = Math.max(fluidLevel, lvl - Math.floor(Math.random() * 8 + 2));
    }
    // Set current point
    initial[initial.length - 1].fluidLevel = fluidLevel;
    initial[initial.length - 1].jumpsRemaining = Math.floor(fluidLevel / 15);
    return initial;
  });

  const [autoSimulate, setAutoSimulate] = useState(false);

  // Update history whenever fluidLevel prop changes (e.g. after jump or refill)
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.fluidLevel === fluidLevel) return prev;
      const newPoint: FluidDataPoint = {
        time: timeStr,
        fluidLevel,
        consumptionRate: last ? Math.max(0, last.fluidLevel - fluidLevel) : 0,
        jumpsRemaining: Math.floor(fluidLevel / 15),
      };
      const updated = [...prev, newPoint];
      if (updated.length > 12) updated.shift();
      return updated;
    });
  }, [fluidLevel]);

  // Periodic ambient telemetry tick when autoSimulate is active
  useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory((prev) => {
        const lastLvl = prev[prev.length - 1]?.fluidLevel ?? 85;
        const newLvl = Math.max(0, lastLvl - 2);
        const newPoint: FluidDataPoint = {
          time: timeStr,
          fluidLevel: newLvl,
          consumptionRate: 2,
          jumpsRemaining: Math.floor(newLvl / 15),
        };
        const updated = [...prev, newPoint];
        if (updated.length > 12) updated.shift();
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSimulate]);

  const remainingJumps = Math.floor(fluidLevel / 15);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: FluidDataPoint = payload[0].payload;
      return (
        <div className="bg-[#140727]/95 border border-[#aff81a] p-3 rounded-xl shadow-[0_0_20px_rgba(175,248,26,0.4)] backdrop-blur-md text-xs font-mono-tech z-50">
          <div className="text-[#aff81a] font-bold border-b border-[#8c947a]/30 pb-1 mb-1.5 flex justify-between items-center">
            <span>TIMESTAMP: {label}</span>
            <span className="material-symbols-outlined text-xs">water_drop</span>
          </div>
          <div className="space-y-1">
            <div className="text-[#ecdcff]">
              Fluid Level: <span className="text-[#aff81a] font-bold">{data.fluidLevel}%</span>
            </div>
            <div className="text-[#c2caae]">
              Est. Jumps Left: <span className="text-[#aae3ea] font-bold">{data.jumpsRemaining}</span>
            </div>
            <div className="text-[#c2caae]">
              Consumption Rate: <span className="text-[#ffb4ab] font-bold">-{data.consumptionRate}%/min</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-[#aff81a]/30 shadow-[0_0_30px_rgba(175,248,26,0.15)] bg-[#140727]/90 mt-8 relative overflow-hidden font-mono-tech"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-[#8c947a]/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#aff81a]/15 border border-[#aff81a]/40 flex items-center justify-center text-[#aff81a]">
            <span className="material-symbols-outlined text-xl animate-pulse">monitoring</span>
          </div>
          <div>
            <h3 className="font-headline-md text-base sm:text-lg text-[#aff81a] font-bold tracking-wider flex items-center gap-2">
              PORTAL FLUID CONSUMPTION MONITOR
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#aff81a]/20 border border-[#aff81a]/50 text-[#aff81a]">
                REALTIME RECHARTS
              </span>
            </h3>
            <p className="text-[11px] text-[#c2caae]">
              Tracking interdimensional isotope decay & warp jump consumption trends
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              soundFX.playClick();
              setAutoSimulate(!autoSimulate);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              autoSimulate
                ? 'bg-[#aff81a] text-[#121f00] border-[#aff81a]'
                : 'bg-[#190c2d] text-[#c2caae] border-[#8c947a]/40 hover:border-[#aff81a] hover:text-[#aff81a]'
            }`}
          >
            <span className={`material-symbols-outlined text-sm ${autoSimulate ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{autoSimulate ? 'LIVE STREAMING' : 'START SIMULATION'}</span>
          </button>

          {fluidLevel < 100 && (
            <button
              onClick={() => {
                soundFX.playBleep();
                refillFluid();
              }}
              className="px-3 py-1.5 bg-[#aff81a]/20 border border-[#aff81a] text-[#aff81a] hover:bg-[#aff81a] hover:text-[#121f00] rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(175,248,26,0.3)]"
            >
              <span className="material-symbols-outlined text-sm">water_drop</span>
              <span>REFILL ISOTOPE</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#190c2d]/80 p-3 rounded-xl border border-[#aff81a]/30">
          <div className="text-[10px] text-[#c2caae] uppercase mb-1">CURRENT LEVEL</div>
          <div className="text-xl sm:text-2xl font-bold text-[#aff81a] flex items-baseline gap-1">
            <span>{fluidLevel}%</span>
            <span className="text-xs font-normal text-[#8c947a]">VOL</span>
          </div>
        </div>

        <div className="bg-[#190c2d]/80 p-3 rounded-xl border border-[#8dcdff]/30">
          <div className="text-[10px] text-[#c2caae] uppercase mb-1">ESTIMATED WARPS</div>
          <div className="text-xl sm:text-2xl font-bold text-[#8dcdff] flex items-baseline gap-1">
            <span>{remainingJumps}</span>
            <span className="text-xs font-normal text-[#8c947a]">Jumps</span>
          </div>
        </div>

        <div className="bg-[#190c2d]/80 p-3 rounded-xl border border-[#ffb4ab]/30">
          <div className="text-[10px] text-[#c2caae] uppercase mb-1">CONSUMPTION PER JUMP</div>
          <div className="text-xl sm:text-2xl font-bold text-[#ffb4ab]">
            15% <span className="text-xs font-normal text-[#8c947a]">/ warp</span>
          </div>
        </div>

        <div className="bg-[#190c2d]/80 p-3 rounded-xl border border-[#e5ffb6]/30">
          <div className="text-[10px] text-[#c2caae] uppercase mb-1">FLUID STATUS</div>
          <div className="text-sm font-bold flex items-center gap-1.5 mt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-ping ${
                fluidLevel > 30 ? 'bg-[#aff81a]' : 'bg-[#ff0055]'
              }`}
            />
            <span className={fluidLevel > 30 ? 'text-[#aff81a]' : 'text-[#ff0055]'}>
              {fluidLevel > 30 ? 'STABLE' : 'CRITICAL LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Alert Banner if Low */}
      {fluidLevel <= 30 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-[#ff0055]/15 border border-[#ff0055] rounded-xl text-xs text-[#ff5588] flex items-center justify-between gap-3 font-mono-tech"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg animate-bounce">warning</span>
            <span>
              <strong>PORTAL FLUID DEPLETION IMMINENT!</strong> Refill isotope fluid to prevent interdimensional stranding.
            </span>
          </div>
          <button
            onClick={() => {
              soundFX.playBleep();
              refillFluid();
            }}
            className="px-3 py-1 bg-[#ff0055] text-white rounded font-bold hover:bg-[#ff3377] transition-colors shrink-0 text-[11px]"
          >
            QUICK REFILL
          </button>
        </motion.div>
      )}

      {/* Recharts Area Chart */}
      <div className="w-full h-56 sm:h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="portalFluidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#aff81a" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#aff81a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#8c947a" opacity={0.2} />
            <XAxis
              dataKey="time"
              stroke="#c2caae"
              fontSize={10}
              tickLine={false}
              dy={5}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#c2caae"
              fontSize={10}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={30} stroke="#ff0055" strokeDasharray="4 4" label={{ value: 'LOW THRESHOLD (30%)', fill: '#ff0055', fontSize: 9, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="fluidLevel"
              stroke="#aff81a"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#portalFluidGrad)"
              activeDot={{ r: 6, fill: '#aff81a', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
