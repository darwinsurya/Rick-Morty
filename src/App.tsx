import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, DimensionInfo, Character, GroceryItem, LabNote, MultiverseNode, GalacticTheme } from './types';
import {
  INITIAL_DIMENSIONS,
  INITIAL_CHARACTERS,
  INITIAL_GROCERY,
  INITIAL_LAB_NOTES,
  INITIAL_MAP_NODES,
} from './data/mockData';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PortalHub } from './components/PortalHub';
import { Characters } from './components/Characters';
import { LabNotes } from './components/LabNotes';
import { MultiverseMap } from './components/MultiverseMap';
import { JumpModal } from './components/JumpModal';
import { SettingsModal } from './components/SettingsModal';
import { InfoModal } from './components/InfoModal';
import { DianeFlashback } from './components/DianeFlashback';
import { EasterEggToast, EggFlash } from './components/EasterEggToast';
import { EggCatalogModal } from './components/EggCatalogModal';
import { GalacticBackground } from './components/GalacticBackground';
import { TelemetryOverlay } from './components/TelemetryOverlay';
import { soundFX } from './utils/audio';

// Typing commands: keyword -> egg action (longest matches first)
const EGG_COMMANDS: Record<string, string> = {
  diane: 'memory-vial',
  plumbus: 'plumbus',
  szechuan: 'szechuan',
  meeseeks: 'meeseeks',
  morty: 'morty',
  jerry: 'jerry',
  pickle: 'pickle',
  getschwifty: 'getschwifty',
  birdperson: 'birdperson',
  poopy: 'poopy',
  egg: 'egg-catalog',
};

// Character-themed welcome phrases for app load
const CHARACTER_WELCOME_MESSAGES = [
  {
    character: 'Rick Sanchez',
    phrase: 'Wubba lubba dub dub! Welcome to Rick-OS C-137. Don\'t touch anything in the lab!',
    pitch: 0.8,
    rate: 1.0,
  },
  {
    character: 'Morty Smith',
    phrase: 'Oh geez, Rick! The portal terminal booted up. I hope nothing explodes!',
    pitch: 1.15,
    rate: 1.05,
  },
  {
    character: 'Summer Smith',
    phrase: 'Welcome to the Multiverse Network! Like, try not to break the space-time continuum.',
    pitch: 1.1,
    rate: 1.0,
  },
  {
    character: 'Beth Smith',
    phrase: 'Multiverse mainframe online. Everything is functioning within surgical precision parameters.',
    pitch: 0.95,
    rate: 0.95,
  },
  {
    character: 'Birdperson',
    phrase: 'Greetings, traveler. It has been a challenging mating season. Welcome to the Citadel OS.',
    pitch: 0.7,
    rate: 0.85,
  },
  {
    character: 'Mr. Poopybutthole',
    phrase: 'Ooh wee! Welcome to the Multiverse Terminal! We are gonna have so much fun exploring dimensions!',
    pitch: 1.3,
    rate: 1.1,
  },
  {
    character: 'Mr. Meeseeks',
    phrase: 'I\'m Mr. Meeseeks! Look at me! Welcome to Rick-OS! What can I help you jump into today?',
    pitch: 1.25,
    rate: 1.1,
  },
];

// Custom Hook: Character Welcome Audio Broadcast on App Mount
function useCharacterWelcome(audioEnabled: boolean) {
  useEffect(() => {
    let hasPlayed = false;

    const playWelcome = () => {
      if (hasPlayed || !soundFX.enabled) return;
      hasPlayed = true;

      const randomMsg =
        CHARACTER_WELCOME_MESSAGES[
          Math.floor(Math.random() * CHARACTER_WELCOME_MESSAGES.length)
        ];

      // Play sci-fi loading chime first
      soundFX.playBleep();

      // Speak character themed welcome message
      setTimeout(() => {
        soundFX.speak(randomMsg.phrase, randomMsg.pitch, randomMsg.rate);
      }, 350);
    };

    // Trigger after initial render load
    const timer = setTimeout(() => {
      playWelcome();
    }, 700);

    // Fallback trigger on first user interaction if browser autoplay policy blocks auto audio
    const handleGesture = () => {
      playWelcome();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };

    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [audioEnabled]);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('portal_hub');
  
  // Dimensions & Fluid State
  const [dimensions] = useState<DimensionInfo[]>(INITIAL_DIMENSIONS);
  const [currentDimension, setCurrentDimension] = useState<DimensionInfo>(INITIAL_DIMENSIONS[0]);
  const [targetDimension, setTargetDimension] = useState<DimensionInfo>(INITIAL_DIMENSIONS[1]);
  const [fluidLevel, setFluidLevel] = useState<number>(85); // Matches 85% VOL in mock
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // App Data Collections
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [labNotes, setLabNotes] = useState<LabNote[]>(INITIAL_LAB_NOTES);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(INITIAL_GROCERY);
  const [mapNodes, setMapNodes] = useState<MultiverseNode[]>(INITIAL_MAP_NODES);

  // System Settings & Visual FX
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [scanlineIntensity, setScanlineIntensity] = useState<number>(30);
  const [telemetryEnabled, setTelemetryEnabled] = useState<boolean>(true);
  const [galacticTheme, setGalacticTheme] = useState<GalacticTheme>('quantum_nebula');
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<{ title: string | null; text: string | null }>({
    title: null,
    text: null,
  });
  const [flashback, setFlashback] = useState<{ active: boolean; variant: 'memory-vial' | 'avatar' }>({
    active: false,
    variant: 'memory-vial',
  });

  // D-137 memory: unlocks the hidden Cradle of Grief ghost node. Persists across sessions.
  const [memoryUnlocked, setMemoryUnlocked] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('rickos-memory-c137') === 'true';
    } catch {
      return false;
    }
  });

  // Easter egg system: discovered tracking + one-shot flash + catalog
  const [discoveredEggs, setDiscoveredEggs] = useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem('rickos-eggs');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [eggFlash, setEggFlash] = useState<EggFlash | null>(null);
  const [showEggCatalog, setShowEggCatalog] = useState(false);
  const [isSchwifty, setIsSchwifty] = useState(false);

  const markEgg = (id: string) => {
    setDiscoveredEggs((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem('rickos-eggs', JSON.stringify(next));
      } catch {
        // storage unavailable — discovery persists for this session only
      }
      return next;
    });
  };

  const flashEgg = (title: string, message: string, icon: string, accent: string, tint = false) => {
    setEggFlash({ key: Date.now(), title, message, icon, accent, tint });
  };

  // Reveal a Diane memory flashback and permanently restore Memory Vial #137
  const triggerMemoryFlashback = (variant: 'memory-vial' | 'avatar') => {
    setFlashback({ active: true, variant });
    setMemoryUnlocked(true);
    markEgg(variant === 'memory-vial' ? 'memory-vial' : 'avatar-memory');
    try {
      window.localStorage.setItem('rickos-memory-c137', 'true');
    } catch {
      // storage unavailable (private mode) — unlock persists for this session only
    }
  };

  // Easter egg command dispatcher (typing eggs)
  const runEggCommand = (command: string) => {
    switch (command) {
      case 'egg-catalog':
        markEgg('egg-catalog');
        setShowEggCatalog(true);
        break;
      case 'plumbus':
        markEgg('plumbus');
        soundFX.playBleep();
        flashEgg(
          'PLUMBUS',
          'What is a plumbus? How does it function? Manufactured in a factory, sold in stores. Every household needs one.',
          'build',
          '#8dcdff'
        );
        break;
      case 'szechuan':
        markEgg('szechuan');
        soundFX.playChime();
        flashEgg(
          'MCNUGGET SAUCE EVENT',
          'YOU WANT THE MCNUGGET SAUCE, MORTY? It is back. Limited time only. Get schwifty and go get it.',
          'restaurant',
          '#ffd54a'
        );
        break;
      case 'meeseeks':
        markEgg('meeseeks');
        soundFX.playChime();
        flashEgg(
          "I'M MR. MEESEEKS!",
          "LOOK AT ME! I have a message for you: 'Hi, I'm Mr. Meeseeks!'",
          'emoji_emotions',
          '#6ecbff'
        );
        break;
      case 'morty':
        markEgg('morty');
        soundFX.playError();
        flashEgg(
          'MORTY PANIC',
          "OH JEEZ! OH MAN! W-w-we shouldn't have typed that!",
          'mood_bad',
          '#ffb4ab'
        );
        break;
      case 'jerry':
        markEgg('jerry');
        soundFX.playError();
        flashEgg(
          'JERRY INTRUSION',
          "OH NO. JERRY FOUND THE OS. I'll just be a placeholder... please don't let him break everything.",
          'man',
          '#b8b0f0'
        );
        break;
      case 'pickle':
        markEgg('pickle');
        soundFX.playGlitch();
        flashEgg(
          "I'M PICKLE RICK!",
          'I turned myself into a pickle, Morty! A PICKLE! I am PICKLE RICK! The lab reeks of brine.',
          'eco',
          '#7dff8a',
          true
        );
        break;
      case 'getschwifty':
        markEgg('getschwifty');
        soundFX.playSchwifty();
        setIsSchwifty(true);
        flashEgg(
          'GET SCHWIFTY',
          'Head up, down, back and forth, back and forth... GET SCHWIFTY IN HERE!',
          'music_note',
          '#ff7ad9'
        );
        setTimeout(() => setIsSchwifty(false), 4200);
        break;
      case 'birdperson':
        markEgg('birdperson');
        soundFX.playBleep();
        flashEgg(
          'BIRDPERSON',
          'Greetings, traveler. It has been a challenging mating season.',
          'raven',
          '#8dffd1'
        );
        break;
      case 'poopy':
        markEgg('poopy');
        soundFX.playChime();
        flashEgg(
          'MR. POOPYBUTTHOLE',
          'Ooh wee! Look at you triggering secrets on the multiverse terminal!',
          'sentiment_satisfied',
          '#ffd54a'
        );
        break;
      default:
        break;
    }
  };

  // Konami code cheat: restore fluid + unlock every memory
  const triggerKonami = () => {
    markEgg('konami');
    setFluidLevel(100);
    setMemoryUnlocked(true);
    try {
      window.localStorage.setItem('rickos-memory-c137', 'true');
    } catch {
      // storage unavailable
    }
    soundFX.playPortalJump();
    soundFX.speak('Cheat code accepted. All systems nominal.');
    flashEgg(
      'CHEAT MODE ACTIVE',
      'Portal fluid restored. Memory Vial #137 unlocked. You have seen everything.',
      'terminal',
      '#aff81a'
    );
  };

  // Sync soundFX enable state
  useEffect(() => {
    soundFX.enabled = audioEnabled;
  }, [audioEnabled]);

  // Hidden easter eggs: type secret keywords (e.g. "diane", "egg", "pickle") or the Konami code
  const eggBuffer = useRef('');
  const konamiSeq = useRef<string[]>([]);

  useEffect(() => {
    const KONAMI = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
    ];
    const konamiKeys = new Set(KONAMI);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const keyName = e.key.toLowerCase();

      // Konami code tracking (arrows + b/a)
      if (konamiKeys.has(keyName)) {
        const seq = [...konamiSeq.current, keyName].slice(-KONAMI.length);
        konamiSeq.current = seq;
        if (seq.length === KONAMI.length && seq.every((k, i) => k === KONAMI[i])) {
          konamiSeq.current = [];
          triggerKonami();
        }
      } else {
        konamiSeq.current = [];
      }

      // Typing keywords
      if (e.key.length !== 1) return;
      const ch = e.key.toLowerCase();
      if (!/[a-z]/.test(ch)) return;

      eggBuffer.current = (eggBuffer.current + ch).slice(-12);
      const keywords = Object.keys(EGG_COMMANDS);
      const match = keywords
        .filter((k) => eggBuffer.current.endsWith(k))
        .sort((a, b) => b.length - a.length)[0];
      if (match) {
        eggBuffer.current = '';
        runEggCommand(EGG_COMMANDS[match]);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Invoke character-themed welcome message hook on application load
  useCharacterWelcome(audioEnabled);

  const triggerQuantumGlitch = () => {
    soundFX.playGlitch();
    soundFX.speak('Warning! Quantum anomaly registered. Space-time distortion active.');
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
    }, 1800);
  };

  // Portal Jump Action with Robotic OS Voice
  const handleInitiateJump = () => {
    if (fluidLevel <= 0) {
      soundFX.playError();
      soundFX.speak('Warning! Portal fluid depleted. Quantum warp jump aborted.');
      return;
    }

    setIsJumping(true);
    soundFX.playPortalJump();
    soundFX.speak(`Initiating interdimensional jump sequence to ${targetDimension.name}. Prepare for space-time shift.`);

    // Consume portal fluid
    setFluidLevel((prev) => Math.max(0, prev - 15));

    setTimeout(() => {
      // Arrive at destination
      setCurrentDimension(targetDimension);
      
      // Select next target dimension automatically for variety
      const otherDims = dimensions.filter((d) => d.id !== targetDimension.id);
      const nextTarget = otherDims[Math.floor(Math.random() * otherDims.length)];
      if (nextTarget) setTargetDimension(nextTarget);

      setIsJumping(false);
      setActiveTab('portal_hub');
      soundFX.speak(`Arrival confirmed. Welcome to ${targetDimension.name}. All environmental sensors nominal.`);
    }, 2800);
  };

  const handleSelectDimensionToJump = (dimCode: string) => {
    const matched = dimensions.find(
      (d) => d.code.toLowerCase() === dimCode.toLowerCase() || d.name.toLowerCase().includes(dimCode.toLowerCase())
    );
    if (matched) {
      setTargetDimension(matched);
    } else {
      // Create ad-hoc dimension info if code doesn't exist
      const adhocDim: DimensionInfo = {
        id: `dim-${Date.now()}`,
        name: `Dimension ${dimCode}`,
        code: dimCode,
        coherence: Math.floor(Math.random() * 30) + 70,
        temporalFlux: 'Nominal',
        temporalFluxPercent: Math.floor(Math.random() * 50) + 20,
        threatLevel: 'Warning',
        dominantSpecies: 'Unmapped Entities',
        varianceIndex: Number((Math.random() * 0.5).toFixed(4)),
        status: 'STABLE',
        description: `Uncharted timeline area discovered on the Multiverse map.`,
        notes: `Telemetry coordinates logged into C-137 nav computer.`,
      };
      setTargetDimension(adhocDim);
    }
    handleInitiateJump();
  };

  // Grocery Handlers
  const handleToggleGrocery = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddGrocery = (text: string) => {
    setGroceryItems((prev) => [
      ...prev,
      { id: `g-${Date.now()}`, text, completed: false },
    ]);
  };

  // Lab Note Handler
  const handleAddLabNote = (note: LabNote) => {
    setLabNotes((prev) => [note, ...prev]);
  };

  const handleDeleteLabNote = (id: string) => {
    setLabNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Character Handler
  const handleAddCharacter = (char: Character) => {
    setCharacters((prev) => [char, ...prev]);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  // Multiverse Node Handler
  const handleAddCustomNode = (node: MultiverseNode) => {
    setMapNodes((prev) => [...prev, node]);
  };

  // The Cradle of Grief (D-137) is a ghost signal: hidden until Memory Vial #137 is restored
  const visibleMapNodes = useMemo(
    () => (memoryUnlocked ? mapNodes : mapNodes.filter((n) => n.id !== 'node-cradle-grief')),
    [memoryUnlocked, mapNodes]
  );

  // System Reset
  const handleResetSystem = () => {
    setCurrentDimension(INITIAL_DIMENSIONS[0]);
    setTargetDimension(INITIAL_DIMENSIONS[1]);
    setFluidLevel(85);
    setCharacters(INITIAL_CHARACTERS);
    setLabNotes(INITIAL_LAB_NOTES);
    setGroceryItems(INITIAL_GROCERY);
    setMapNodes(INITIAL_MAP_NODES);
    setActiveTab('portal_hub');
  };

  return (
    <div className={`min-h-screen flex flex-col relative font-body text-[#ecdcff] bg-[#190c2d] selection:bg-[#aff81a] selection:text-[#121f00] overflow-x-hidden theme-${galacticTheme} ${isGlitching ? 'glitch-active' : ''} ${isSchwifty ? 'schwifty-mode' : ''}`}>
      {/* Full-Screen Visual Glitch Overlay Burst */}
      {isGlitching && <div className="glitch-overlay-burst" />}

      {/* Interactive Galactic Background */}
      <GalacticBackground
        scanlinesEnabled={scanlinesEnabled}
        scanlineIntensity={scanlineIntensity}
        theme={galacticTheme}
        onThemeChange={setGalacticTheme}
      />

      {/* Real-time High Frequency Telemetry HUD Overlay */}
      <TelemetryOverlay enabled={telemetryEnabled} theme={galacticTheme} />

      {/* Single Unified Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fluidLevel={fluidLevel}
        onInitiateJump={handleInitiateJump}
        openSettings={() => setShowSettings(true)}
        galacticTheme={galacticTheme}
        setGalacticTheme={setGalacticTheme}
        onAvatarEgg={() => triggerMemoryFlashback('avatar')}
        openPower={() =>
          setInfoModal({
            title: 'EMERGENCY PROTOCOL',
            text: 'System emergency power standby active. In case of unexpected citadel breach, click INITIATE JUMP to warp immediately.',
          })
        }
      />

      {/* Main Content Canvas */}
      <main className="flex-grow pt-20 sm:pt-24 md:pt-28 pb-12 px-3 sm:px-6 md:px-10 max-w-7xl mx-auto w-full flex flex-col justify-center min-h-[calc(100vh-140px)] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.82, y: 60, rotateX: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.35, y: -40, z: -180, rotateX: -14, filter: 'blur(12px)' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
            className="w-full flex flex-col flex-grow items-center justify-center"
          >
            {activeTab === 'portal_hub' && (
              <PortalHub
                currentDimension={currentDimension}
                targetDimension={targetDimension}
                allDimensions={dimensions}
                setTargetDimension={setTargetDimension}
                fluidLevel={fluidLevel}
                refillFluid={() => setFluidLevel(100)}
                onInitiateJump={handleInitiateJump}
                isJumping={isJumping}
              />
            )}

            {activeTab === 'characters' && (
              <Characters
                characters={characters}
                onAddCharacter={handleAddCharacter}
                onDeleteCharacter={handleDeleteCharacter}
              />
            )}

            {activeTab === 'lab_notes' && (
              <LabNotes
                labNotes={labNotes}
                groceryItems={groceryItems}
                onToggleGrocery={handleToggleGrocery}
                onAddGrocery={handleAddGrocery}
                onAddLabNote={handleAddLabNote}
                onDeleteLabNote={handleDeleteLabNote}
                onTriggerAnomaly={triggerQuantumGlitch}
              />
            )}

            {activeTab === 'multiverse_map' && (
              <MultiverseMap
                nodes={visibleMapNodes}
                currentDimension={currentDimension}
                onSelectDimensionToJump={handleSelectDimensionToJump}
                onAddCustomNode={handleAddCustomNode}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenModal={(title, text) => setInfoModal({ title, text })}
        onInitiateJump={handleInitiateJump}
        refillFluid={() => setFluidLevel(100)}
        fluidLevel={fluidLevel}
      />

      {/* Full-Screen Warp Jump Animation Modal */}
      {isJumping && <JumpModal targetDimension={targetDimension} />}

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        scanlinesEnabled={scanlinesEnabled}
        setScanlinesEnabled={setScanlinesEnabled}
        scanlineIntensity={scanlineIntensity}
        setScanlineIntensity={setScanlineIntensity}
        telemetryEnabled={telemetryEnabled}
        setTelemetryEnabled={setTelemetryEnabled}
        galacticTheme={galacticTheme}
        setGalacticTheme={setGalacticTheme}
        onRefillFluid={() => setFluidLevel(100)}
        onResetSystem={handleResetSystem}
      />

      {/* General Information Dialog */}
      <InfoModal
        title={infoModal.title}
        text={infoModal.text}
        onClose={() => setInfoModal({ title: null, text: null })}
      />

      {/* Diane Sanchez Memory Flashback */}
      <AnimatePresence>
        {flashback.active && (
          <DianeFlashback
            variant={flashback.variant}
            onClose={() => setFlashback((f) => ({ ...f, active: false }))}
          />
        )}
      </AnimatePresence>

      {/* Easter Egg One-Shot Flash */}
      <EasterEggToast flash={eggFlash} onClose={() => setEggFlash(null)} />

      {/* Easter Egg Directory (type "egg") */}
      <EggCatalogModal
        isOpen={showEggCatalog}
        discovered={discoveredEggs}
        onClose={() => setShowEggCatalog(false)}
      />
    </div>
  );
}
