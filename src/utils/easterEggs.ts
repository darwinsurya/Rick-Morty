// RICK-OS v1.0 Easter Egg Directory — drives the "egg" catalog modal.
// Every secret in the OS is listed here with details + activation.

export interface EggEntry {
  id: string;
  title: string;
  description: string;
  activation: string;
  icon: string;
}

export const EASTER_EGGS: EggEntry[] = [
  {
    id: 'egg-catalog',
    title: 'EGG DIRECTORY',
    description: 'The meta-egg. A classified dossier of every easter egg hidden inside RICK-OS v1.0.',
    activation: 'Type "egg" anywhere',
    icon: 'menu_book',
  },
  {
    id: 'memory-vial',
    title: 'MEMORY VIAL #137',
    description: 'Restore a classified memory vial. The Sanchez family photo resurfaces with a somber music-box lullaby.',
    activation: 'Type "diane" anywhere',
    icon: 'science',
  },
  {
    id: 'avatar-memory',
    title: 'AVATAR ECHO',
    description: 'Rick\'s avatar hides a silent memory. Click it until the grief flickers through.',
    activation: 'Click Rick\'s header avatar 7 times',
    icon: 'person',
  },
  {
    id: 'warp-flashback',
    title: 'WARP FLASHBACK',
    description: 'During an interdimensional jump, the vortex occasionally glitches into the last dinner in D-137. Rare and unscripted.',
    activation: 'Initiate any jump (1-in-20 chance)',
    icon: 'rocket_launch',
  },
  {
    id: 'cradle-grief',
    title: 'CRADLE OF GRIEF',
    description: 'A ghost node on the Multiverse Map: the glassed ruins of dimension D-137. Notes detail the crater and Rick Prime.',
    activation: 'Restore any memory, then open the Multiverse Map',
    icon: 'home',
  },
  {
    id: 'plumbus',
    title: 'PLUMBUS',
    description: 'A fully functional household appliance. What is a plumbus? How does it function?',
    activation: 'Type "plumbus"',
    icon: 'build',
  },
  {
    id: 'szechuan',
    title: 'SZECHUAN SAUCE',
    description: 'You want the McNugget sauce, Morty? It\'s back. Limited time only.',
    activation: 'Type "szechuan"',
    icon: 'restaurant',
  },
  {
    id: 'meeseeks',
    title: 'MR. MEESEEKS',
    description: 'Look at me! A blue helper spawns to deliver a totally arbitrary message.',
    activation: 'Type "meeseeks"',
    icon: 'emoji_emotions',
  },
  {
    id: 'morty',
    title: 'MORTY PANIC',
    description: 'OH JEEZ. Summon the anxiety of the universe\'s most traumatized teenager.',
    activation: 'Type "morty"',
    icon: 'mood_bad',
  },
  {
    id: 'jerry',
    title: 'JERRY INTRUSION',
    description: 'A Jerry has accessed the terminal. Placeholder energy intensifies.',
    activation: 'Type "jerry"',
    icon: 'man',
  },
  {
    id: 'pickle',
    title: 'PICKLE RICK',
    description: 'He turned himself into a pickle. He is Pickle Rick. The lab reeks of brine.',
    activation: 'Type "pickle"',
    icon: 'eco',
  },
  {
    id: 'getschwifty',
    title: 'GET SCHWIFTY',
    description: 'The whole OS dances. Head up, down, back and forth... get schwifty.',
    activation: 'Type "getschwifty"',
    icon: 'music_note',
  },
  {
    id: 'birdperson',
    title: 'BIRDPERSON',
    description: 'An old friend checks in between mating seasons.',
    activation: 'Type "birdperson"',
    icon: 'raven',
  },
  {
    id: 'poopy',
    title: 'MR. POOPYBUTTHOLE',
    description: 'Ooh wee! A familiar voice from the garage drops in for a visit.',
    activation: 'Type "poopy"',
    icon: 'sentiment_satisfied',
  },
  {
    id: 'konami',
    title: 'CHEAT MODE',
    description: 'The legendary Konami code. Restores portal fluid and unlocks every memory, permanently.',
    activation: 'Press ↑ ↑ ↓ ↓ ← → ← → B A',
    icon: 'terminal',
  },
];
