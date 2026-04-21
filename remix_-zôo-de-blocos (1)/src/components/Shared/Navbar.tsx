/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ShoppingBag, 
  BookOpen, 
  LayoutDashboard, 
  Star, 
  LogOut,
  Sparkles,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserStats, Language } from '../../types';

interface NavbarProps {
  user: UserStats;
  currentView: string;
  language: Language;
  onViewChange: (view: any) => void;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function Navbar({ user, currentView, onViewChange, onLogout, language, onLanguageChange, isMuted, onToggleMute }: NavbarProps) {
  return (
    <nav className="fixed top-4 left-4 right-4 z-[100] bg-white/80 backdrop-blur-3xl border-b-8 border-black/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => onViewChange(user.role === 'ADMIN' ? 'admin' : 'world')}
        >
          <motion.div 
            whileHover={{ rotate: [6, -6, 6], scale: 1.1 }}
            className="w-14 h-14 rounded-2xl bg-accent-block-yellow flex items-center justify-center shadow-xl border-4 border-white rotate-6"
          >
            <Trophy className="text-white" size={32} />
          </motion.div>
          <span className="text-3xl font-kids font-black uppercase tracking-tight text-white block-logo hidden sm:block">
            ZÔO DE BLOCOS
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user.role === 'PLAYER' && (
            <div className="flex items-center gap-2 bg-black/5 p-1.5 rounded-[2rem]">
              <NavItem 
                icon={<BookOpen size={22} />} 
                label="Bora!" 
                active={currentView === 'home' || currentView === 'game' || currentView === 'world'} 
                onClick={() => onViewChange('world')}
                color="accent-block-blue"
              />
              <NavItem 
                icon={<ShoppingBag size={22} />} 
                label="Loja" 
                active={currentView === 'store'} 
                onClick={() => onViewChange('store')}
                color="accent-block-red"
              />
              <NavItem 
                icon={<Star size={22} />} 
                label="Zoo" 
                active={currentView === 'album'} 
                onClick={() => onViewChange('album')}
                color="accent-block-yellow"
              />
              <NavItem 
                icon={<Music size={22} />} 
                label="Rádio" 
                active={currentView === 'radio'} 
                onClick={() => onViewChange('radio')}
                color="accent-block-purple"
              />
            </div>
          )}

          <div className="h-12 w-px bg-black/10 mx-2" />

          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-kids font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">
                {user.role === 'ADMIN' ? 'MASTER' : 'EXPLORER'}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-kids font-black text-text-primary hidden md:block">{user.username}</span>
                {user.role === 'PLAYER' && (
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 bg-gradient-to-br from-accent-block-yellow to-yellow-600 px-5 py-2 rounded-2xl border-4 border-white shadow-lg cursor-pointer"
                  >
                    <Sparkles size={20} className="text-white animate-pulse" fill="white" />
                    <span className="text-xl font-kids font-black text-white drop-shadow-md">{user.credits}</span>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={onToggleMute}
                className={`w-12 h-12 rounded-2xl transition-all border-4 flex items-center justify-center ${
                  isMuted 
                    ? 'bg-accent-block-red text-white border-red-200' 
                    : 'bg-white hover:bg-black/5 text-text-secondary border-black/5'
                }`}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>

              <button 
                onClick={onLogout}
                className="w-12 h-12 bg-white hover:bg-red-50 rounded-2xl transition-all text-text-secondary hover:text-red-500 border-4 border-black/5 flex items-center justify-center group"
              >
                <LogOut size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active, onClick, color }: { icon: any, label: string, active: boolean, onClick: () => void, color: string }) {
  const colorMap: Record<string, string> = {
    'accent-block-blue': 'bg-accent-block-blue border-blue-800',
    'accent-block-red': 'bg-accent-block-red border-red-800',
    'accent-block-yellow': 'bg-accent-block-yellow border-yellow-700',
    'accent-block-purple': 'bg-purple-500 border-purple-800'
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] transition-all font-kids font-black uppercase text-sm tracking-wide border-b-6 active:border-b-0 active:translate-y-1 ${
        active 
          ? `${colorMap[color]} text-white shadow-xl` 
          : 'bg-white text-text-secondary hover:bg-white/80 border-black/10'
      }`}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </motion.button>
  );
}
