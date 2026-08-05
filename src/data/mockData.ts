import { Character, DimensionInfo, GroceryItem, LabNote, MultiverseNode } from '../types';

export const INITIAL_DIMENSIONS: DimensionInfo[] = [
  {
    id: 'c-137',
    name: 'Earth C-137',
    code: 'J-19ζ',
    coherence: 98.4,
    temporalFlux: 'Warning',
    temporalFluxPercent: 75,
    threatLevel: 'Critical',
    dominantSpecies: 'Human (Primarily)',
    varianceIndex: 0.00421,
    status: 'STABLE',
    description: 'Original home timeline of Rick Sanchez C-137. Highly volatile portal activity and chronologically unstable.',
    notes: 'Primary hub. Grav-tether locked to Council of Ricks central beacon.'
  },
  {
    id: 'cronenberg',
    name: 'Cronenberg World',
    code: 'C-137-ALT',
    coherence: 42.1,
    temporalFlux: 'Critical',
    temporalFluxPercent: 92,
    threatLevel: 'Extreme',
    dominantSpecies: 'Cronenberg Monsters',
    varianceIndex: 0.8841,
    status: 'MUTATED',
    description: 'Abandoned after love potion flu virus mutated humanity into grotesque, writhing genetic horrors.',
    notes: 'Only Jerry, Beth, and Summer survived in primitive scavenger state.'
  },
  {
    id: 'bird-world',
    name: 'Bird World',
    code: 'BW-909',
    coherence: 91.0,
    temporalFlux: 'Nominal',
    temporalFluxPercent: 20,
    threatLevel: 'Moderate',
    dominantSpecies: 'Avian Humanoids',
    varianceIndex: 0.012,
    status: 'STABLE',
    description: 'Homeworld of Birdperson and the Avian Resistance against the Galactic Federation.',
    notes: 'High roost elevation. Ideal for re-supplying portal fluid isotopes.'
  },
  {
    id: 'citadel',
    name: 'Citadel of Ricks',
    code: 'CIT-001',
    coherence: 99.9,
    temporalFlux: 'Controlled',
    temporalFluxPercent: 10,
    threatLevel: 'Critical',
    dominantSpecies: 'Ricks & Mortys',
    varianceIndex: 0.0001,
    status: 'STABLE',
    description: 'Interdimensional megalopolis governed by Ricks from across the Central Finite Curve.',
    notes: 'Warning: Evil Morty election protocol active. High political intrigue.'
  },
  {
    id: 'gazorpazorp',
    name: 'Gazorpazorp',
    code: 'GZ-404',
    coherence: 87.5,
    temporalFlux: 'Nominal',
    temporalFluxPercent: 45,
    threatLevel: 'Warning',
    dominantSpecies: 'Gazorpazorpian Females',
    varianceIndex: 0.145,
    status: 'STABLE',
    description: 'Matriarchal society with advanced technology and hyper-aggressive male offspring.',
    notes: 'Do not bring sex-robots or males near the high council chambers.'
  },
  {
    id: 'froopyland',
    name: 'Froopyland',
    code: 'FLP-777',
    coherence: 65.0,
    temporalFlux: 'Bizarre',
    temporalFluxPercent: 30,
    threatLevel: 'Warning',
    dominantSpecies: 'Chalk Creatures & Tommy clones',
    varianceIndex: 0.552,
    status: 'QUARANTINED',
    description: 'Procedurally generated child dimension created by Rick for young Beth with rainbow rivers.',
    notes: 'Containment breach: Tommy cannibalization ecosystem established.'
  }
];

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'diane-sanchez',
    name: 'Diane Sanchez',
    dimension: 'C-137 (Erased by Omega Device)',
    description: 'Wife of Rick C-137 and mother of Beth. Erased from every reality in the Central Finite Curve by Rick Prime using the Omega Device. Her memory remains Rick\'s tragic core motivation.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC04ikmC7lnUxSXQiLORn1s-2unsXOSq1KIlX5_fN9vvzInJM8YwFulD2JwAA3dcI05W0SjelexxmmyZtDYFRg9JCNQrjX7RkaD5BwPN8nB4kg4Ov6bhFqckL-30oxStrqFLapqQsfgNjHC4HndTjXfiEGYYiVlkc-cQiq70QYSYnBykOwuv87L4QV-FLinP1Ak2Tysve8iGZH6Q9Xj46AsTT4Z_mj7xptoNhFqt6eEBc53zJIduhI6Ww',
    imageAlt: 'Holographic remembrance of Diane Sanchez surrounded by soft quantum green aura',
    intelligence: 88,
    chaosLevel: 10,
    anxietyLevel: 15,
    dangerRating: 5,
    techProficiency: 82,
    status: 'Dead',
    species: 'Human',
    originTimeline: 'Earth C-137 (Reality Erased)',
    quotes: [
      { quote: 'Rick, you don’t need a portal gun to change the universe. You already changed mine.', context: 'Audio transcript recovered from C-137 garage prior to Rick Prime’s bomb explosion.', soundType: 'general' },
      { quote: 'If you build that portal gun, you’ll never truly come back to us, Rick.', context: 'Sub-space echo recorded by Rick C-137\'s grief telemetry tracker.', soundType: 'general' },
      { quote: 'I love you, Rick. Whatever happens across infinite worlds, remember who you were.', context: 'Extracted from Rick\'s neural memory core backup.', soundType: 'general' }
    ],
    equipment: [
      { name: 'Omega Device Memory Fragment', type: 'Temporal Artifact', power: 99, description: 'Contains the last surviving sub-space audio transcript of Diane before total reality erasure.' },
      { name: 'Haunted Garage AI Matrix', type: 'Voice Synthesizer', power: 90, description: 'A synthetic voice loop built by Rick C-137 in his grief to simulate her presence in the garage.' },
      { name: 'C-137 Wedding Ring', type: 'Personal Item', power: 50, description: 'A titanium ring micro-infused with quantum luminescent particles.' }
    ],
    associates: ['Rick Sanchez C-137', 'Beth Smith (C-137)', 'Rick Prime (Nemesis)']
  },
  {
    id: 'rick-c137',
    name: 'Rick Sanchez',
    dimension: 'C-137',
    description: 'Genius scientist, interdimensional traveler, and cynical grandfather. Avoids therapy. Loves Szechuan sauce.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFIfJB6Zy-sHHGW5diUeLjbiuW43vBTkqM7ZSCEACouPvX1VwMbqu2oKKrcMtKC1PRBKsyD1qKpLGbIt1hcXxnm-yTXORGyk1Z_AgVe_f6_a7J1LAtKtU_xoiei5K6m5cAXNsLyzH5PnEfsTklRtbXCpRTuGKpn_yZdG1r8zA1u0hFzWmLjZFhDIw9gvHfHqnCmpWILa-QHHu68vM68xVsK__NeQOuOhgwmJ8m6L0nhNFSrxU25jTvXQ',
    imageAlt: 'A chaotic, cynical mad scientist with spiky blue hair in a white lab coat glowing with neon green light.',
    intelligence: 100,
    chaosLevel: 98,
    dangerRating: 99,
    techProficiency: 100,
    status: 'Alive',
    species: 'Human',
    originTimeline: 'Earth C-137 (Central Finite Curve)',
    quotes: [
      { quote: 'Wubba Lubba Dub Dub!', context: 'Famous catchphrase when expressing inner agony.', soundType: 'rick' },
      { quote: 'Boom! Big reveal! I turned myself into a pickle, Morty!', context: 'During the Pickle Rick incident.', soundType: 'rick' },
      { quote: 'To live is to suffer, to survive is to find some meaning in the suffering.', context: 'Philosophical banter while calibrating portal gun.', soundType: 'rick' }
    ],
    equipment: [
      { name: 'Portal Gun v4.2', type: 'Interdimensional Transporter', power: 99, description: 'Fires green wormhole portals using Isotope 322 fluid.' },
      { name: 'Cybernetic Sub-Dermal Laser', type: 'Offensive Weapon', power: 94, description: 'Micro-laser concealed under forearm skin.' },
      { name: 'Microverse Power Cell', type: 'Energy Generator', power: 98, description: 'Generates infinite watts from miniature universe inhabitants.' }
    ],
    associates: ['Morty Prime', 'Birdperson', 'Squanchy', 'President of USA', 'Unity']
  },
  {
    id: 'morty-prime',
    name: 'Morty Smith',
    dimension: 'Prime',
    description: 'Nervous sidekick, grandson, and moral compass (mostly). Frequently traumatized by adventures.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-N9vZs4-So6Gb_ki2wNYOTxHCeWJ5rE4W8U31nkjpBforLQvoHgk91A8f3VxjKSaulZLH12HLAb6v6QayzL4FMauYQSVCKcZqHb1KtAPE65O-Gn6t5UkRNZdjAOQFKeQ16LJm_q0Qgy9Rq33cuYdW5E928DzG9FU3-XbvGgc8H23Jt5fdiiaj-npWM84Bvt6vscksuL4e19P8RLbwEcZTvoR63ak7P7as1Ew5VCCRXCvW29niKP_Q1Q',
    imageAlt: 'An anxious teenage boy in a yellow shirt, looking slightly panicked.',
    intelligence: 38,
    chaosLevel: 45,
    anxietyLevel: 92,
    dangerRating: 55,
    techProficiency: 40,
    status: 'Alive',
    species: 'Human',
    originTimeline: 'Earth Prime',
    quotes: [
      { quote: 'Aw jeez, Rick! I don’t think this is a good idea...', context: 'Standard reaction before jumping into hostile portal.', soundType: 'morty' },
      { quote: 'Nobody exists on purpose. Nobody belongs anywhere. Everybody’s gonna die. Come watch TV.', context: 'Comforting Summer after existential crisis.', soundType: 'morty' }
    ],
    equipment: [
      { name: 'Death Crystal', type: 'Predictive Artifact', power: 85, description: 'Shows potential future death outcomes in real time.' },
      { name: 'Plasma Blaster Pistol', type: 'Standard Sidearm', power: 65, description: 'Compact sidearm issued by Rick.' }
    ],
    associates: ['Rick C-137', 'Jessica', 'Planetina', 'Summer Smith']
  },
  {
    id: 'summer-smith',
    name: 'Summer Smith',
    dimension: 'C-137 / Prime',
    description: 'Teenage sister. Surprisingly capable in apocalyptic scenarios. Craves popularity.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzfcLbsmIwKeAemcrRM_JQwivUujqxxH7tGBjOUbmE8MTocm4tVD0bcBMI6XZqgGgRHN8kHofNXXjVCav2oFpzJGHsIK5DUtdqQ8eEPBl1i-_i4eAgnaa-giMbXQYD4tWaiM4EbFapfpKAw3hm1_0JkqxhWIhXlgrbL-Yuz-ay7Q_LaKgOHdq7yYE-fZ97UCkTKahR5ibLNPn47z2FV4A5iaz3T7d7LJJDV0KKAPrZrejlUZ8tVXMi6w',
    imageAlt: 'A teenage girl looking bored and holding a smartphone.',
    intelligence: 68,
    chaosLevel: 65,
    dangerRating: 70,
    techProficiency: 60,
    status: 'Alive',
    species: 'Human',
    originTimeline: 'Earth Prime',
    quotes: [
      { quote: 'Totally uncool, grandpa! You can’t just disintegrate my social life!', context: 'Complaining during apocalyptic alien invasion.', soundType: 'summer' },
      { quote: 'Go ahead, judge me. I rule this Mad Max wasteland now!', context: 'During the Post-Apocalyptic dimension raid.', soundType: 'summer' }
    ],
    equipment: [
      { name: 'Apocalypse Wrist-Blade', type: 'Melee Weapon', power: 75, description: 'Scavenged chrome wrist blade.' },
      { name: 'Quantum Smartphone', type: 'Communication', power: 80, description: 'Hacked phone connected to interdimensional Wi-Fi.' }
    ],
    associates: ['Rick C-137', 'Morty Prime', 'Hemorrhage', 'Tinkles']
  },
  {
    id: 'beth-smith',
    name: 'Beth Smith',
    dimension: 'C-137 / Prime',
    description: 'Horse surgeon, daughter of a genius. Struggles with abandonment issues and existential dread.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC04ikmC7lnUxSXQiLORn1s-2unsXOSq1KIlX5_fN9vvzInJM8YwFulD2JwAA3dcI05W0SjelexxmmyZtDYFRg9JCNQrjX7RkaD5BwPN8nB4kg4Ov6bhFqckL-30oxStrqFLapqQsfgNjHC4HndTjXfiEGYYiVlkc-cQiq70QYSYnBykOwuv87L4QV-FLinP1Ak2Tysve8iGZH6Q9Xj46AsTT4Z_mj7xptoNhFqt6eEBc53zJIduhI6Ww',
    imageAlt: 'A blonde woman holding a glass of wine, looking stressed.',
    intelligence: 85,
    chaosLevel: 55,
    dangerRating: 78,
    techProficiency: 72,
    status: 'Alive',
    species: 'Human',
    originTimeline: 'Earth Prime',
    quotes: [
      { quote: 'I am a real surgeon! I save equine lives every single day!', context: 'Defending her medical career to Jerry.', soundType: 'beth' },
      { quote: 'Dad, did you build me a sentient Froopyland weapon when I was eight?', context: 'Investigating childhood lab artifacts.', soundType: 'beth' }
    ],
    equipment: [
      { name: 'Surgical Laser Scalpel', type: 'Medical Tool', power: 82, description: 'High-precision laser scalpel adapted for alien anatomy.' },
      { name: 'Space-Beth Cyber Armor', type: 'Defensive Gear', power: 88, description: 'Tactical combat suit used by Space Beth.' }
    ],
    associates: ['Rick C-137', 'Space Beth', 'Jerry Smith', 'Birdperson']
  },
  {
    id: 'jerry-smith',
    name: 'Jerry Smith',
    dimension: 'C-137 / Prime',
    description: 'Insecure, unemployed father. Loves beekeeping and simple apps. Often the butt of the joke.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5kUIE8oNcymEDJK2C5-8RgBb0-4sMMd6CXDYFkm9Of-9ydLx-gPn6f_YcZx8IbE6iTbpZSREJyY9oVDnQS4dDLkooB9ZsTQGk5X5zUCD5VLTpz14qfLMQFIsHfTzUZXo3KLbyI_ErIm3Znol0t8UX9BLhkMhzbR_pJdWCeZXZTCOK8bNDStuJRvT4Q4kU8NjD2thwGGRiEbR-2DqXGYMcRllnJ_GeeWSUs5ZHs8x9hBeH3fx2Ter5Aw',
    imageAlt: 'A pathetic-looking man in a green shirt, appearing clueless.',
    intelligence: 15,
    chaosLevel: 12,
    anxietyLevel: 88,
    dangerRating: 10,
    techProficiency: 15,
    status: 'Alive',
    species: 'Human',
    originTimeline: 'Earth Prime',
    quotes: [
      { quote: 'Hungry for Apples? It’s a completely original campaign!', context: 'Pitching advertising slogan to simulation aliens.', soundType: 'jerry' },
      { quote: 'My golf swing is taking shape. I think I’m making real progress!', context: 'While ignoring dimensional collapse around him.', soundType: 'jerry' }
    ],
    equipment: [
      { name: 'Apples Campaign Portfolio', type: 'Advertising Pitch', power: 5, description: 'A folder containing simple marketing slogans.' },
      { name: 'Bee Smoker Canister', type: 'Beekeeping Tool', power: 20, description: 'Used for gentle urban backyard beekeeping.' }
    ],
    associates: ['Doofus Rick', 'Sleepy Gary', 'Beth Smith', 'Mr. Always Wants To Be Hunted']
  }
];

export const INITIAL_GROCERY: GroceryItem[] = [
  { id: '1', text: 'Kalaxian Crystals', completed: false },
  { id: '2', text: 'Fleeb Juice', completed: false },
  { id: '3', text: 'Szechuan Sauce', completed: true },
  { id: '4', text: 'Isotope 322', completed: false },
  { id: '5', text: 'Concentrated Dark Matter Catalyst', completed: false }
];

export const INITIAL_LAB_NOTES: LabNote[] = [
  {
    id: 'note-diane-omega',
    title: 'OMEGA DEVICE: DIANE SANCHEZ ERASE LOG',
    status: 'MULTIVERSE REALITY ERASED',
    modified: '00:00 AM (TEMPORAL VOID)',
    category: 'anomaly',
    content: 'CRITICAL LORE RECOVERY: Rick Prime deployed the Omega Device from Dimension Prime, deleting every variant of Diane Sanchez across every infinite universe in the Central Finite Curve. C-137 Rick constructed the Haunted Garage Voice AI to simulate her presence, but deactivated it after realizing no simulation could fill the void.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HNHLdqhoTlbU_H36f6AEEVT6IeKiOizJc8RbHnLV_yCM9VYStBXtQ8s8a3UuBJGr27bIuafC0G4roPX8IPIHbY6FNRBxy3ZbwcyWY6aJQvJccy3azML4kAYl0Rz2i2XnvmoZmMClq7_7c3v0k6rM-9jPgucMm1bcD-3KOl25gcip-xQX74CCHoyJBAXFh_LHGqcOJ1i_1ZK-v5vSEBxXbUTnvMBdwZwfj6bi6OtlULoodBoXpoEs0g',
    imageAlt: 'Omega Device Reality Dissolution Matrix Log'
  },
  {
    id: 'note-microverse',
    title: 'PROJECT: MICROVERSE BATTERY',
    status: 'UNSTABLE (NEEDS MORE FLOOBLE CRANKS)',
    modified: '02:44 AM (EARTH C-137 TIME)',
    category: 'blueprint',
    content: 'Note to self: The Miniverse within the Microverse is generating suboptimal power output. Must investigate the Teenyverse recursive loops. Current spatial compression integrity is failing at 0.04%.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSGqoTckHsRnG-IHOb1qNCAXvn0W7BztRlfn0011o14Q2dPsxqORzUEcVEvhncCo_dI0RdNZQxUNz3v2dk_AzBReyWhgB_PCoW-ZT5h1-5MyXjvYBbALySL9fRT8pvl17Q7eGH2uqm_W9diQMs-pYeuVo26ku7yRlvJaYFO5DZaDzXcFgS8XGa7DLaVirbR7tl8DB6FE7T7hg1_04uBRUW4RlcDzmXOPxEB7gfN7ccalZ-Wo8W2Mga4g',
    imageAlt: 'Microverse Battery Blueprint Schematic'
  },
  {
    id: 'note-anatomy-park',
    title: 'ANATOMY PARK SCHEMATICS',
    status: 'DECEASED HOST (RUBEN)',
    modified: '04:12 PM (EARTH C-137 TIME)',
    category: 'schema',
    location: 'RUBEN (DECEASED)',
    content: 'Pirates of the Pancreas requires major overhaul. The animatronics are getting too aggressive. Also, the smell is... problematic. Hepatitis C containment breach in sector 7G.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HNHLdqhoTlbU_H36f6AEEVT6IeKiOizJc8RbHnLV_yCM9VYStBXtQ8s8a3UuBJGr27bIuafC0G4roPX8IPIHbY6FNRBxy3ZbwcyWY6aJQvJccy3azML4kAYl0Rz2i2XnvmoZmMClq7_7c3v0k6rM-9jPgucMm1bcD-3KOl25gcip-xQX74CCHoyJBAXFh_LHGqcOJ1i_1ZK-v5vSEBxXbUTnvMBdwZwfj6bi6OtlULoodBoXpoEs0g',
    imageAlt: 'Anatomy Park Layout Map'
  }
];

export const INITIAL_MAP_NODES: MultiverseNode[] = [
  {
    id: 'node-c137',
    name: 'C-137 Prime Lab',
    dimensionCode: 'J-19ζ',
    x: 50,
    y: 50,
    threatLevel: 'Critical',
    dominantSpecies: 'Human (Primarily)',
    notes: 'Original home timeline. Currently chronologically unstable.',
    icon: 'public',
    status: 'Prime Origin',
    color: 'primary'
  },
  {
    id: 'node-cronenberg',
    name: 'Cronenberg World',
    dimensionCode: 'C-137-ALT',
    x: 25,
    y: 25,
    threatLevel: 'Critical',
    dominantSpecies: 'Cronenberg Mutations',
    notes: 'Abandoned after love potion flu virus incident. Only Jerry survived normally.',
    icon: 'coronavirus',
    status: 'Irreversibly Mutated',
    color: 'error'
  },
  {
    id: 'node-bird',
    name: 'Bird World',
    dimensionCode: 'BW-909',
    x: 75,
    y: 70,
    threatLevel: 'Moderate',
    dominantSpecies: 'Birdperson / Avian',
    notes: 'Avian sanctuary and headquarters of Birdperson. Great portal fluid refill spot.',
    icon: 'cruelty_free',
    status: 'Sanctuary',
    color: 'secondary'
  },
  {
    id: 'node-citadel',
    name: 'Citadel of Ricks',
    dimensionCode: 'CIT-001',
    x: 50,
    y: 15,
    threatLevel: 'Warning',
    dominantSpecies: 'Ricks & Mortys',
    notes: 'Massive interdimensional space station home to thousands of Ricks.',
    icon: 'location_city',
    status: 'Federated',
    color: 'tertiary'
  },
  {
    id: 'node-gazorpazorp',
    name: 'Gazorpazorp',
    dimensionCode: 'GZ-404',
    x: 80,
    y: 35,
    threatLevel: 'Warning',
    dominantSpecies: 'Female Gazorpazorpians',
    notes: 'Advanced planet ruled by women. High tech floating cities.',
    icon: 'female',
    status: 'Matriarchy',
    color: 'secondary'
  },
  {
    id: 'node-snake',
    name: 'Snake Planet',
    dimensionCode: 'SNK-101',
    x: 20,
    y: 75,
    threatLevel: 'Critical',
    dominantSpecies: 'Time-Traveling Snakes',
    notes: 'Intelligent snakes that invented time travel. Highly aggressive temporal paradoxes.',
    icon: 'pest_control',
    status: 'Temporal Hazard',
    color: 'error'
  },
  {
    id: 'node-anatomy',
    name: 'Anatomy Park',
    dimensionCode: 'ANT-001',
    x: 35,
    y: 60,
    threatLevel: 'Moderate',
    dominantSpecies: 'Microscopic Infectious Agents',
    notes: 'Amusement park inside Ruben. Pirates of the Pancreas is currently under repair.',
    icon: 'medical_services',
    status: 'Quarantined',
    color: 'tertiary'
  },
  {
    id: 'node-froopy',
    name: 'Froopyland',
    dimensionCode: 'FLP-777',
    x: 15,
    y: 40,
    threatLevel: 'Warning',
    dominantSpecies: 'Chalk Creatures & Cannibal Tommy',
    notes: 'Procedurally generated children dimension with rainbow water and breathable air.',
    icon: 'attractions',
    status: 'Isolated',
    color: 'secondary'
  },
  {
    id: 'node-microverse',
    name: 'Microverse Battery',
    dimensionCode: 'MIC-000',
    x: 65,
    y: 30,
    threatLevel: 'Low',
    dominantSpecies: 'Micro-Inhabitants',
    notes: 'Miniature universe in a box providing power to Rick car via Flooble Cranks.',
    icon: 'electric_bolt',
    status: 'Power Source',
    color: 'primary'
  },
  {
    id: 'node-purge',
    name: 'Purge World',
    dimensionCode: 'PRG-666',
    x: 85,
    y: 80,
    threatLevel: 'Critical',
    dominantSpecies: 'Amish-Style Villagers',
    notes: 'Annual Festival of the Purge held every night of the full moon.',
    icon: 'local_fire_department',
    status: 'Active Anarchy',
    color: 'error'
  },
  {
    id: 'node-squanch',
    name: 'Planet Squanch',
    dimensionCode: 'SQN-333',
    x: 70,
    y: 85,
    threatLevel: 'Moderate',
    dominantSpecies: 'Squanchies',
    notes: 'Festive tropical planet where everyone squanches wherever they squanch.',
    icon: 'pets',
    status: 'Squanchy',
    color: 'secondary'
  },
  {
    id: 'node-cable',
    name: 'Interdimensional Cable Relay',
    dimensionCode: 'IDC-999',
    x: 40,
    y: 80,
    threatLevel: 'Low',
    dominantSpecies: 'Media Broadcast Beacons',
    notes: 'Broadcast hub streaming Ball Fondlers, Gazorpazorpfield, and Baby Legs.',
    icon: 'tv',
    status: 'Streaming Live',
    color: 'tertiary'
  },
  {
    id: 'node-cradle-grief',
    name: 'The Cradle of Grief',
    dimensionCode: 'D-137',
    x: 13,
    y: 62,
    threatLevel: 'Unknown',
    dominantSpecies: 'None — Glassed Ruins',
    notes: 'The glassed remains of Rick C-137\'s original dimension — D-137. A single crater marks where Diane and young Beth were murdered by Rick Prime, the man who rejected Rick\'s portal tech and chose a life outside the Curve. Rick buried the grief, rebuilt, and never stopped hunting. Ghost signal only resolves after Memory Vial #137 is restored.',
    icon: 'home',
    status: 'Lost',
    color: 'secondary'
  }
];

export const MOCK_TERMINAL_LOGS = [
  'ERR: SPATIAL ANOMALY DETECTED IN SECTOR 4... RECALIBRATING PORTAL FLUID VISCOSITY...',
  'WARNING: NEUTRINO BOMB DEFUSAL PROTOCOL FAILED. MANUAL OVERRIDE REQUIRED...',
  'SCANNING DIMENSION J19ζ7... NO INTELLIGENT LIFE FOUND...',
  'SYSTEM UPDATE: MEESEEKS BOX INTEGRITY AT 88%... DO NOT SUMMON MORE THAN 5...',
  'INTERDIMENSIONAL CABLE FEED LOST. ATTEMPTING RECONNECTION TO BALL FONDLERS MARATHON...',
  'QUANTUM FLUCTUATION STABILIZED AT 98.4% IN COHERENCE MATRIX...',
  'ALERT: GALACTIC FEDERATION PATROL DETECTED NEAR QUADRANT 7. ACTIVATING GRAV-TETHER STEALTH MODE...'
];
