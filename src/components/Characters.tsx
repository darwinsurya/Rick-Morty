import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { soundFX } from '../utils/audio';

interface CharactersProps {
  characters: Character[];
  onAddCharacter: (char: Character) => void;
  onDeleteCharacter?: (id: string) => void;
}

export const Characters: React.FC<CharactersProps> = ({
  characters,
  onAddCharacter,
  onDeleteCharacter,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCharId, setSelectedCharId] = useState<string>(
    characters[0]?.id || 'rick-c137'
  );
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectChar, setInspectChar] = useState<Character | null>(null);
  const [imageLightboxChar, setImageLightboxChar] = useState<Character | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'stats' | 'quotes' | 'gear' | 'associates'>('stats');
  const [activeQuoteBubble, setActiveQuoteBubble] = useState<string | null>(null);


  // New character form state
  const [newName, setNewName] = useState('');
  const [newDim, setNewDim] = useState('Dimension X-99');
  const [newDesc, setNewDesc] = useState('');
  const [newSpecies, setNewSpecies] = useState('Humanoid Variant');
  const [newIntel, setNewIntel] = useState(80);
  const [newChaos, setNewChaos] = useState(60);

  // 3D Hover Tilt State
  const [tiltState, setTiltState] = useState<{
    id: string | null;
    rx: number;
    ry: number;
    px: number;
    py: number;
  }>({
    id: null,
    rx: 0,
    ry: 0,
    px: 50,
    py: 50,
  });

  // Character Navigator Filmstrip refs
  const railRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);

  // Keep the active thumbnail centered in the navigator rail
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [selectedCharId, viewMode]);

  const handleScrollRail = (direction: number) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.6, behavior: 'smooth' });
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, charId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 18;
    const rotateY = ((x - centerX) / centerX) * 18;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setTiltState({
      id: charId,
      rx: rotateX,
      ry: rotateY,
      px: percentX,
      py: percentY,
    });
  };

  const handleCardMouseLeave = () => {
    setTiltState({
      id: null,
      rx: 0,
      ry: 0,
      px: 50,
      py: 50,
    });
  };

  const filteredCharacters = characters.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dimension.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.species && c.species.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectCharacter = (char: Character, index: number) => {
    soundFX.playClick();
    setSelectedCharId(char.id);
    setCurrentIndex(index);
    setInspectChar(char);
  };

  const handleHoverScrollHorizontal = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    if (!rect.width) return;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (maxScrollLeft > 0) {
      const mouseX = e.clientX - rect.left;
      const ratioX = Math.max(0, Math.min(1, mouseX / rect.width));
      container.scrollLeft = ratioX * maxScrollLeft;
    }
  };

  const [activeFilter, setActiveFilter] = useState<'all' | 'rick' | 'morty' | 'citadel' | 'custom'>('all');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Keyboard navigation support for desktop arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAddModal || inspectChar || imageLightboxChar) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredCharacters, showAddModal, inspectChar, imageLightboxChar]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext(); // Swipe left -> Next
      } else {
        handlePrev(); // Swipe right -> Prev
      }
    }
    setTouchStartX(null);
  };

  const categoryFiltered = filteredCharacters.filter((c) => {
    if (activeFilter === 'rick') return c.name.toLowerCase().includes('rick');
    if (activeFilter === 'morty') return c.name.toLowerCase().includes('morty');
    if (activeFilter === 'citadel') return c.dimension.toLowerCase().includes('citadel') || c.dimension.toLowerCase().includes('c-137');
    if (activeFilter === 'custom') return c.id.startsWith('custom-') || c.id.startsWith('char-') || c.id.startsWith('clone-');
    return true;
  });

  const activeChar = categoryFiltered[currentIndex] || categoryFiltered[0] || characters[0];


  const handleNext = () => {
    soundFX.playClick();
    if (filteredCharacters.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredCharacters.length;
    setCurrentIndex(nextIdx);
    if (filteredCharacters[nextIdx]) {
      setSelectedCharId(filteredCharacters[nextIdx].id);
    }
  };

  const handlePrev = () => {
    soundFX.playClick();
    if (filteredCharacters.length === 0) return;
    const prevIdx =
      (currentIndex - 1 + filteredCharacters.length) % filteredCharacters.length;
    setCurrentIndex(prevIdx);
    if (filteredCharacters[prevIdx]) {
      setSelectedCharId(filteredCharacters[prevIdx].id);
    }
  };

  const handleCreateRandomChar = () => {
    soundFX.playBleep();
    const prefixes = [
      'Pickle',
      'Toxic',
      'Wasp',
      'Evil',
      'Cyber',
      'Doofus',
      'Ghost',
      'Alien',
      'Cronenberg',
      'Quantum',
      'Mecha',
    ];
    const names = [
      'Rick',
      'Morty',
      'Summer',
      'Beth',
      'Jerry',
      'Noob-Noob',
      'Krombopulos',
      'Squanchy',
      'Birdperson',
    ];
    const dims = [
      'J-19ζ7',
      'C-137-B',
      'Dimension 35-C',
      'Z-400',
      'Dimension K-83',
      'GZ-505',
      'C-500A',
    ];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomDim = dims[Math.floor(Math.random() * dims.length)];
    const fullCharName = `${randomPrefix} ${randomName}`;

    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: fullCharName,
      dimension: randomDim,
      description: `Discovered variant in reality ${randomDim}. Unpredictable behavior patterns detected by C-137 telemetry scans.`,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDFIfJB6Zy-sHHGW5diUeLjbiuW43vBTkqM7ZSCEACouPvX1VwMbqu2oKKrcMtKC1PRBKsyD1qKpLGbIt1hcXxnm-yTXORGyk1Z_AgVe_f6_a7J1LAtKtU_xoiei5K6m5cAXNsLyzH5PnEfsTklRtbXCpRTuGKpn_yZdG1r8zA1u0hFzWmLjZFhDIw9gvHfHqnCmpWILa-QHHu68vM68xVsK__NeQOuOhgwmJ8m6L0nhNFSrxU25jTvXQ',
      imageAlt: `${fullCharName} interdimensional hologram`,
      intelligence: Math.floor(Math.random() * 80) + 20,
      chaosLevel: Math.floor(Math.random() * 90) + 10,
      status: 'Alive',
      species: 'Variant',
    };

    onAddCharacter(newChar);
    setSelectedCharId(newChar.id);
    setCurrentIndex(filteredCharacters.length);
    setInspectChar(newChar);
  };

  const handleCloneCharacter = (char: Character) => {
    soundFX.playBleep();
    const clonedChar: Character = {
      ...char,
      id: `clone-${Date.now()}`,
      name: `${char.name} (Clone ${Math.floor(Math.random() * 90 + 10)})`,
      dimension: `${char.dimension}-CLONE`,
    };
    onAddCharacter(clonedChar);
    setSelectedCharId(clonedChar.id);
    setInspectChar(clonedChar);
  };

  const handleDeleteCurrentChar = (id: string) => {
    soundFX.playClick();
    if (onDeleteCharacter) {
      onDeleteCharacter(id);
    }
    setInspectChar(null);
  };

  const handleSaveCustomChar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    soundFX.playBleep();
    const newChar: Character = {
      id: `custom-${Date.now()}`,
      name: newName,
      dimension: newDim || 'C-137',
      description: newDesc || 'Classified interdimensional biological specimen.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDFIfJB6Zy-sHHGW5diUeLjbiuW43vBTkqM7ZSCEACouPvX1VwMbqu2oKKrcMtKC1PRBKsyD1qKpLGbIt1hcXxnm-yTXORGyk1Z_AgVe_f6_a7J1LAtKtU_xoiei5K6m5cAXNsLyzH5PnEfsTklRtbXCpRTuGKpn_yZdG1r8zA1u0hFzWmLjZFhDIw9gvHfHqnCmpWILa-QHHu68vM68xVsK__NeQOuOhgwmJ8m6L0nhNFSrxU25jTvXQ',
      imageAlt: `${newName} Hologram`,
      intelligence: newIntel,
      chaosLevel: newChaos,
      status: 'Alive',
      species: newSpecies || 'Humanoid',
    };

    onAddCharacter(newChar);
    setSelectedCharId(newChar.id);
    setShowAddModal(false);
    setInspectChar(newChar);
    setNewName('');
    setNewDesc('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl mx-auto min-h-[calc(100vh-180px)] flex flex-col items-center justify-start relative py-6"
    >
      {/* Top Header / Action Controls */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6 z-10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#e5ffb6] drop-shadow-[0_0_12px_rgba(175,248,26,0.6)] flex items-center gap-3">
            <span>Holographic Database</span>
            <span className="material-symbols-outlined text-2xl text-[#aff81a] animate-pulse">groups</span>
          </h1>
          <p className="font-mono-tech text-xs text-[#c2caae] mt-1">
            INTERDIMENSIONAL BEINGS & MULTIVERSE VARIANTS ({characters.length} LOGGED)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              placeholder="Search variants, dimensions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full bg-[#140727]/90 border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-1.5 pl-9 text-xs font-mono-tech focus:outline-none focus:border-[#aff81a] transition-all"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[#8dcdff]">
              search
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-[#140727] p-1 rounded-lg border border-[#8c947a]/30">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundFX.playClick();
                setViewMode('carousel');
              }}
              title="3D Hologram Carousel"
              className={`px-2.5 py-1 rounded text-xs font-mono-tech flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'carousel'
                  ? 'bg-[#aff81a] text-[#121f00] font-bold shadow-[0_0_10px_#aff81a]'
                  : 'text-[#c2caae] hover:text-[#aff81a]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_carousel</span>
              <span className="hidden sm:inline">3D</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundFX.playClick();
                setViewMode('grid');
              }}
              title="Specimen Gallery Grid"
              className={`px-2.5 py-1 rounded text-xs font-mono-tech flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#aff81a] text-[#121f00] font-bold shadow-[0_0_10px_#aff81a]'
                  : 'text-[#c2caae] hover:text-[#aff81a]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span className="hidden sm:inline">Grid</span>
            </motion.button>
          </div>

          {/* Create Custom Variant Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundFX.playClick();
              setShowAddModal(true);
            }}
            className="px-3.5 py-1.5 bg-[#26193a] text-[#aff81a] border border-[#aff81a]/50 hover:bg-[#aff81a]/20 font-mono-tech text-xs rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Add Custom</span>
          </motion.button>

          {/* Discover Random Variant */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRandomChar}
            title="Scan & Discover Random Variant"
            className="px-3.5 py-1.5 bg-[#a6ee00] text-[#476800] hover:bg-[#aff81a] font-mono-tech text-xs rounded-lg font-bold transition-all shadow-[0_0_12px_#aff81a] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base animate-spin">auto_awesome</span>
            <span>Discover</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Category Filter Bar */}
      <div 
        onMouseMove={handleHoverScrollHorizontal}
        className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none font-mono-tech text-xs border-b border-[#8c947a]/20"
      >
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'ALL VARIANTS' },
            { id: 'rick', label: 'RICKS' },
            { id: 'morty', label: 'MORTYS' },
            { id: 'citadel', label: 'CITADEL / C-137' },
            { id: 'custom', label: 'CUSTOMS & CLONES' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFX.playClick();
                setActiveFilter(cat.id as any);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                activeFilter === cat.id
                  ? 'bg-[#aff81a] text-[#121f00] font-bold border-[#aff81a] shadow-[0_0_10px_#aff81a]'
                  : 'bg-[#140727]/80 text-[#c2caae] border-[#8c947a]/30 hover:border-[#aff81a] hover:text-[#aff81a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-[10px] text-[#8dcdff] font-mono-tech shrink-0 hidden sm:block">
          HOVER OR SWIPE TO NAVIGATE
        </div>
      </div>

      {/* Character Navigator Filmstrip */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleScrollRail(-1)}
            title="Scroll characters left"
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#140727]/90 border border-[#aff81a]/50 text-[#aff81a] flex items-center justify-center hover:bg-[#aff81a] hover:text-[#121f00] transition-all cursor-pointer shadow-lg z-10"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </motion.button>

          <div
            ref={railRef}
            className="flex-1 overflow-x-auto scrollbar-none scroll-smooth flex items-center gap-2 px-1.5 py-1.5 bg-[#140727]/80 backdrop-blur-md rounded-2xl border border-[#aff81a]/30 shadow-lg snap-x snap-mandatory"
          >
            {categoryFiltered.map((char, index) => {
              const isSelected = activeChar?.id === char.id;
              return (
                <button
                  key={char.id}
                  ref={isSelected ? activeThumbRef : undefined}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedCharId(char.id);
                    setCurrentIndex(index);
                  }}
                  className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 border snap-center ${
                    isSelected
                      ? 'bg-[#aff81a]/10 border-[#aff81a] shadow-[0_0_15px_rgba(175,248,26,0.4)]'
                      : 'bg-[#190c2d]/60 border-[#8c947a]/20 hover:border-[#aff81a]/50 hover:bg-[#26193a]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCharThumb"
                      className="absolute inset-0 rounded-xl bg-[#aff81a]/25 border border-[#aff81a]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border shrink-0 ${isSelected ? 'border-[#aff81a] ring-2 ring-[#aff81a]' : 'border-[#8c947a]/40'}`}>
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black ${char.status === 'Alive' ? 'bg-[#aff81a]' : 'bg-[#ff5555]'}`} />
                  </div>
                  <div className="text-left font-mono-tech min-w-0">
                    <div className={`text-xs font-bold whitespace-nowrap ${isSelected ? 'text-[#aff81a]' : 'text-[#ecdcff]'}`}>
                      {char.name.length > 14 ? char.name.slice(0, 14) + '…' : char.name}
                    </div>
                    <div className="text-[9px] text-[#8c947a] whitespace-nowrap">{char.dimension}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleScrollRail(1)}
            title="Scroll characters right"
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#140727]/90 border border-[#aff81a]/50 text-[#aff81a] flex items-center justify-center hover:bg-[#aff81a] hover:text-[#121f00] transition-all cursor-pointer shadow-lg z-10"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </motion.button>
        </div>

        {/* Navigator Position Meter */}
        <div className="flex items-center justify-between gap-3 mt-2 px-1 font-mono-tech text-[10px] text-[#8c947a]">
          <span className="text-[#aff81a] font-bold truncate">
            ACTIVE: {activeChar?.name || 'NO VARIANT'}
          </span>
          <span className="shrink-0">
            {currentIndex + 1} / {categoryFiltered.length}
          </span>
        </div>
      </div>

      {/* Mode 1: Responsive Spotlight View (Carousel / Hero Deck) */}
      {viewMode === 'carousel' && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full relative my-2 font-mono-tech"
        >
          {categoryFiltered.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center max-w-md mx-auto my-8">
              <span className="material-symbols-outlined text-4xl text-[#ffb4ab] mb-2">warning</span>
              <p className="text-[#ecdcff] mb-4">No variants match "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 bg-[#aff81a] text-[#121f00] rounded font-bold text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : activeChar ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChar.id}
                initial={{ opacity: 0, x: 90, rotateY: -28, scale: 0.88, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -90, rotateY: 28, scale: 0.88, filter: 'blur(6px)' }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
                style={{ transformPerspective: 1400 }}
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
              {/* Left Column: Heroic Spotlight Card */}
              <div className="col-span-1 lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-sm sm:max-w-md glass-panel rounded-2xl p-5 border-2 border-[#aff81a] shadow-[0_0_40px_rgba(175,248,26,0.3)] bg-[#140727]/95">
                  {/* Prev / Next Touch & Click Arrows Floating on Card */}
                  <button
                    onClick={handlePrev}
                    title="Previous Variant (Left Arrow)"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#140727]/90 border border-[#aff81a]/50 text-[#aff81a] flex items-center justify-center hover:bg-[#aff81a] hover:text-[#121f00] transition-all cursor-pointer z-30 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>

                  <button
                    onClick={handleNext}
                    title="Next Variant (Right Arrow)"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#140727]/90 border border-[#aff81a]/50 text-[#aff81a] flex items-center justify-center hover:bg-[#aff81a] hover:text-[#121f00] transition-all cursor-pointer z-30 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>

                  {/* Active Specimen Badge */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#aff81a]/20 border border-[#aff81a] text-[#aff81a] text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#aff81a] animate-ping" />
                      ACTIVE DOSSIER ({currentIndex + 1} / {categoryFiltered.length})
                    </span>
                    <span className="text-[10px] text-[#8dcdff] font-bold">{activeChar.dimension}</span>
                  </div>

                  {/* Character Image */}
                  <div
                    onClick={() => {
                      soundFX.playClick();
                      setImageLightboxChar(activeChar);
                    }}
                    className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-[#aff81a]/60 bg-[#140727] shadow-inner cursor-zoom-in group mb-3"
                  >
                    <img
                      src={activeChar.imageUrl}
                      alt={activeChar.imageAlt || activeChar.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-[#aff81a] font-bold text-xs">
                      <span className="material-symbols-outlined text-lg">zoom_in</span>
                      <span>EXPAND HOLOGRAM</span>
                    </div>
                  </div>

                  {/* Title & Quick Stats */}
                  <h2 className="font-headline-md text-2xl sm:text-3xl font-bold text-[#e5ffb6] mb-1">
                    {activeChar.name}
                  </h2>
                  <p className="text-xs text-[#c2caae] line-clamp-2 mb-3 leading-relaxed">
                    {activeChar.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#8c947a]/20">
                    <div className="bg-[#190c2d] p-2 rounded border border-[#aae3ea]/30">
                      <span className="text-[10px] text-[#aae3ea] block font-bold">INTELLIGENCE</span>
                      <span className="text-lg font-bold text-[#aff81a]">{activeChar.intelligence}%</span>
                    </div>
                    <div className="bg-[#190c2d] p-2 rounded border border-[#ffb4ab]/30">
                      <span className="text-[10px] text-[#ffb4ab] block font-bold">CHAOS LEVEL</span>
                      <span className="text-lg font-bold text-[#ffb4ab]">{activeChar.chaosLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Interdimensional Telemetry Dossier */}
              <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
                <div className="glass-panel rounded-2xl p-5 border border-[#8dcdff]/30 bg-[#140727]/90 space-y-4">
                  {/* Dossier Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#8c947a]/30">
                    <div>
                      <span className="text-[10px] text-[#8dcdff] font-bold uppercase tracking-wider block">
                        C-137 SPECIMEN TELEMETRY
                      </span>
                      <h3 className="text-xl font-bold text-[#aff81a]">{activeChar.name}</h3>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded bg-[#26193a] text-[#8dcdff] border border-[#8dcdff]/40">
                        Species: {activeChar.species || 'Humanoid'}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#26193a] text-[#aff81a] border border-[#aff81a]/40">
                        Status: {activeChar.status || 'Alive'}
                      </span>
                    </div>
                  </div>

                  {/* Dossier Navigation Tabs */}
                  <div 
                    onMouseMove={handleHoverScrollHorizontal}
                    className="flex border-b border-[#8c947a]/30 gap-1 text-xs overflow-x-auto scrollbar-none"
                  >
                    {[
                      { id: 'stats', label: 'STAT MATRIX', icon: 'analytics' },
                      { id: 'quotes', label: 'AUDIO QUOTES', icon: 'graphic_eq' },
                      { id: 'gear', label: 'EQUIPMENT', icon: 'precision_manufacturing' },
                      { id: 'associates', label: 'NETWORK', icon: 'hub' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveDossierTab(tab.id as any);
                        }}
                        className={`px-3 py-2 rounded-t-lg font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all ${
                          activeDossierTab === tab.id
                            ? 'bg-[#aff81a] text-[#121f00] shadow-[0_-2px_10px_#aff81a]'
                            : 'text-[#c2caae] hover:bg-[#26193a] hover:text-[#aff81a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDossierTab}
                      initial={{ opacity: 0, x: 40, rotateX: 14, scale: 0.96, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -40, rotateX: -14, scale: 0.96, filter: 'blur(4px)' }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformPerspective: 1000, transformOrigin: '50% 0%' }}
                    >
                  {/* Tab 1: Stat Matrix */}
                  {activeDossierTab === 'stats' && (
                    <div className="space-y-3 bg-[#190c2d]/80 p-4 rounded-xl border border-[#8c947a]/20 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 font-bold">
                          <span className="text-[#aae3ea]">INTELLIGENCE SCORE:</span>
                          <span className="text-[#aff81a]">{activeChar.intelligence}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#140727] rounded-full overflow-hidden border border-[#8c947a]/30">
                          <motion.div
                            className="h-full bg-[#aff81a]"
                            initial={{ width: 0 }}
                            animate={{ width: `${activeChar.intelligence}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 font-bold">
                          <span className="text-[#ffb4ab]">CHAOS & VOLATILITY:</span>
                          <span className="text-[#ffb4ab]">{activeChar.chaosLevel}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#140727] rounded-full overflow-hidden border border-[#8c947a]/30">
                          <motion.div
                            className="h-full bg-[#ffb4ab]"
                            initial={{ width: 0 }}
                            animate={{ width: `${activeChar.chaosLevel}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {activeChar.techProficiency && (
                        <div>
                          <div className="flex justify-between mb-1 font-bold">
                            <span className="text-[#8dcdff]">TECH MASTERY:</span>
                            <span className="text-[#8dcdff]">{activeChar.techProficiency}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-[#140727] rounded-full overflow-hidden border border-[#8c947a]/30">
                            <motion.div
                              className="h-full bg-[#8dcdff]"
                              initial={{ width: 0 }}
                              animate={{ width: `${activeChar.techProficiency}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Audio Quotes */}
                  {activeDossierTab === 'quotes' && (
                    <div className="bg-[#190c2d]/80 p-4 rounded-xl border border-[#8c947a]/20 text-xs space-y-2">
                      {activeChar.quotes && activeChar.quotes.length > 0 ? (
                        activeChar.quotes.map((q, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              soundFX.playBleep();
                              soundFX.speak(q.text);
                              setActiveQuoteBubble(q.text);
                            }}
                            className="p-3 rounded-lg bg-[#140727] border border-[#aff81a]/30 hover:border-[#aff81a] cursor-pointer transition-all flex items-start gap-2.5 group"
                          >
                            <span className="material-symbols-outlined text-base text-[#aff81a] group-hover:scale-125 transition-transform mt-0.5">
                              play_circle
                            </span>
                            <div className="flex-grow">
                              <p className="text-[#ecdcff] italic font-body">"{q.text}"</p>
                              <span className="text-[10px] text-[#8c947a] block mt-1">
                                Context: {q.context || 'Interdimensional Transmission'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#c2caae] italic text-center py-4">
                          No audio transmissions intercepted yet.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Equipment */}
                  {activeDossierTab === 'gear' && (
                    <div className="bg-[#190c2d]/80 p-4 rounded-xl border border-[#8c947a]/20 text-xs">
                      {activeChar.equipment && activeChar.equipment.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeChar.equipment.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-[#140727] border border-[#8c947a]/30">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-[#e5ffb6]">{item.name}</span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#aff81a]/20 text-[#aff81a]">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#c2caae]">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#c2caae] italic text-center py-4">
                          No registered weaponry logged.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tab 4: Network */}
                  {activeDossierTab === 'associates' && (
                    <div className="bg-[#190c2d]/80 p-4 rounded-xl border border-[#8c947a]/20 text-xs">
                      {activeChar.associates && activeChar.associates.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {activeChar.associates.map((assoc, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#140727] border border-[#8c947a]/40 text-[#ecdcff] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-[#aff81a]">person</span>
                              {assoc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#c2caae] italic text-center py-4">
                          Operating solo across timelines.
                        </p>
                      )}
                    </div>
                  )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#8c947a]/30 text-xs">
                    <button
                      onClick={() => handleCloneCharacter(activeChar)}
                      className="px-3.5 py-2 bg-[#26193a] border border-[#8dcdff]/50 text-[#8dcdff] hover:bg-[#8dcdff]/20 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span>CLONE VARIANT</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {onDeleteCharacter && (
                        <button
                          onClick={() => handleDeleteCurrentChar(activeChar.id)}
                          className="px-3 py-2 bg-[#93000a]/80 text-[#ffdad6] hover:bg-[#ff1424] font-bold rounded-lg cursor-pointer transition-all"
                        >
                          DELETE
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundFX.playPortalJump();
                          setInspectChar(activeChar);
                        }}
                        className="px-4 py-2 bg-[#aff81a] text-[#121f00] font-bold rounded-lg hover:bg-[#a6ee00] shadow-[0_0_12px_#aff81a] cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">badge</span>
                        <span>EXPAND DOSSIER</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      )}

      {/* Mode 2: Grid Gallery View with Staggered Entrance */}
      {viewMode === 'grid' && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4 z-10"
        >
          {filteredCharacters.map((char, index) => {
            const isSelected = selectedCharId === char.id;

            return (
              <motion.div
                key={char.id}
                layout
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.18, ease: 'easeOut' } }}
                onClick={() => handleSelectCharacter(char, index)}
                className={`glass-panel rounded-2xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'border-2 border-[#aff81a] shadow-[0_0_30px_rgba(175,248,26,0.4)] bg-[#aff81a]/10'
                    : 'hover:border-[#8dcdff]/70 hover:shadow-[0_0_20px_rgba(141,205,255,0.2)]'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#aff81a]/40 bg-[#140727] flex-shrink-0 shadow-inner">
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-mono-tech text-[10px] text-[#aff81a] font-bold mb-0.5">
                      {char.dimension}
                    </div>
                    <h3 className="font-headline-md text-xl text-[#e5ffb6] font-bold">
                      {char.name}
                    </h3>
                    <p className="font-body text-xs text-[#c2caae] line-clamp-2 mt-1">
                      {char.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono-tech text-xs pt-3 border-t border-[#8c947a]/20">
                  <div className="flex gap-3 text-[11px] font-bold">
                    <span className="text-[#aae3ea]">IQ: {char.intelligence}</span>
                    <span className="text-[#ffb4ab]">CHAOS: {char.chaosLevel}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCharacter(char, index);
                    }}
                    className="px-3 py-1 bg-[#aff81a] text-[#121f00] font-bold rounded-lg text-[11px] hover:bg-[#a6ee00] transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_8px_#aff81a]"
                  >
                    <span className="material-symbols-outlined text-xs">info</span>
                    <span>Inspect</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Inspect Specimen Detail Modal with Spring Entrance */}
      <AnimatePresence>
        {inspectChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-panel glass-panel-active p-6 rounded-2xl max-w-xl w-full font-mono-tech border-2 border-[#aff81a] shadow-[0_0_60px_rgba(175,248,26,0.5)] relative bg-[#140727]/95 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setInspectChar(null)}
                className="absolute top-4 right-4 text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-6 mb-4">
                <div
                  onClick={() => {
                    soundFX.playClick();
                    setImageLightboxChar(inspectChar);
                  }}
                  className="w-full sm:w-44 h-48 rounded-xl overflow-hidden border-2 border-[#aff81a]/60 bg-[#140727] flex-shrink-0 shadow-lg relative group cursor-zoom-in"
                >
                  <img
                    src={inspectChar.imageUrl}
                    alt={inspectChar.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#aff81a] p-2 text-center">
                    <span className="material-symbols-outlined text-2xl mb-1">fullscreen</span>
                    <span className="text-[10px] font-bold">EXPAND HIGH-RES HOLOGRAM</span>
                  </div>
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-2.5 py-0.5 rounded bg-[#aff81a]/20 text-[#aff81a] border border-[#aff81a]/40 text-xs font-bold">
                      {inspectChar.dimension}
                    </span>
                    {inspectChar.originTimeline && (
                      <span className="px-2.5 py-0.5 rounded bg-[#8dcdff]/20 text-[#8dcdff] border border-[#8dcdff]/40 text-[10px] font-bold">
                        ORIGIN: {inspectChar.originTimeline}
                      </span>
                    )}
                  </div>
                  <h2 className="font-headline-md text-3xl text-[#e5ffb6] font-bold">
                    {inspectChar.name}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-xs text-[#8dcdff]">
                    <span>SPECIES: {inspectChar.species || 'Variant'}</span>
                    <span>STATUS: {inspectChar.status || 'Alive'}</span>
                    {inspectChar.dangerRating && (
                      <span className="text-[#ffb4ab]">DANGER: {inspectChar.dangerRating}</span>
                    )}
                  </div>
                  <p className="font-body text-xs text-[#ecdcff] leading-relaxed pt-1">
                    {inspectChar.description}
                  </p>
                </div>
              </div>

              {/* Dossier Navigation Tabs */}
              <div className="flex border-b border-[#8c947a]/30 mb-4 gap-1 text-xs">
                {[
                  { id: 'stats', label: 'STAT MATRIX', icon: 'analytics' },
                  { id: 'quotes', label: 'AUDIO QUOTES', icon: 'graphic_eq' },
                  { id: 'gear', label: 'EQUIPMENT', icon: 'precision_manufacturing' },
                  { id: 'associates', label: 'NETWORK', icon: 'hub' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveDossierTab(tab.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-t-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      activeDossierTab === tab.id
                        ? 'bg-[#aff81a] text-[#121f00] shadow-[0_-2px_10px_#aff81a]'
                        : 'text-[#c2caae] hover:bg-[#26193a] hover:text-[#aff81a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDossierTab}
                  initial={{ opacity: 0, x: 40, rotateX: 14, scale: 0.96, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -40, rotateX: -14, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 1000, transformOrigin: '50% 0%' }}
                >
              {/* Tab 1: Stat Matrix */}
              {activeDossierTab === 'stats' && (
                <div className="space-y-3 bg-[#140727]/80 p-4 rounded-xl border border-[#8c947a]/30 mb-6 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#aae3ea]">INTELLIGENCE:</span>
                        <span className="text-[#aff81a] font-bold">{inspectChar.intelligence}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#26193a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#aff81a]"
                          initial={{ width: 0 }}
                          animate={{ width: `${inspectChar.intelligence}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#ffb4ab]">CHAOS LEVEL:</span>
                        <span className="text-[#ffb4ab] font-bold">{inspectChar.chaosLevel}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#26193a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#ffb4ab]"
                          initial={{ width: 0 }}
                          animate={{ width: `${inspectChar.chaosLevel}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  {inspectChar.techProficiency && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#8dcdff]">TECH PROFICIENCY:</span>
                        <span className="text-[#8dcdff] font-bold">{inspectChar.techProficiency}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#26193a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#8dcdff]"
                          initial={{ width: 0 }}
                          animate={{ width: `${inspectChar.techProficiency}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Audio Quotes Soundboard */}
              {activeDossierTab === 'quotes' && (
                <div className="bg-[#140727]/80 p-4 rounded-xl border border-[#8c947a]/30 mb-6 text-xs space-y-3 min-h-[140px]">
                  <div className="text-[11px] text-[#8dcdff] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">record_voice_over</span>
                    C-137 INTERCEPTED AUDIO TRANSMISSIONS
                  </div>
                  {inspectChar.quotes && inspectChar.quotes.length > 0 ? (
                    <div className="space-y-2">
                      {inspectChar.quotes.map((q, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            soundFX.playBleep();
                            setActiveQuoteBubble(q.text);
                          }}
                          className="p-2.5 rounded-lg bg-[#26193a] border border-[#aff81a]/30 hover:border-[#aff81a] cursor-pointer transition-all flex items-start gap-2.5 group"
                        >
                          <span className="material-symbols-outlined text-base text-[#aff81a] group-hover:scale-125 transition-transform mt-0.5">
                            play_circle
                          </span>
                          <div className="flex-grow">
                            <p className="text-[#ecdcff] italic font-body text-xs">"{q.text}"</p>
                            <span className="text-[9px] text-[#c2caae] block mt-1">
                              Context: {q.context || 'Multiverse Broadcast'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#c2caae] italic text-center py-4">
                      No vocal transmissions recorded for this variant yet.
                    </p>
                  )}

                  {activeQuoteBubble && (
                    <div className="p-3 bg-[#aff81a]/20 border border-[#aff81a] rounded-lg text-[#aff81a] animate-fadeIn text-xs flex items-center justify-between">
                      <span className="font-bold font-mono-tech">🔊 TRANSMITTING: "{activeQuoteBubble}"</span>
                      <button
                        onClick={() => setActiveQuoteBubble(null)}
                        className="text-xs hover:text-[#ffb4ab] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Equipment & Weaponry */}
              {activeDossierTab === 'gear' && (
                <div className="bg-[#140727]/80 p-4 rounded-xl border border-[#8c947a]/30 mb-6 text-xs space-y-3 min-h-[140px]">
                  <div className="text-[11px] text-[#aff81a] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">shield</span>
                    REGISTERED EQUIPMENT & WEAPONRY
                  </div>
                  {inspectChar.equipment && inspectChar.equipment.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {inspectChar.equipment.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-[#26193a] border border-[#8c947a]/30 flex flex-col justify-between gap-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#e5ffb6]">{item.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#aff81a]/20 text-[#aff81a] border border-[#aff81a]/30">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#c2caae] line-clamp-2">{item.description}</p>
                          {item.powerRating && (
                            <div className="text-[9px] text-[#8dcdff] font-bold mt-1">
                              POWER: {item.powerRating}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#c2caae] italic text-center py-4">
                      No specialized weaponry logged for this specimen.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 4: Associate Network */}
              {activeDossierTab === 'associates' && (
                <div className="bg-[#140727]/80 p-4 rounded-xl border border-[#8c947a]/30 mb-6 text-xs space-y-3 min-h-[140px]">
                  <div className="text-[11px] text-[#ffb4ab] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">diversity_3</span>
                    KNOWN ASSOCIATES & TIMELINE ALLIES
                  </div>
                  {inspectChar.associates && inspectChar.associates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {inspectChar.associates.map((assoc, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-[#26193a] border border-[#8c947a]/40 text-[#ecdcff] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm text-[#aff81a]">person</span>
                          <span>{assoc}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#c2caae] italic text-center py-4">
                      Operating solo across all known timeline clusters.
                    </p>
                  )}
                </div>
              )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-[#aff81a]/30 text-xs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteCurrentChar(inspectChar.id)}
                  className="px-3.5 py-2 bg-[#93000a]/80 text-[#ffdad6] hover:bg-[#ff1424] font-bold rounded-lg cursor-pointer transition-all"
                >
                  DELETE VARIANT
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCloneCharacter(inspectChar)}
                  className="px-3.5 py-2 bg-[#26193a] border border-[#8dcdff]/50 text-[#8dcdff] hover:bg-[#8dcdff]/20 font-bold rounded-lg cursor-pointer transition-all"
                >
                  CLONE VARIANT
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    soundFX.playPortalJump();
                    setSelectedCharId(inspectChar.id);
                    setInspectChar(null);
                  }}
                  className="px-4 py-2 bg-[#aff81a] text-[#121f00] hover:bg-[#a6ee00] font-bold rounded-lg shadow-[0_0_15px_#aff81a] cursor-pointer transition-all"
                >
                  SELECT AS TRAVELER
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Custom Character Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-panel glass-panel-active p-6 rounded-2xl max-w-lg w-full font-mono-tech border-2 border-[#aff81a] shadow-[0_0_40px_rgba(175,248,26,0.3)] bg-[#140727]/95 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-[#aff81a]/30 pb-3 mb-4">
                <h3 className="font-headline-md text-xl text-[#aff81a] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">person_add</span>
                  <span>REGISTER NEW CHARACTER VARIANT</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveCustomChar} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#c2caae] mb-1">CHARACTER NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mecha-Morty or Pickle Beth"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#c2caae] mb-1">DIMENSION</label>
                    <input
                      type="text"
                      placeholder="e.g. Dimension X-99"
                      value={newDim}
                      onChange={(e) => setNewDim(e.target.value)}
                      className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c2caae] mb-1">SPECIES</label>
                    <input
                      type="text"
                      placeholder="e.g. Cyborg / Alien"
                      value={newSpecies}
                      onChange={(e) => setNewSpecies(e.target.value)}
                      className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#c2caae] mb-1">DESCRIPTION & BIO</label>
                  <textarea
                    rows={3}
                    placeholder="Enter variant backstory, unusual traits, or weapon preferences..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#c2caae] mb-1">
                      INTELLIGENCE: {newIntel}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={newIntel}
                      onChange={(e) => setNewIntel(Number(e.target.value))}
                      className="w-full accent-[#aff81a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c2caae] mb-1">CHAOS LEVEL: {newChaos}%</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={newChaos}
                      onChange={(e) => setNewChaos(Number(e.target.value))}
                      className="w-full accent-[#ffb4ab]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-[#8c947a]/20">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-[#3c2e50] text-[#ecdcff] rounded hover:bg-[#403355] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#aff81a] text-[#121f00] font-bold rounded hover:bg-[#a6ee00] shadow-[0_0_10px_#aff81a] cursor-pointer"
                  >
                    REGISTER VARIANT
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Image Lightbox Expanded Viewer Modal */}
      <AnimatePresence>
        {imageLightboxChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[250] flex flex-col items-center justify-center p-4 font-mono-tech"
            onClick={() => setImageLightboxChar(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl w-full glass-panel p-4 rounded-2xl border-2 border-[#aff81a] shadow-[0_0_80px_rgba(175,248,26,0.6)] flex flex-col items-center gap-4 bg-[#140727]/90 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-between items-center border-b border-[#aff81a]/30 pb-2">
                <div className="flex items-center gap-2 text-[#aff81a] font-bold text-sm">
                  <span className="material-symbols-outlined animate-pulse">center_focus_strong</span>
                  <span>HIGH-RESOLUTION HOLOGRAM: {imageLightboxChar.name}</span>
                </div>
                <button
                  onClick={() => setImageLightboxChar(null)}
                  className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* High-Res Image Container with Reticle Grid */}
              <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-[#8dcdff]/40 bg-[#000000]">
                <img
                  src={imageLightboxChar.imageUrl}
                  alt={imageLightboxChar.name}
                  className="w-full h-full object-contain"
                />

                {/* Tactical Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-[#aff81a]/20 flex items-center justify-center">
                  <div className="w-32 h-32 border border-[#aff81a]/40 rounded-full animate-ping opacity-25" />
                  <div className="absolute top-2 left-2 text-[9px] text-[#aff81a] bg-black/60 px-2 py-0.5 rounded">
                    DIMENSION: {imageLightboxChar.dimension}
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#8dcdff] bg-black/60 px-2 py-0.5 rounded">
                    SCAN FREQ: 142.80 MHz
                  </div>
                </div>
              </div>

              {/* Lightbox Controls */}
              <div className="w-full flex flex-wrap justify-between items-center text-xs gap-2 pt-1">
                <div className="text-[#c2caae] text-[11px]">
                  <span>Species: <strong className="text-[#e5ffb6]">{imageLightboxChar.species || 'Variant'}</strong></span>
                  <span className="ml-3">Status: <strong className="text-[#8dcdff]">{imageLightboxChar.status || 'Active'}</strong></span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      soundFX.playBleep();
                      handleCloneCharacter(imageLightboxChar);
                      setImageLightboxChar(null);
                    }}
                    className="px-3 py-1.5 bg-[#26193a] border border-[#8dcdff]/50 text-[#8dcdff] rounded font-bold hover:bg-[#8dcdff]/20 cursor-pointer"
                  >
                    CLONE VARIANT
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playPortalJump();
                      setSelectedCharId(imageLightboxChar.id);
                      setImageLightboxChar(null);
                    }}
                    className="px-3.5 py-1.5 bg-[#aff81a] text-[#121f00] font-bold rounded hover:bg-[#a6ee00] cursor-pointer shadow-[0_0_10px_#aff81a]"
                  >
                    SELECT SPECIMEN
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

