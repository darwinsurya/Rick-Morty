import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DimensionInfo, MultiverseNode } from '../types';
import { soundFX } from '../utils/audio';

interface MultiverseMapProps {
  nodes: MultiverseNode[];
  currentDimension: DimensionInfo;
  onSelectDimensionToJump: (dimCode: string) => void;
  onAddCustomNode: (node: MultiverseNode) => void;
}

export const MultiverseMap: React.FC<MultiverseMapProps> = ({
  nodes,
  currentDimension,
  onSelectDimensionToJump,
  onAddCustomNode,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-c137');
  const [filterType, setFilterType] = useState<'All' | 'Critical' | 'Warning' | 'Low'>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);

  // Auto select current dimension node on tab mount or dimension change
  useEffect(() => {
    const matchingNode = nodes.find(
      (n) =>
        n.dimensionCode.toLowerCase() === currentDimension.code.toLowerCase() ||
        (n.id === 'node-c137' && (currentDimension.code === 'C-137' || currentDimension.name.includes('C-137')))
    );
    if (matchingNode) {
      setSelectedNodeId(matchingNode.id);
    }
  }, [currentDimension.code, nodes]);

  // New Node Form State
  const [newDimName, setNewDimName] = useState('');
  const [newDimCode, setNewDimCode] = useState('');
  const [newThreat, setNewThreat] = useState<'Low' | 'Moderate' | 'Warning' | 'Critical'>('Moderate');
  const [newSpecies, setNewSpecies] = useState('Unknown Species');
  const [newNotes, setNewNotes] = useState('');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const filteredNodes = nodes.filter((n) => {
    if (filterType === 'All') return true;
    return n.threatLevel === filterType;
  });

  const handleNodeClick = (id: string) => {
    soundFX.playClick();
    setSelectedNodeId((prev) => (prev === id ? null : id));
  };

  const handleScanSector = () => {
    soundFX.playBleep();
    const sectorNames = [
      'Glapflap Sub-Sector 9',
      'Wormhole Matrix Delta',
      'Bendigo Void',
      'Pluto Dwarf Sector',
      'Galactic Prison Outpost',
      'Gazorpazorp Outskirts',
      'Blim Blam Quarantine',
    ];
    const randomName = sectorNames[Math.floor(Math.random() * sectorNames.length)];
    const threats: Array<'Low' | 'Moderate' | 'Warning' | 'Critical'> = [
      'Low',
      'Moderate',
      'Warning',
      'Critical',
    ];
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];

    const newNode: MultiverseNode = {
      id: `node-${Date.now()}`,
      name: randomName,
      dimensionCode: `M-${Math.floor(Math.random() * 900 + 100)}`,
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 70) + 15,
      threatLevel: randomThreat,
      dominantSpecies: 'Unmapped Entities',
      notes: `Newly scanned sector on Central Finite Curve boundary. Telemetry data logged.`,
      icon: 'explore',
      status: 'Discovered',
      color: randomThreat === 'Critical' ? 'error' : 'primary',
    };

    onAddCustomNode(newNode);
    setSelectedNodeId(newNode.id);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDimName.trim()) return;

    soundFX.playBleep();
    const newNode: MultiverseNode = {
      id: `node-${Date.now()}`,
      name: newDimName,
      dimensionCode: newDimCode || `J-${Math.floor(Math.random() * 900 + 100)}`,
      x: Math.floor(Math.random() * 65) + 15,
      y: Math.floor(Math.random() * 65) + 15,
      threatLevel: newThreat,
      dominantSpecies: newSpecies,
      notes: newNotes || 'Uncharted sector in the Central Finite Curve.',
      icon: 'public',
      status: 'Discovered',
      color: newThreat === 'Critical' ? 'error' : 'primary',
    };

    onAddCustomNode(newNode);
    setSelectedNodeId(newNode.id);
    setShowAddNodeModal(false);
    setNewDimName('');
    setNewDimCode('');
    setNewNotes('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto min-h-[calc(100vh-180px)] py-6 flex flex-col z-10 relative"
    >
      {/* Header Section */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#ecdcff] mb-1 flex items-center gap-3">
            <span>Multiverse</span>
            <span className="text-[#aff81a] drop-shadow-[0_0_12px_rgba(175,248,26,0.6)]">Topology Map</span>
            <span className="material-symbols-outlined text-3xl text-[#aff81a] animate-spin">map</span>
          </h1>
          <p className="font-mono-tech text-xs text-[#c2caae] max-w-2xl leading-relaxed">
            Central Finite Curve projection active. Displaying localized reality clusters and high-variance dimensional nodes ({nodes.length} SECTORS CHARTED).
          </p>
        </div>

        {/* Action Controls & HUD */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Filter Buttons */}
          <div className="flex bg-[#140727] p-1 rounded-lg border border-[#8c947a]/30 font-mono-tech text-xs">
            {(['All', 'Critical', 'Warning', 'Low'] as const).map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundFX.playClick();
                  setFilterType(type);
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-[#aff81a] text-[#121f00] font-bold shadow-[0_0_8px_#aff81a]'
                    : 'text-[#c2caae] hover:text-[#aff81a]'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          {/* Quick Scan Sector */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScanSector}
            className="px-3.5 py-2 bg-[#26193a] border border-[#aff81a]/50 text-[#aff81a] hover:bg-[#aff81a]/20 font-mono-tech text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
          >
            <span className="material-symbols-outlined text-base">radar</span>
            <span>Scan Unmapped Sector</span>
          </motion.button>

          {/* Chart Dimension Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundFX.playClick();
              setShowAddNodeModal(true);
            }}
            className="px-3.5 py-2 bg-[#aff81a] text-[#121f00] font-mono-tech text-xs font-bold rounded-lg hover:bg-[#a6ee00] transition-all shadow-[0_0_15px_#aff81a] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            <span>Chart Dimension</span>
          </motion.button>
        </div>
      </header>

      {/* 3D Map Canvas Area */}
      <div className="flex-grow relative map-container border border-[#8c947a]/40 rounded-2xl overflow-hidden glass-panel bg-[#140727]/90 min-h-[380px] sm:min-h-[460px] md:min-h-[540px] flex items-center justify-center shadow-2xl">
        {/* Cosmic Grid Overlay */}
        <div className="absolute inset-[-50%] cosmic-grid pointer-events-none" />

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col bg-[#140727]/90 border border-[#8c947a]/40 rounded-xl overflow-hidden font-mono-tech shadow-lg">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundFX.playClick();
              setZoomLevel((z) => Math.min(1.4, z + 0.15));
            }}
            className="p-2 text-[#aff81a] hover:bg-[#26193a] cursor-pointer"
            title="Zoom In Map"
          >
            <span className="material-symbols-outlined text-sm">zoom_in</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundFX.playClick();
              setZoomLevel(1);
            }}
            className="p-2 text-[#8dcdff] hover:bg-[#26193a] cursor-pointer border-t border-b border-[#8c947a]/30 text-[10px] font-bold"
            title="Reset Zoom"
          >
            1:1
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundFX.playClick();
              setZoomLevel((z) => Math.max(0.7, z - 0.15));
            }}
            className="p-2 text-[#aff81a] hover:bg-[#26193a] cursor-pointer"
            title="Zoom Out Map"
          >
            <span className="material-symbols-outlined text-sm">zoom_out</span>
          </motion.button>
        </div>

        {/* Zoomable Container */}
        <div
          className="w-full h-full absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Dimension Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isPrime = node.id === 'node-c137';
            const isCurrentLocation =
              node.dimensionCode.toLowerCase() === currentDimension.code.toLowerCase() ||
              (isPrime && (currentDimension.code === 'C-137' || currentDimension.name.includes('C-137')));

            // D-137 ghost node: a desaturated, wireframe echo that only resolves after the memory is restored
            const isGhost = node.id === 'node-cradle-grief';

            // Bottom-edge nodes get their labels flipped above so they never clip off the map canvas
            const isBottomEdge = node.y >= 75;

            let nodeBg = 'bg-[#a6ee00] text-[#121f00]';
            let borderGlow = 'shadow-[0_0_20px_#aff81a]';

            if (isGhost) {
              nodeBg = 'bg-transparent text-[#aae3ea] border-2 border-dashed border-[#aae3ea]/80';
              borderGlow = 'shadow-[0_0_18px_rgba(221,251,255,0.25)]';
            } else if (node.threatLevel === 'Critical') {
              nodeBg = 'bg-[#93000a] text-[#ffdad6] border-2 border-[#ffb4ab]';
              borderGlow = 'shadow-[0_0_20px_rgba(255,180,171,0.6)]';
            } else if (node.color === 'secondary') {
              nodeBg = 'bg-[#00affe] text-[#001e30] border-2 border-[#8dcdff]';
              borderGlow = 'shadow-[0_0_20px_rgba(141,205,255,0.6)]';
            } else if (node.color === 'tertiary') {
              nodeBg = 'bg-[#aae3ea] text-[#002023] border-2 border-[#ddfbff]';
              borderGlow = 'shadow-[0_0_20px_rgba(221,251,255,0.6)]';
            }

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.3, zIndex: 40 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNodeClick(node.id)}
                className="absolute z-20 group cursor-pointer"
                style={{ left: `${node.x}%`, top: `${node.y}%`, marginLeft: -20, marginTop: -20 }}
              >
                {/* Sonar Radar Ping Pulse for Current Location */}
                {isCurrentLocation && (
                  <>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.9 }}
                      animate={{ scale: [1, 2.4, 1], opacity: [0.9, 0, 0.9] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute -inset-4 rounded-full border-2 border-[#aff81a] pointer-events-none shadow-[0_0_20px_#aff81a]"
                    />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: [1, 3.2, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.2, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute -inset-4 rounded-full border border-[#8dcdff] pointer-events-none"
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#aff81a] text-[#121f00] font-mono-tech text-[9px] font-bold shadow-[0_0_12px_#aff81a] z-30 whitespace-nowrap flex items-center gap-1 pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#121f00] animate-ping" />
                      <span>CURRENT LOCATION</span>
                    </div>
                  </>
                )}

                {isGhost && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-3 rounded-full border border-[#aae3ea]/60 pointer-events-none"
                  />
                )}

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center relative ${nodeBg} ${borderGlow} ${
                    isPrime ? 'node-pulse' : ''
                  } ${isGhost ? 'animate-[pulse_2.4s_ease-in-out_infinite]' : ''}`}
                  style={isGhost ? { filter: 'grayscale(0.8) saturate(0.35)' } : undefined}
                >
                  <span className="material-symbols-outlined font-bold text-lg">{node.icon}</span>

                  {isSelected && (
                    <div className="absolute -inset-2.5 rounded-full border-2 border-[#aff81a] animate-ping opacity-75" />
                  )}
                </div>

                {/* Node Title Label (flips above the node on bottom-edge nodes so it stays on-canvas) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-center pointer-events-none whitespace-nowrap z-10 ${
                    isBottomEdge ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                >
                  <div
                    className={`font-mono-tech text-xs font-bold drop-shadow-md ${
                      isGhost ? 'text-[#aae3ea] flicker-text' : 'text-[#aff81a]'
                    }`}
                  >
                    {node.name}
                  </div>
                  <div className={`font-mono-tech text-[10px] ${isGhost ? 'text-[#aae3ea]/50' : 'text-[#c2caae]'}`}>
                    {node.dimensionCode}
                    {isGhost && <span className="ml-1 text-[8px] tracking-widest">· GHOST SIGNAL</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Connected Visual Lines overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {selectedNode && (
              <line
                x1="50%"
                y1="50%"
                x2={`${selectedNode.x}%`}
                y2={`${selectedNode.y}%`}
                stroke="#aff81a"
                strokeWidth="2.5"
                strokeDasharray="6"
                className="animate-pulse"
              />
            )}
            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#aff81a" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="50%" x2="75%" y2="70%" stroke="#8dcdff" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#ddfbff" strokeWidth="1" strokeDasharray="4" />
          </svg>
        </div>

        {/* Selected Node Telemetry Info Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, scale: 0.85, y: 25, rotateX: 12, rotateY: -8, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.85, y: 25, rotateX: -12, rotateY: 8, filter: 'blur(5px)' }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              style={{ transformPerspective: 900, transformOrigin: 'bottom left' }}
              className="absolute bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:right-6 sm:w-80 md:left-8 glass-panel glass-panel-active p-5 rounded-2xl border-2 border-[#aff81a] z-30 shadow-[0_0_40px_rgba(175,248,26,0.4)] bg-[#140727]/95"
            >
              <div className="flex justify-between items-start mb-3 border-b border-[#aff81a]/30 pb-2">
                <div>
                  <h3 className="font-headline-md text-xl text-[#aff81a] font-bold">
                    {selectedNode.name}
                  </h3>
                  <span className="font-mono-tech text-xs text-[#8dcdff]">
                    {selectedNode.dimensionCode}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="space-y-2 font-mono-tech text-xs text-[#ecdcff]">
                <div className="flex justify-between border-b border-[#8c947a]/20 pb-1">
                  <span className="text-[#c2caae]">Threat Level:</span>
                  <span
                    className={
                      selectedNode.threatLevel === 'Critical'
                        ? 'text-[#ffb4ab] font-bold'
                        : 'text-[#aff81a] font-bold'
                    }
                  >
                    {selectedNode.threatLevel}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#8c947a]/20 pb-1">
                  <span className="text-[#c2caae]">Species:</span>
                  <span className="text-[#ddfbff]">{selectedNode.dominantSpecies}</span>
                </div>

                <div className="pt-1">
                  <span className="text-[#c2caae] block mb-1">Telemetry Notes:</span>
                  <p className="text-xs text-[#c2caae]/90 bg-[#140727]/80 p-2 rounded-lg border border-[#8c947a]/20 leading-relaxed">
                    {selectedNode.notes}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundFX.playPortalJump();
                  onSelectDimensionToJump(selectedNode.dimensionCode);
                }}
                className="mt-4 w-full py-2 bg-[#aff81a] text-[#121f00] hover:bg-[#a6ee00] font-mono-tech text-xs font-bold rounded-lg shadow-[0_0_15px_#aff81a] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">explore</span>
                <span>SET COORDINATES & JUMP</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Atmospheric Data Overlay */}
        <div className="absolute top-4 left-4 font-mono-tech text-xs text-[#ddfbff]/50 flicker-text pointer-events-none">
          SYS.TRACKING_ACTIVE<br />
          NODES_FOUND: {nodes.length}
        </div>
      </div>

      {/* Modal to Add New Custom Dimension */}
      <AnimatePresence>
        {showAddNodeModal && (
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
                  <span className="material-symbols-outlined">public</span>
                  <span>CHART NEW DIMENSION NODE</span>
                </h3>
                <button
                  onClick={() => setShowAddNodeModal(false)}
                  className="text-[#c2caae] hover:text-[#ffb4ab] cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateNode} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#c2caae] mb-1">DIMENSION NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gazorpazorp Prime or Purge World"
                    value={newDimName}
                    onChange={(e) => setNewDimName(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div>
                  <label className="block text-[#c2caae] mb-1">DIMENSION CODE</label>
                  <input
                    type="text"
                    placeholder="e.g. J-19ζ9 or GZ-505"
                    value={newDimCode}
                    onChange={(e) => setNewDimCode(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#c2caae] mb-1">THREAT LEVEL</label>
                    <select
                      value={newThreat}
                      onChange={(e) => setNewThreat(e.target.value as 'Low' | 'Moderate' | 'Warning' | 'Critical')}
                      className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Warning">Warning</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#c2caae] mb-1">DOMINANT SPECIES</label>
                    <input
                      type="text"
                      placeholder="e.g. Gearhead Avian"
                      value={newSpecies}
                      onChange={(e) => setNewSpecies(e.target.value)}
                      className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#c2caae] mb-1">TELEMETRY NOTES</label>
                  <textarea
                    rows={3}
                    placeholder="Enter observations on physical laws, portals, or inhabitants..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-[#140727] border border-[#8dcdff]/30 text-[#ecdcff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#aff81a]"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNodeModal(false)}
                    className="px-4 py-2 bg-[#3c2e50] text-[#ecdcff] rounded-lg hover:bg-[#403355] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#aff81a] text-[#121f00] font-bold rounded-lg hover:bg-[#a6ee00] shadow-[0_0_10px_#aff81a] cursor-pointer"
                  >
                    PLOT ON MAP
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

