/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Rarity = 'Common' | 'Rare' | 'Legendary';
export type UserRole = 'ADMIN' | 'PLAYER';

export interface Sticker {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  rarity: Rarity;
  pwr: number;
  cut: number;
  theme: GameTheme;
}

export interface UserStats {
  credits: number;
  inventory: string[]; // Array of sticker IDs
  unlockedThemes: GameTheme[]; // Themes the user has access to
  completedLevels: number;
  role: UserRole;
  username: string;
  email?: string;
  progressMetrics?: Record<string, number>; 
  unlockedMusics?: string[]; // Array of music URLs unlocked as rewards
}

export interface StoreCreditPack {
  id: string;
  amount: number;
  price: number;
  label: string;
  isPromo?: boolean;
  bonusAmount?: number;
}

export type GameModuleType = 
  | 'Letters' 
  | 'Syllables' 
  | 'Digraphs' 
  | 'Order' 
  | 'Tonic' 
  | 'Phrases' 
  | 'Match'
  | 'Adjectives'
  | 'Praxias';

export type GameTheme = 'Zoo' | 'History' | 'Home' | 'Space' | 'Ocean' | 'Arctic' | 'Desert' | 'Farm';
export type Language = 'PT' | 'EN' | 'ES' | 'FR';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'audio';
  theme?: GameTheme;
}

export interface RadioSong {
  url: string;
  title: string;
  artist: string;
  color: string;
}

export interface AppConfig {
  themeBgs: Record<GameTheme, string>;
  themeMusics: Record<GameTheme, string[]>;
  themeVideos: Record<GameTheme, string[]>;
  mediaLibrary: MediaAsset[];
  radioSongs: RadioSong[];
  masterVolume: number;
}

export interface GameLevel {
  id: string;
  type: GameModuleType;
  theme: GameTheme;
  lang: Language;
  question: string;
  answer: string;
  options: string[];
  image?: string;
  difficulty?: number; // 1-50
  targetName?: string; // For DragMatch games, the label of the correct target
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  username: string;
}

export interface ManagedUser {
  id: string;
  username: string;
  credits: number;
  status: 'active' | 'locked';
  lastActivity: string;
  unlockedThemes: number;
}
