import React from 'react';
import { motion } from 'motion/react';
import { NavTab } from '../types';
import { soundFX } from '../utils/audio';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onInitiateJump: () => void;
  fluidLevel: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onInitiateJump,
  fluidLevel,
}) => {
  const handleNav = (tab: NavTab) => {
    soundFX.playClick();
    setActiveTab(tab);
  };

  const items: { id: NavTab; label: string; icon: string }[] = [
    { id: 'portal_hub', label: 'Portal Hub', icon: 'csv' },
    { id: 'characters', label: 'Characters', icon: 'group' },
    { id: 'lab_notes', label: 'Lab Notes', icon: 'science' },
    { id: 'multiverse_map', label: 'Multiverse Map', icon: 'map' },
  ];

  return (
    <>
      {/* Desktop 3D Floating HUD Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        className="hidden md:flex flex-col items-center justify-between py-6 bg-[#26193a]/30 backdrop-blur-md font-mono-tech text-xs border border-[#8c947a]/40 shadow-[0_0_35px_rgba(0,175,254,0.2)] fixed left-6 top-1/2 -translate-y-1/2 rounded-full h-[580px] w-20 z-40 perspective-container"
      >
        {/* Top Scanner / Dimension Tooltip */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex flex-col items-center gap-1 group cursor-help relative mt-2"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#aff81a] overflow-hidden relative shadow-[0_0_15px_rgba(175,248,26,0.5)]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPWaUsYOESLy6tBrWg0dkD49AmD2rjtmIOoEfaCLGpKnJNmsewa0UDJtBJdTWypAC7qC6tvMfvr6JxSwzGl15kkf54A_-hn2cs6kWz7_NlBCaUXB6y1MpZL3uB6UCCMdItgjrDZARhC4hxduW8aPG-bJoZIM8023uCr1ZRzHZcwbulge2T_zRJGV538Gyq_UrJACFTyhx3aRw8-j04NqpKhzabzsRaWvF0I5iwtR1UzPJsthE-5uInPA"
              alt="C-137 Scanner"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Tooltip */}
          <div className="absolute left-20 bg-[#3c2e50] text-[#c2caae] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#aff81a]/40 font-mono-tech text-[10px] z-50 shadow-xl">
            DIMENSION C-137<br />
            PORTAL CHARGE: <span className="text-[#aff81a] font-bold">{fluidLevel}%</span>
          </div>
        </motion.div>

        {/* Center Nav Icons */}
        <nav className="flex flex-col gap-6 w-full items-center my-auto">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNav(item.id)}
                whileHover={{ scale: 1.25, x: 2 }}
                whileTap={{ scale: 0.9 }}
                title={item.label}
                className={`p-3.5 rounded-full flex items-center justify-center transition-all duration-300 group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#aff81a] text-[#121f00] shadow-[0_0_20px_#aff81a]'
                    : 'text-[#c2caae] hover:text-[#aff81a] hover:bg-[#aff81a]/10'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                <span className="absolute left-16 bg-[#302445] text-[#e5ffb6] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#e5ffb6]/30 pointer-events-none text-xs font-mono-tech z-50 shadow-lg">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Initiate Jump Rocket Button */}
        <motion.div className="mb-2">
          <motion.button
            whileHover={{ scale: 1.2, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundFX.playPortalJump();
              onInitiateJump();
            }}
            title="INITIATE JUMP"
            className="w-12 h-12 rounded-full bg-[#ffb4ab] text-[#690005] flex items-center justify-center hover:bg-[#ff5449] hover:text-white transition-all shadow-[0_0_20px_rgba(255,180,171,0.6)] group relative cursor-pointer"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            <span className="absolute left-16 bg-[#93000a] text-[#ffdad6] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#ffb4ab]/30 font-mono-tech text-[10px] font-bold pointer-events-none z-50 shadow-xl">
              INITIATE WARP JUMP
            </span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#26193a]/95 backdrop-blur-xl border-t border-[#8c947a]/40 z-50 pb-safe">
        <ul className="flex justify-around items-center p-2">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNav(item.id)}
                  className={`flex flex-col items-center p-1.5 ${
                    isActive ? 'text-[#e5ffb6]' : 'text-[#c2caae] opacity-70'
                  }`}
                >
                  <div
                    className={`px-3 py-1 rounded-full mb-0.5 transition-all ${
                      isActive ? 'bg-[#aff81a] text-[#121f00] shadow-[0_0_12px_#aff81a]' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <span className="font-mono-tech text-[9px] font-bold">{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

