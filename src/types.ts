export type NavTab = 'portal_hub' | 'characters' | 'lab_notes' | 'multiverse_map';

export type GalacticTheme = 'quantum_nebula' | 'deep_space' | 'cyber_magenta' | 'citadel_matrix' | 'cronenberg_crimson';

export interface DimensionInfo {
  id: string;
  name: string;
  code: string;
  coherence: number;
  temporalFlux: string;
  temporalFluxPercent: number;
  threatLevel: 'Low' | 'Moderate' | 'Warning' | 'Critical' | 'Extreme';
  dominantSpecies: string;
  varianceIndex: number;
  status: 'STABLE' | 'UNSTABLE' | 'MUTATED' | 'QUARANTINED' | 'COLLAPSED';
  description: string;
  notes: string;
}

export interface CharacterEquipment {
  name: string;
  type: string;
  power: number;
  description: string;
}

export interface CharacterQuote {
  quote: string;
  context: string;
  soundType?: 'rick' | 'morty' | 'summer' | 'beth' | 'jerry' | 'general';
}

export interface Character {
  id: string;
  name: string;
  dimension: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  intelligence: number; // 0-100
  chaosLevel: number; // 0-100
  anxietyLevel?: number; // 0-100
  dangerRating?: number; // 0-100
  techProficiency?: number; // 0-100
  status: 'Alive' | 'Dead' | 'Cloned' | 'Unknown';
  species: string;
  originTimeline?: string;
  quotes?: CharacterQuote[];
  equipment?: CharacterEquipment[];
  associates?: string[];
}

export interface GroceryItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface LabNote {
  id: string;
  title: string;
  status: string;
  modified: string;
  content: string;
  category: 'blueprint' | 'stream' | 'checklist' | 'schema' | 'anomaly';
  imageUrl?: string;
  imageAlt?: string;
  location?: string;
}

export interface MultiverseNode {
  id: string;
  name: string;
  dimensionCode: string;
  x: number; // percentage offset or coord
  y: number;
  z?: number;
  threatLevel: 'Low' | 'Moderate' | 'Warning' | 'Critical' | 'Unknown';
  dominantSpecies: string;
  notes: string;
  icon: string;
  status: string;
  color: 'primary' | 'error' | 'secondary' | 'tertiary';
}

