import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, GalacticTheme } from '../types';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  fluidLevel: number;
  openSettings: () => void;
  openPower: () => void;
  onInitiateJump?: () => void;
  onAvatarEgg?: () => void;
  galacticTheme?: GalacticTheme;
  setGalacticTheme?: (theme: GalacticTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  fluidLevel,
  openSettings,
  openPower,
  onInitiateJump,
  onAvatarEgg,
  galacticTheme = 'quantum_nebula',
  setGalacticTheme,
}) => {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [avatarClicks, setAvatarClicks] = useState(0);

  const handleTabChange = (tab: NavTab) => {
    soundFX.playClick();
    setActiveTab(tab);
  };

  // Hidden easter egg: click the Rick avatar 7 times for a quiet memory flicker
  const handleAvatarClick = () => {
    const next = avatarClicks + 1;
    if (next >= 7) {
      setAvatarClicks(0);
      if (onAvatarEgg) onAvatarEgg();
    } else {
      setAvatarClicks(next);
    }
  };

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'portal_hub', label: 'Portal Hub', icon: 'csv' },
    { id: 'characters', label: 'Characters', icon: 'group' },
    { id: 'lab_notes', label: 'Lab Notes', icon: 'science' },
    { id: 'multiverse_map', label: 'Multiverse Map', icon: 'map' },
  ];

  const themeOptions: { id: GalacticTheme; name: string }[] = [
    { id: 'quantum_nebula', name: 'Quantum Nebula' },
    { id: 'deep_space', name: 'Deep Space Void' },
    { id: 'cyber_magenta', name: 'Cyber Magenta' },
    { id: 'citadel_matrix', name: 'Citadel Matrix' },
    { id: 'cronenberg_crimson', name: 'Cronenberg Crimson' },
  ];

  return (
    <>
      <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 md:top-6 left-0 right-0 w-full bg-[#190c2d]/85 backdrop-blur-xl border-b border-[#e5ffb6]/30 shadow-[0_4px_25px_rgba(175,248,26,0.15)] flex justify-between items-center px-3 sm:px-6 md:px-10 py-2.5 z-[100] transition-all"
    >
      {/* Brand Title */}
      <motion.div
        onClick={() => handleTabChange('portal_hub')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer font-display text-xl sm:text-2xl font-bold text-[#e5ffb6] drop-shadow-[0_0_12px_rgba(175,248,26,0.7)] flex items-center gap-2 select-none shrink-0"
      >
        <motion.span
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="material-symbols-outlined text-xl sm:text-2xl text-[#aff81a]"
        >
          auto_awesome
        </motion.span>
        <span>RICK-OS</span>
        <span className="hidden sm:inline-block text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#aff81a]/20 text-[#aff81a] border border-[#aff81a]/50 font-semibold shadow-[0_0_8px_rgba(175,248,26,0.3)]">
          C-137
        </span>
      </motion.div>

      {/* Desktop / Tablet Unified Navigation Links (mobile uses the bottom nav bar) */}
      <nav className="hidden md:flex items-center gap-1.5 font-mono-tech text-xs bg-[#140727]/80 p-1 rounded-xl border border-[#8c947a]/30 overflow-x-auto scrollbar-none max-w-[42vw] min-w-0 flex-shrink sm:max-w-[55vw] lg:max-w-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
              className={`relative px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'text-[#121f00] font-bold'
                  : 'text-[#c2caae] hover:text-[#e5ffb6] hover:bg-[#e5ffb6]/10'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeHeaderTab"
                  className="absolute inset-0 bg-[#aff81a] rounded-lg shadow-[0_0_15px_#aff81a] z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`material-symbols-outlined text-base sm:text-lg relative z-10 ${isActive ? 'text-[#121f00]' : 'text-[#aff81a]'}`}>
                {item.icon}
              </span>
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="relative z-10 text-[11px] sm:text-xs overflow-hidden inline-block"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Trailing Controls & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Quick Fluid Status */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#26193a]/90 border border-[#8dcdff]/40 text-xs font-mono-tech shadow-[0_0_10px_rgba(141,205,255,0.2)]"
        >
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="material-symbols-outlined text-sm text-[#aff81a]"
          >
            water_drop
          </motion.span>
          <span className="text-[#aff81a] font-bold">{fluidLevel}%</span>
        </motion.div>

        {/* Initiate Warp Jump Button */}
        {onInitiateJump && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundFX.playPortalJump();
              onInitiateJump();
            }}
            title="Initiate Warp Jump"
            className="hidden sm:flex p-2 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/50 hover:bg-[#ffb4ab] hover:text-[#690005] transition-all cursor-pointer items-center justify-center shadow-[0_0_10px_rgba(255,180,171,0.4)]"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </motion.button>
        )}

        {/* Galactic Theme Selector Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundFX.playClick();
              setShowThemeDropdown(!showThemeDropdown);
            }}
            title="Galactic Theme Backdrop"
            className="text-[#aff81a] hover:bg-[#aff81a]/20 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer border border-[#aff81a]/30 shadow-[0_0_10px_rgba(175,248,26,0.3)]"
          >
            <span className="material-symbols-outlined text-[18px]">palette</span>
          </motion.button>

          <AnimatePresence>
            {showThemeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-[#140727]/95 border border-[#aff81a]/50 rounded-xl p-2 shadow-[0_0_25px_rgba(175,248,26,0.4)] backdrop-blur-xl z-[150] font-mono-tech text-xs"
              >
                <div className="text-[10px] text-[#aff81a] font-bold pb-1 border-b border-[#8c947a]/30 mb-1.5 px-2 flex justify-between items-center">
                  <span>GALACTIC THEMES</span>
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                </div>
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      soundFX.playClick();
                      soundFX.speak(`Theme set to ${opt.name}`);
                      if (setGalacticTheme) setGalacticTheme(opt.id);
                      setShowThemeDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer mb-0.5 ${
                      galacticTheme === opt.id
                        ? 'bg-[#aff81a] text-[#121f00] font-bold'
                        : 'text-[#c2caae] hover:bg-[#aff81a]/15 hover:text-[#e5ffb6]'
                    }`}
                  >
                    <span>{opt.name}</span>
                    {galacticTheme === opt.id && (
                      <span className="material-symbols-outlined text-xs">check</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Settings */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 45 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            soundFX.playBleep();
            openSettings();
          }}
          title="System Settings"
          className="text-[#e5ffb6] hover:text-[#aff81a] hover:bg-[#e5ffb6]/15 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer border border-[#e5ffb6]/20"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </motion.button>

        {/* Emergency Power */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            soundFX.playError();
            openPower();
          }}
          title="Emergency Power / Purge"
          className="hidden sm:flex text-[#e5ffb6] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/15 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer border border-[#ffb4ab]/20"
        >
          <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
        </motion.button>

        {/* Rick Sanchez Avatar */}
        <motion.div
          onClick={handleAvatarClick}
          whileHover={{ scale: 1.15, rotate: 3 }}
          whileTap={{ scale: 0.92 }}
          title="Rick Sanchez (C-137)"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#aff81a] overflow-hidden shadow-[0_0_15px_rgba(175,248,26,0.6)] ml-0.5 relative cursor-pointer shrink-0"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88lIOUbSKpg3WJlhZ95DGxwynvEWzvuQWfgYH6PO2BeDQ0NPFsEZ0oPYGazZr5LlSI3XXL5W4RBcIoZuI0Njo2gphdr6wSdTPcE8L2OrTkfzeS53f0_Hvifwllj-ZqFhsmrvBOJEQMJop8bhOGPt9jTDblaCYmgcpebKqsO5SZzEtBo6AmjpAyWriCXAxkPJ-NmYcw4CYuvooratkhJ5GMtsirg21MJ6xzHbyDc9fRt7-8b3Po01j1A"
            alt="Rick Sanchez Avatar"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </motion.header>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[110] bg-[#190c2d]/95 backdrop-blur-xl border-t border-[#8c947a]/40 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <ul className="flex items-stretch justify-around max-w-lg mx-auto px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTabChange(item.id)}
                  title={item.label}
                  className={`w-full flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'text-[#e5ffb6]'
                      : 'text-[#c2caae] opacity-75 hover:opacity-100 hover:text-[#aff81a]'
                  }`}
                >
                  <span
                    className={`w-full flex items-center justify-center rounded-full py-1 transition-all ${
                      isActive
                        ? 'bg-[#aff81a] text-[#121f00] shadow-[0_0_14px_#aff81a]'
                        : 'text-inherit'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </span>
                  <span
                    className={`font-mono-tech text-[9px] font-bold tracking-wide ${
                      isActive ? 'text-[#e5ffb6]' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

