import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GroceryItem, LabNote } from '../types';
import { soundFX } from '../utils/audio';

interface LabNotesProps {
  labNotes: LabNote[];
  groceryItems: GroceryItem[];
  onToggleGrocery: (id: string) => void;
  onAddGrocery: (text: string) => void;
  onAddLabNote: (note: LabNote) => void;
  onDeleteLabNote?: (id: string) => void;
  onTriggerAnomaly?: () => void;
}

export const LabNotes: React.FC<LabNotesProps> = ({
  labNotes,
  groceryItems,
  onToggleGrocery,
  onAddGrocery,
  onAddLabNote,
  onDeleteLabNote,
  onTriggerAnomaly,
}) => {
  const [newGroceryText, setNewGroceryText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedNote, setSelectedNote] = useState<LabNote | null>(null);

  // New Note Modal state
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState('EXPERIMENTAL');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'blueprint' | 'schema' | 'checklist' | 'anomaly'>('blueprint');

  // Data Export Animation State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('INITIATING ARCHIVE ENCRYPTION...');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleStartDataExport = () => {
    soundFX.playBleep();
    setShowExportModal(true);
    setIsExporting(true);
    setExportProgress(0);
    setExportSuccess(false);
    setExportStatusText('EXTRACTING C-137 LAB SCHEMATICS...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 16) + 10;

      if (progress < 30) {
        setExportStatusText('EXTRACTING C-137 LAB SCHEMATICS...');
      } else if (progress < 60) {
        setExportStatusText('ENCRYPTING QUANTUM ANOMALY LOGS...');
      } else if (progress < 90) {
        setExportStatusText('PACKAGING PORTAL-STAMPED JSON ARCHIVE...');
      } else if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Perform Clipboard Copy
        const archiveData = {
          exportTimestamp: new Date().toISOString(),
          clearanceLevel: 'C-137 OMEGA ARCHIVE',
          dimensionOrigin: 'Earth C-137',
          notesCount: labNotes.length,
          groceryItemsCount: groceryItems.length,
          labNotes: labNotes,
          labIngredientsList: groceryItems,
        };

        const jsonString = JSON.stringify(archiveData, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(jsonString).catch(() => {});
        }

        setExportStatusText('ARCHIVE SUCCESSFULLY COPIED TO CLIPBOARD!');
        setIsExporting(false);
        setExportSuccess(true);
        soundFX.playPortalJump();
        soundFX.speak(`${labNotes.length} lab notes and ingredients copied to clipboard.`);
      }

      setExportProgress(Math.min(100, progress));
    }, 180);
  };

  const handleLogQuantumAnomaly = () => {
    const anomalyId = Math.floor(Math.random() * 899 + 100);
    const note: LabNote = {
      id: `anomaly-${Date.now()}`,
      title: `QUANTUM ANOMALY: SEC-${anomalyId}`,
      status: 'CRITICAL DISTORTION',
      modified: `${new Date().toLocaleTimeString()} (C-137 TIME)`,
      category: 'anomaly',
      content: 'Extreme dimensional fluctuation logged in Citadel sector. High-frequency tachyon burst triggered screen stability collapse.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HNHLdqhoTlbU_H36f6AEEVT6IeKiOizJc8RbHnLV_yCM9VYStBXtQ8s8a3UuBJGr27bIuafC0G4roPX8IPIHbY6FNRBxy3ZbwcyWY6aJQvJccy3azML4kAYl0Rz2i2XnvmoZmMClq7_7c3v0k6rM-9jPgucMm1bcD-3KOl25gcip-xQX74CCHoyJBAXFh_LHGqcOJ1i_1ZK-v5vSEBxXbUTnvMBdwZwfj6bi6OtlULoodBoXpoEs0g',
    };

    onAddLabNote(note);
    if (onTriggerAnomaly) {
      onTriggerAnomaly();
    }
  };

  const handleGrocerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryText.trim()) return;
    soundFX.playClick();
    onAddGrocery(newGroceryText.trim());
    soundFX.speak(`Added ${newGroceryText.trim()} to lab ingredients checklist.`);
    setNewGroceryText('');
  };

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    soundFX.playBleep();
    soundFX.speak(`Lab note entry ${quickTitle.trim()} logged to Rick OS database.`);
    const note: LabNote = {
      id: `note-${Date.now()}`,
      title: quickTitle.toUpperCase(),
      status: 'LOGGED ENTRY',
      modified: `${new Date().toLocaleTimeString()} (C-137 TIME)`,
      category: 'schema',
      content: 'Quick observation recorded via C-137 lab console.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSGqoTckHsRnG-IHOb1qNCAXvn0W7BztRlfn0011o14Q2dPsxqORzUEcVEvhncCo_dI0RdNZQxUNz3v2dk_AzBReyWhgB_PCoW-ZT5h1-5MyXjvYBbALySL9fRT8pvl17Q7eGH2uqm_W9diQMs-pYeuVo26ku7yRlvJaYFO5DZaDzXcFgS8XGa7DLaVirbR7tl8DB6FE7T7hg1_04uBRUW4RlcDzmXOPxEB7gfN7ccalZ-Wo8W2Mga4g',
    };

    onAddLabNote(note);
    setQuickTitle('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFX.playBleep();
    soundFX.speak(`Schematic ${newTitle.trim()} saved to classified laboratory archive.`);
    const note: LabNote = {
      id: `note-${Date.now()}`,
      title: newTitle.toUpperCase(),
      status: newStatus.toUpperCase() || 'EXPERIMENTAL',
      modified: `${new Date().toLocaleTimeString()} (C-137 TIME)`,
      category: newCategory,
      content: newContent || 'No additional technical details recorded.',
      imageUrl:
        newCategory === 'anomaly'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HNHLdqhoTlbU_H36f6AEEVT6IeKiOizJc8RbHnLV_yCM9VYStBXtQ8s8a3UuBJGr27bIuafC0G4roPX8IPIHbY6FNRBxy3ZbwcyWY6aJQvJccy3azML4kAYl0Rz2i2XnvmoZmMClq7_7c3v0k6rM-9jPgucMm1bcD-3KOl25gcip-xQX74CCHoyJBAXFh_LHGqcOJ1i_1ZK-v5vSEBxXbUTnvMBdwZwfj6bi6OtlULoodBoXpoEs0g'
          : newCategory === 'schema'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HNHLdqhoTlbU_H36f6AEEVT6IeKiOizJc8RbHnLV_yCM9VYStBXtQ8s8a3UuBJGr27bIuafC0G4roPX8IPIHbY6FNRBxy3ZbwcyWY6aJQvJccy3azML4kAYl0Rz2i2XnvmoZmMClq7_7c3v0k6rM-9jPgucMm1bcD-3KOl25gcip-xQX74CCHoyJBAXFh_LHGqcOJ1i_1ZK-v5vSEBxXbUTnvMBdwZwfj6bi6OtlULoodBoXpoEs0g'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSGqoTckHsRnG-IHOb1qNCAXvn0W7BztRlfn0011o14Q2dPsxqORzUEcVEvhncCo_dI0RdNZQxUNz3v2dk_AzBReyWhgB_PCoW-ZT5h1-5MyXjvYBbALySL9fRT8pvl17Q7eGH2uqm_W9diQMs-pYeuVo26ku7yRlvJaYFO5DZaDzXcFgS8XGa7DLaVirbR7tl8DB6FE7T7hg1_04uBRUW4RlcDzmXOPxEB7gfN7ccalZ-Wo8W2Mga4g',
    };

    onAddLabNote(note);
    if (newCategory === 'anomaly' && onTriggerAnomaly) {
      onTriggerAnomaly();
    }

    setShowNoteModal(false);
    setNewTitle('');
    setNewContent('');
    setNewStatus('EXPERIMENTAL');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto min-h-[calc(100vh-180px)] py-6 z-10 relative"
    >
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#e5ffb6]/20 pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#e5ffb6] drop-shadow-[0_0_12px_rgba(175,248,26,0.5)] flicker-animation flex items-center gap-3">
            <span>LAB NOTES & SCHEMATICS</span>
            <span className="material-symbols-outlined text-3xl text-[#aff81a]">science</span>
          </h1>
          <p className="font-mono-tech text-xs text-[#c2caae] mt-1.5">
            CLASSIFIED CLEARANCE LEVEL: C-137 ({labNotes.length} ENTRIES SAVED)
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Simulated Data Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartDataExport}
            className="bg-[#8dcdff]/20 border border-[#8dcdff] text-[#8dcdff] px-3.5 py-2 rounded-lg font-mono-tech text-xs font-bold hover:bg-[#8dcdff] hover:text-[#121f00] transition-all duration-300 shadow-[0_0_12px_rgba(141,205,255,0.3)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>DATA EXPORT</span>
          </motion.button>

          {/* Dedicated Quantum Anomaly Logging Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogQuantumAnomaly}
            className="bg-[#ff0055]/20 border border-[#ff0055] text-[#ff5588] px-3.5 py-2 rounded-lg font-mono-tech text-xs font-bold hover:bg-[#ff0055] hover:text-[#ffffff] transition-all duration-300 shadow-[0_0_15px_rgba(255,0,85,0.4)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap animate-pulse"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            <span>LOG QUANTUM ANOMALY</span>
          </motion.button>

          {/* Quick Note Input */}
          <form onSubmit={handleQuickNoteSubmit} className="flex-1 md:w-56 flex gap-1.5">
            <input
              type="text"
              placeholder="Quick log title..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="w-full bg-[#140727]/90 border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-1.5 text-xs font-mono-tech focus:outline-none focus:border-[#aff81a] transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              title="Add Quick Note"
              className="px-3 py-1.5 bg-[#aff81a]/20 border border-[#aff81a] text-[#aff81a] hover:bg-[#aff81a] hover:text-[#121f00] font-mono-tech text-xs font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap shadow-[0_0_8px_rgba(175,248,26,0.3)]"
            >
              + ADD
            </motion.button>
          </form>

          {/* New Entry Modal Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundFX.playClick();
              setShowNoteModal(true);
            }}
            className="bg-[#e5ffb6] text-[#233600] border border-[#e5ffb6] px-3.5 py-2 rounded-lg font-mono-tech text-xs font-bold hover:bg-[#aff81a] transition-all duration-300 shadow-[0_0_15px_rgba(175,248,26,0.4)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>NEW ENTRY</span>
          </motion.button>
        </div>
      </header>

      {/* Spatial Grid Layout with Staggered Animations */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Microverse Battery Blueprint (Card 1) */}
        <motion.article
          variants={{
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl p-6 flex flex-col min-h-[380px] col-span-1 md:col-span-2 blueprint-grid relative overflow-hidden group border border-[#e5ffb6]/30 shadow-lg"
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ffb4ab] animate-pulse shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
          </div>

          <div className="z-10 flex-grow">
            <h2 className="font-headline-md text-xl md:text-2xl text-[#e5ffb6] font-bold mb-1">
              PROJECT: MICROVERSE BATTERY
            </h2>
            <div className="font-mono-tech text-xs text-[#8dcdff] mb-4 opacity-90 font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#aff81a]">bolt</span>
              <span>STATUS: UNSTABLE (NEEDS MORE FLOOBLE CRANKS)</span>
            </div>

            <div className="h-44 w-full border border-[#8dcdff]/30 rounded-xl mb-4 overflow-hidden relative bg-[#140727]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSGqoTckHsRnG-IHOb1qNCAXvn0W7BztRlfn0011o14Q2dPsxqORzUEcVEvhncCo_dI0RdNZQxUNz3v2dk_AzBReyWhgB_PCoW-ZT5h1-5MyXjvYBbALySL9fRT8pvl17Q7eGH2uqm_W9diQMs-pYeuVo26ku7yRlvJaYFO5DZaDzXcFgS8XGa7DLaVirbR7tl8DB6FE7T7hg1_04uBRUW4RlcDzmXOPxEB7gfN7ccalZ-Wo8W2Mga4g"
                alt="Microverse Battery Schematic"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 mix-blend-screen"
              />
            </div>

            <p className="font-body text-sm text-[#ecdcff] leading-relaxed">
              Note to self: The Miniverse within the Microverse is generating suboptimal power output. Must investigate the Teenyverse recursive loops. Current spatial compression integrity is failing at 0.04%.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e5ffb6]/20 flex justify-between items-center text-[#c2caae] font-mono-tech text-[10px]">
            <span>MODIFIED: 02:44 AM (EARTH C-137 TIME)</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundFX.playBleep();
                setSelectedNote({
                  id: 'microverse',
                  title: 'PROJECT: MICROVERSE BATTERY',
                  status: 'UNSTABLE',
                  modified: '02:44 AM',
                  category: 'blueprint',
                  content:
                    'Note to self: The Miniverse within the Microverse is generating suboptimal power output. Must investigate the Teenyverse recursive loops. Current spatial compression integrity is failing at 0.04%. Flooble Crank efficiency must be raised by 18%.',
                });
              }}
              className="text-[#e5ffb6] hover:text-[#aff81a] flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>INSPECT</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </motion.button>
          </div>
        </motion.article>

        {/* Live Data Stream Matrix Log (Card 2) */}
        <motion.article
          variants={{
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl p-6 flex flex-col h-[380px] relative overflow-hidden bg-black/70 border border-[#a6ee00]/40 shadow-lg"
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black z-10" />

          <div className="z-20 mb-3 flex justify-between items-center border-b border-[#a6ee00]/30 pb-2">
            <h2 className="font-mono-tech text-xs text-[#a6ee00] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm animate-pulse">terminal</span>
              <span>LIVE DATA STREAM</span>
            </h2>
            <span className="w-2.5 h-2.5 rounded-full bg-[#aff81a] animate-ping" />
          </div>

          <div className="overflow-hidden flex-grow relative font-mono-tech text-[11px] text-[#a6ee00] opacity-90 leading-relaxed">
            <div className="matrix-text absolute w-full break-words space-y-3">
              <p>ERR: SPATIAL ANOMALY DETECTED IN SECTOR 4... RECALIBRATING PORTAL FLUID VISCOSITY...</p>
              <p>WARNING: NEUTRINO BOMB DEFUSAL PROTOCOL FAILED. MANUAL OVERRIDE REQUIRED...</p>
              <p>SCANNING DIMENSION J19ζ7... NO INTELLIGENT LIFE FOUND...</p>
              <p>SYSTEM UPDATE: MEESEEKS BOX INTEGRITY AT 88%... DO NOT SUMMON MORE THAN 5...</p>
              <p>INTERDIMENSIONAL CABLE FEED LOST. ATTEMPTING RECONNECTION TO BALL FONDLERS MARATHON...</p>
              <p>QUANTUM FLUCTUATION STABILIZED AT 98.4% IN COHERENCE MATRIX...</p>
              <p>ALERT: GALACTIC FEDERATION PATROL DETECTED NEAR QUADRANT 7. ACTIVATING GRAV-TETHER STEALTH MODE...</p>
            </div>
          </div>
        </motion.article>

        {/* Grocery List Sticky Note (Card 3) */}
        <motion.article
          variants={{
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl p-6 bg-[#aae3ea]/10 border border-[#ddfbff]/40 shadow-[0_0_20px_rgba(221,251,255,0.1)] flex flex-col min-h-[320px]"
        >
          <div className="flex justify-between items-start mb-4 border-b border-[#ddfbff]/20 pb-2">
            <h3 className="font-headline-md text-lg text-[#ddfbff] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">checklist</span>
              <span>LAB INGREDIENTS LIST</span>
            </h3>
            <span className="material-symbols-outlined text-[#ddfbff]/60 animate-bounce">push_pin</span>
          </div>

          <ul className="font-body space-y-2.5 text-sm flex-grow mb-4">
            {groceryItems.map((item) => (
              <motion.li
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  soundFX.playClick();
                  const nextState = !item.completed;
                  onToggleGrocery(item.id);
                  if (nextState) {
                    soundFX.speak(`Lab task ${item.text} marked as completed.`);
                  } else {
                    soundFX.speak(`Lab task ${item.text} reactivated.`);
                  }
                }}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-all select-none bg-[#140727]/40 p-1.5 rounded-lg border border-[#ddfbff]/10"
              >
                <span className="material-symbols-outlined text-base text-[#ddfbff]">
                  {item.completed ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span className={item.completed ? 'line-through text-[#c2caae]/70' : 'text-[#ecdcff]'}>
                  {item.text}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Add Item Input */}
          <form onSubmit={handleGrocerySubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Add lab ingredient..."
              value={newGroceryText}
              onChange={(e) => setNewGroceryText(e.target.value)}
              className="flex-1 bg-[#140727]/80 border border-[#ddfbff]/30 text-[#ecdcff] rounded-lg px-3 py-1.5 text-xs font-mono-tech focus:outline-none focus:border-[#ddfbff]"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-3.5 py-1.5 bg-[#ddfbff] text-[#00363b] font-bold text-xs rounded-lg font-mono-tech hover:bg-[#b3ecf3] cursor-pointer shadow"
            >
              ADD
            </motion.button>
          </form>
        </motion.article>

        {/* Custom Saved Notes */}
        {labNotes.map((note) => {
          const isAnomaly = note.category === 'anomaly' || note.title.includes('ANOMALY');
          return (
            <motion.article
              key={note.id}
              layout
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.18, ease: 'easeOut' } }}
              className={`glass-panel rounded-2xl p-6 flex flex-col min-h-[300px] justify-between group transition-[border-color,box-shadow,background-color] duration-200 ${
                isAnomaly
                  ? 'border-2 border-[#ff0055] bg-[#ff0055]/10 shadow-[0_0_25px_rgba(255,0,85,0.3)] hover:shadow-[0_0_35px_rgba(255,0,85,0.5)]'
                  : 'border border-[#8dcdff]/30 hover:border-[#aff81a] hover:shadow-[0_0_20px_rgba(175,248,26,0.2)]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2 border-b border-[#8dcdff]/20 pb-2">
                  <h3 className={`font-headline-md text-lg font-bold flex items-center gap-1.5 ${isAnomaly ? 'text-[#ff5588]' : 'text-[#8dcdff]'}`}>
                    {isAnomaly && <span className="material-symbols-outlined text-base animate-pulse text-[#ff0055]">warning</span>}
                    <span>{note.title}</span>
                  </h3>
                  <span className={`font-mono-tech text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isAnomaly
                      ? 'bg-[#ff0055]/20 border border-[#ff0055] text-[#ff5588] animate-pulse'
                      : 'bg-[#aff81a]/10 border border-[#aff81a]/30 text-[#aff81a]'
                  }`}>
                    {note.status}
                  </span>
                </div>

                {note.imageUrl && (
                  <div className={`w-full h-28 rounded-xl overflow-hidden mb-3 border bg-[#140727] ${isAnomaly ? 'border-[#ff0055]/40' : 'border-[#8c947a]/30'}`}>
                    <img
                      src={note.imageUrl}
                      alt={note.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <p className="font-body text-xs text-[#ecdcff] leading-relaxed my-2">
                  {note.content}
                </p>
              </div>

              <div className="font-mono-tech text-[10px] text-[#c2caae] pt-3 border-t border-[#8c947a]/20 flex justify-between items-center gap-2 mt-3">
                <span>{note.modified}</span>

                <div className="flex items-center gap-2">
                  {isAnomaly && onTriggerAnomaly && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onTriggerAnomaly();
                      }}
                      className="px-2 py-1 bg-[#ff0055]/30 border border-[#ff0055] text-[#ff5588] hover:bg-[#ff0055] hover:text-white rounded cursor-pointer font-bold flex items-center gap-1 text-[9px]"
                    >
                      <span className="material-symbols-outlined text-xs">bolt</span>
                      <span>GLITCH</span>
                    </motion.button>
                  )}

                  {onDeleteLabNote && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        soundFX.playClick();
                        onDeleteLabNote(note.id);
                      }}
                      className="text-[#ffb4ab] hover:text-[#ff1424] cursor-pointer font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                      <span>DELETE</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Note Inspection Modal */}
      <AnimatePresence>
        {selectedNote && (
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
              className="glass-panel glass-panel-active p-6 rounded-2xl max-w-lg w-full font-mono-tech border-2 border-[#aff81a] shadow-[0_0_50px_rgba(175,248,26,0.4)] relative bg-[#140727]/95"
            >
              <button
                onClick={() => setSelectedNote(null)}
                className="absolute top-4 right-4 text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="font-headline-md text-2xl text-[#aff81a] font-bold mb-2">
                {selectedNote.title}
              </h3>
              <div className="text-xs text-[#8dcdff] mb-4">STATUS: {selectedNote.status}</div>

              <div className="bg-[#140727] p-4 rounded-xl border border-[#8c947a]/30 text-xs text-[#ecdcff] leading-relaxed mb-6">
                {selectedNote.content}
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 bg-[#aff81a] text-[#121f00] font-bold rounded-lg cursor-pointer shadow-[0_0_10px_#aff81a]"
                >
                  CLOSE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
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
              className="glass-panel glass-panel-active p-6 rounded-2xl max-w-lg w-full font-mono-tech border-2 border-[#aff81a]/50 shadow-[0_0_40px_rgba(175,248,26,0.3)] bg-[#140727]/95 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-[#aff81a]/30 pb-3 mb-4">
                <h3 className="font-headline-md text-xl text-[#aff81a] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">add_box</span>
                  <span>NEW LAB ENTRY SCHEMATIC</span>
                </h3>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#c2caae] mb-1">PROJECT TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PROJECT: PORTAL GUN RE-CALIBRATION"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div>
                  <label className="block text-[#c2caae] mb-1">STATUS TAG</label>
                  <input
                    type="text"
                    placeholder="e.g. EXPERIMENTAL (HIGH RISK)"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div>
                  <label className="block text-[#c2caae] mb-1">CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as 'blueprint' | 'schema' | 'checklist' | 'anomaly')}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  >
                    <option value="blueprint">Blueprint Schematic</option>
                    <option value="schema">Technical Schema</option>
                    <option value="checklist">Lab Checklist</option>
                    <option value="anomaly">☢️ Quantum Anomaly (Triggers Glitch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c2caae] mb-1">TECHNICAL DETAILS & SCHEMATIC NOTES</label>
                  <textarea
                    rows={4}
                    placeholder="Enter secret calculations, isotope ratios, or caution notes..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="px-4 py-2 bg-[#3c2e50] text-[#ecdcff] rounded-lg hover:bg-[#403355] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#aff81a] text-[#121f00] font-bold rounded-lg hover:bg-[#a6ee00] shadow-[0_0_10px_#aff81a] cursor-pointer"
                  >
                    SAVE ENTRY
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Data Export Progress Modal */}
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[210] flex items-center justify-center p-4 font-mono-tech"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel glass-panel-active p-6 rounded-2xl max-w-md w-full border-2 border-[#8dcdff]/60 shadow-[0_0_50px_rgba(141,205,255,0.4)] bg-[#140727]/95 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-[#8dcdff]/30 pb-3 mb-4">
                <h3 className="text-lg font-bold text-[#8dcdff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl animate-spin">sync</span>
                  <span>QUANTUM DATA ARCHIVE EXPORT</span>
                </h3>
                {!isExporting && (
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              {/* Progress Container */}
              <div className="space-y-4 my-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#aae3ea] font-bold">{exportStatusText}</span>
                  <span className="text-[#aff81a] font-bold text-sm">{exportProgress}%</span>
                </div>

                {/* Outer Progress Track */}
                <div className="w-full h-4 bg-[#190c2d] rounded-full overflow-hidden border border-[#8dcdff]/40 p-0.5 relative shadow-inner">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#8dcdff] via-[#aff81a] to-[#a6ee00] shadow-[0_0_15px_#aff81a]"
                    style={{ width: `${exportProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                  {/* Scanline stripe on progress bar */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:4px_100%] pointer-events-none opacity-40" />
                </div>

                <div className="p-3 bg-[#190c2d]/90 rounded-lg border border-[#8c947a]/20 text-[11px] space-y-1 text-[#c2caae]">
                  <div className="flex justify-between">
                    <span>Target Payload:</span>
                    <span className="text-[#ecdcff] font-bold">{labNotes.length} Lab Schematics</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingredients Checklist:</span>
                    <span className="text-[#ecdcff] font-bold">{groceryItems.length} Checklist Items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Export Target:</span>
                    <span className="text-[#aff81a] font-bold">SYSTEM CLIPBOARD</span>
                  </div>
                </div>

                {exportSuccess && (
                  <div className="p-3 rounded-lg bg-[#aff81a]/20 border border-[#aff81a] text-[#aff81a] text-xs text-center font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(175,248,26,0.3)]">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>SUCCESS! DATA COPIED TO SYSTEM CLIPBOARD</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-[#8dcdff]/20">
                <button
                  disabled={isExporting}
                  onClick={() => setShowExportModal(false)}
                  className={`px-5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    isExporting
                      ? 'bg-[#26193a] text-[#8c947a] border border-[#8c947a]/30 cursor-not-allowed'
                      : 'bg-[#aff81a] text-[#121f00] hover:bg-[#a6ee00] shadow-[0_0_12px_#aff81a]'
                  }`}
                >
                  {isExporting ? 'EXPORTING...' : 'DISMISS'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

