/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Info, Lock, ChevronLeft, ChevronRight, RotateCw, Trophy, Volume2 } from 'lucide-react';
import { STICKER_POOL } from '../../constants';
import { Sticker, Language } from '../../types';
import { speechService } from '../../services/SpeechService';

interface StickerAlbumProps {
  inventory: string[];
  language: Language;
  isMuted?: boolean;
}

const STICKERS_PER_PAGE = 4;

export function StickerAlbum({ inventory, language, isMuted = false }: StickerAlbumProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('zoo-album-seen');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      return new Set<string>();
    }
  });

  const markAsSeen = (id: string) => {
    if (!seenIds.has(id)) {
      setSeenIds(prev => {
        const next = new Set(prev);
        next.add(id);
        localStorage.setItem('zoo-album-seen', JSON.stringify(Array.from(next)));
        return next;
      });
    }
  };

  const ALBUM_TRANSLATIONS = {
    PT: { 
      title: 'Livro do Zoo', 
      status: 'Cromos: {n} / {t}', 
      marketplace: 'Mercado',
      fusion: 'Zona de Fusão',
      prizes: 'Zona de Prémios', 
      collected: 'COLECIONADO',
      wanted: 'DESEJADO',
      obtained: 'OBTIDO',
      power: 'PODER',
      cuteness: 'FOFURA',
      achievements: 'CONQUISTAS',
      leaderboard: 'RANKING',
      packs: 'PACOTES CHRONO',
      empty: 'VAGO',
      back: 'DETALHES',
      close: 'FECHAR',
      tapToFlip: 'VIRAR',
      tapToExpand: 'EXPANDIR'
    },
    EN: { 
      title: 'Zoo Book', 
      status: 'Stickers: {n} / {t}', 
      marketplace: 'Marketplace',
      fusion: 'Fusion Zone',
      prizes: 'Prize Zone', 
      collected: 'COLLECTED',
      wanted: 'WANTED',
      obtained: 'OBTAINED',
      power: 'POWER',
      cuteness: 'CUTENESS',
      achievements: 'ACHIEVEMENTS',
      leaderboard: 'LEADERBOARD',
      packs: 'CHRONO PACKS',
      empty: 'EMPTY',
      back: 'DETAILS',
      close: 'CLOSE',
      tapToFlip: 'EXTRACT',
      tapToExpand: 'EXPAND'
    },
    ES: { 
      title: 'Libro del Zoo', 
      status: 'Cromos: {n} / {t}', 
      marketplace: 'Mercado',
      fusion: 'Zona de Fusión',
      prizes: 'Zona de Premios', 
      collected: 'COLECCIONADO',
      wanted: 'BUSCADO',
      obtained: 'OBTENIDO',
      power: 'PODER',
      cuteness: 'TERNURA',
      achievements: 'LOGROS',
      leaderboard: 'RANKING',
      packs: 'PAQUETES CHRONO',
      empty: 'VACÍO',
      back: 'DETALLES',
      close: 'CERRAR',
      tapToFlip: 'GIRAR',
      tapToExpand: 'EXPANDIR'
    },
    FR: { 
      title: 'Livre du Zoo', 
      status: 'Stickers : {n} / {t}', 
      marketplace: 'Marché',
      fusion: 'Zone de Fusion',
      prizes: 'Zone de Prix', 
      collected: 'COLLECTÉ',
      wanted: 'VOULU',
      obtained: 'OBTENU',
      power: 'PUISSANCE',
      cuteness: 'MIGNONNERIE',
      achievements: 'SUCCÈS',
      leaderboard: 'CLASSEMENT',
      packs: 'PACKS CHRONO',
      empty: 'VIDE',
      back: 'DÉTAILS',
      close: 'FERMER',
      tapToFlip: 'RETOURNER',
      tapToExpand: 'AGRANDIR'
    }
  };

  const t = ALBUM_TRANSLATIONS[language];

  const selectedSticker = selectedStickerId ? STICKER_POOL.find(s => s.id === selectedStickerId) : null;

  const totalPages = Math.ceil(STICKER_POOL.length / STICKERS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const collectedCount = inventory.filter((v, i, a) => a.indexOf(v) === i).length;
  
  const currentStickers = STICKER_POOL.slice(
    currentPage * STICKERS_PER_PAGE,
    (currentPage + 1) * STICKERS_PER_PAGE
  );

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      rotateY: direction > 0 ? 90 : -90,
      scale: 0.9,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      rotateY: direction < 0 ? 90 : -90,
      scale: 0.9,
      opacity: 0,
    }),
  };

  return (
    <div className="py-8 px-4 flex flex-col items-center min-h-screen bg-gradient-to-br from-[#1a2b4b] to-[#0a0c10] text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-block-blue/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-block-yellow/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[2px] border-white/5 rounded-full rotate-45" />
        
        {/* Floating Playful Elements */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute top-20 right-[10%] opacity-20"><Info size={48} className="text-accent-block-blue" /></motion.div>
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-40 left-[15%] opacity-20"><Trophy size={64} className="text-accent-block-yellow" /></motion.div>
      </div>

      <div className="w-full max-w-[1600px] z-10 grid grid-cols-1 xl:grid-cols-[1fr_2fr_1fr] gap-8">
        
        {/* Left Column: Marketplace Content */}
        <div className="flex flex-col gap-6">
          <div className="block-card p-6 border-white/20 bg-white/10 backdrop-blur-2xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent-block-blue flex items-center justify-center shadow-lg">
                  <Search className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-kids font-bold uppercase tracking-wider">{t.marketplace}</h3>
             </div>
             
             <div className="grid grid-cols-3 gap-3">
                {STICKER_POOL.slice(0, 9).map(s => (
                  <div key={`market-${s.id}`} className="aspect-square rounded-xl overflow-hidden relative border border-white/10 p-1 bg-white/5">
                     <img src={s.imageUrl} className={`w-full h-full object-cover rounded-lg ${inventory.includes(s.id) ? '' : 'grayscale opacity-40'}`} referrerPolicy="no-referrer" />
                     <div className={`absolute bottom-0 left-0 right-0 py-1 text-[7px] font-black text-center ${inventory.includes(s.id) ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                        {inventory.includes(s.id) ? t.collected : t.wanted}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="block-card p-6 border-white/20 bg-white/10 backdrop-blur-2xl mt-auto">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[1.5rem] border border-white/20 shadow-lg">
                   <div className="p-2 bg-accent-block-yellow rounded-xl"><Trophy className="text-white" size={24} /></div>
                   <div>
                      <p className="text-[10px] text-white/60 font-kids font-bold uppercase tracking-widest">{t.achievements}</p>
                      <p className="text-lg font-kids font-black">{collectedCount} / {STICKER_POOL.length}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[1.5rem] border border-white/20 shadow-lg">
                   <div className="p-2 bg-accent-block-blue rounded-xl"><RotateCw className="text-white" size={24} /></div>
                   <div>
                      <p className="text-[10px] text-white/60 font-kids font-bold uppercase tracking-widest">{t.leaderboard}</p>
                      <p className="text-lg font-kids font-black">#12 Explorer</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Center Column: The Album */}
        <div className="flex flex-col items-center">
            <h2 className="text-7xl font-kids font-black uppercase text-white block-logo mb-12 tracking-tight drop-shadow-[0_8px_0_rgba(0,0,0,0.2)]">
              {t.title}
            </h2>

            <div className="relative w-full perspective-2000">
              {/* Binder Rings Decor - Playful Style */}
              <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-6 z-50 flex flex-col justify-around items-center pointer-events-none hidden md:flex">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className={`w-10 h-4 rounded-full border-b-4 border-black/20 shadow-lg ${['bg-accent-block-blue', 'bg-accent-block-yellow', 'bg-accent-block-red', 'bg-accent-green', 'bg-accent-pink', 'bg-accent-blue'][i]}`} />
                 ))}
              </div>

              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 100, damping: 20 },
                    rotateY: { type: "spring", stiffness: 100, damping: 20 },
                    scale: { duration: 0.5 },
                    opacity: { duration: 0.3 },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/10 backdrop-blur-3xl rounded-[4rem] shadow-[0_50px_120px_rgba(0,0,0,0.6)] min-h-[700px] border-[12px] border-white/20 relative overflow-hidden"
                >
                  {/* Spine Shadow */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[4px] -translate-x-1/2 bg-white/20 z-40 hidden md:block shadow-[0_0_20px_white/10]" />
                  
                  {/* Left Page */}
                  <div className="flex flex-col p-12 z-10">
                    <div className="grid grid-cols-2 gap-8">
                      {currentStickers.slice(0, 2).map((sticker) => (
                        <StickerCard 
                          key={sticker.id} 
                          sticker={sticker} 
                          isCollected={inventory.includes(sticker.id)}
                          count={inventory.filter(id => id === sticker.id).length}
                          isNew={inventory.includes(sticker.id) && !seenIds.has(sticker.id)}
                          onView={() => markAsSeen(sticker.id)}
                          onSelect={() => inventory.includes(sticker.id) && setSelectedStickerId(sticker.id)}
                          language={language}
                          t={t}
                          isMuted={isMuted}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Page */}
                  <div className="flex flex-col p-10 z-10 md:border-l border-white/5">
                     <div className="grid grid-cols-2 gap-6">
                        {currentStickers.slice(2, 4).map((sticker) => (
                          <StickerCard 
                            key={sticker.id} 
                            sticker={sticker} 
                            isCollected={inventory.includes(sticker.id)}
                            count={inventory.filter(id => id === sticker.id).length}
                            isNew={inventory.includes(sticker.id) && !seenIds.has(sticker.id)}
                            onView={() => markAsSeen(sticker.id)}
                            onSelect={() => inventory.includes(sticker.id) && setSelectedStickerId(sticker.id)}
                            language={language}
                            t={t}
                            isMuted={isMuted}
                          />
                        ))}
                        {currentStickers.length < 4 && Array.from({ length: 4 - currentStickers.length }).map((_, i) => (
                          <div key={`empty-${i}`} className="aspect-[4/5] bg-white/[0.02] rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/5 font-black uppercase text-[10px] tracking-widest text-center p-4">
                            {t.empty}
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-16 z-50">
                <button onClick={prevPage} disabled={currentPage === 0}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentPage === 0 ? 'border-white/5 text-white/5' : 'border-white/20 text-white hover:border-white/50 hover:bg-white/5'
                  }`}>
                  <ChevronLeft size={32} />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-16 z-50">
                <button onClick={nextPage} disabled={currentPage === totalPages - 1}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentPage === totalPages - 1 ? 'border-white/5 text-white/5' : 'border-white/20 text-white hover:border-white/50 hover:bg-white/5'
                  }`}>
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>

            {/* Fusion Zone Section (Bottom Center) - Modern Playful */}
            <div className="mt-12 w-full block-card p-10 border-white/20 bg-white/10 backdrop-blur-2xl shadow-3xl">
               <h3 className="text-3xl font-kids font-black uppercase tracking-widest mb-10 text-center text-accent-block-blue drop-shadow-sm">{t.fusion}</h3>
               <div className="flex items-center justify-center gap-16">
                  <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4 }} className="w-40 aspect-[4/5] rounded-[2rem] border-4 border-white/10 bg-black/20 flex items-center justify-center grayscale opacity-30 shadow-inner">
                     <Info className="text-white/20" size={48} />
                  </motion.div>
                  <div className="text-5xl font-kids font-black text-accent-block-pink animate-bounce">+</div>
                  <motion.div animate={{ rotate: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 4 }} className="w-40 aspect-[4/5] rounded-[2rem] border-4 border-white/10 bg-black/20 flex items-center justify-center grayscale opacity-30 shadow-inner">
                     <Info className="text-white/20" size={48} />
                  </motion.div>
                  <div className="text-5xl font-kids font-black text-accent-block-pink">→</div>
                  <div className="w-40 aspect-[4/5] rounded-[2.5rem] border-8 border-dashed border-accent-block-blue/40 bg-accent-block-blue/10 flex items-center justify-center shadow-[inset_0_0_30px_rgba(96,165,250,0.2)]">
                     <Search className="text-accent-block-blue/40" size={48} />
                  </div>
               </div>
            </div>
        </div>

        {/* Right Column: Prizes & Packs */}
        <div className="flex flex-col gap-12">
          <div className="block-card p-6 border-white/20 bg-white/10 backdrop-blur-2xl">
             <h3 className="text-xl font-kids font-bold uppercase tracking-wider mb-6 text-accent-block-yellow">{t.prizes}</h3>
             <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative border-8 border-accent-block-yellow shadow-[0_20px_50px_rgba(251,191,36,0.4)] bg-gradient-to-b from-accent-block-yellow/20 to-transparent p-6">
                <div className="flex flex-col items-center gap-6 text-center h-full">
                   <div className="w-full aspect-square rounded-[2rem] bg-white/5 flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-xl">
                      <img src="https://picsum.photos/seed/rare/400/400" className="w-full h-full object-cover" />
                   </div>
                   <p className="text-lg font-kids font-black uppercase text-white tracking-widest text-center w-full">Aurora Bear-fly</p>
                   <div className="mt-auto flex gap-3 h-2 w-full px-4">
                      <div className="flex-1 bg-accent-block-yellow rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      <div className="flex-1 bg-white/10 rounded-full" />
                      <div className="flex-1 bg-white/10 rounded-full" />
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-auto flex flex-col items-center group">
             <div className="relative cursor-pointer transition-all active:scale-95">
                <div className="absolute inset-0 bg-accent-block-pink/60 blur-[60px] group-hover:blur-[80px] transition-all animate-pulse" />
                <div className="relative w-56 aspect-[2/3] bg-gradient-to-br from-accent-block-pink to-accent-pink/30 rounded-[2.5rem] border-[6px] border-white/40 p-6 overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl float-animation">
                   <img src="https://picsum.photos/seed/packet/200/300" className="absolute inset-0 opacity-40 mix-blend-overlay hover:scale-110 transition-transform duration-700" />
                   <h4 className="text-2xl font-kids font-black uppercase leading-tight drop-shadow-xl text-white">{t.packs}</h4>
                   <div className="mt-6 px-6 py-2 bg-white text-accent-block-pink rounded-2xl text-sm font-kids font-black shadow-lg">{t.packs}</div>
                </div>
             </div>
             <div className="mt-8 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                <p className="text-xs font-kids font-black text-accent-block-yellow uppercase tracking-[0.2em]">Neon Credits: 1,250</p>
             </div>
          </div>
        </div>

      </div>

      {/* Expanded Sticker View */}
      <AnimatePresence>
        {selectedSticker && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedStickerId(null)}
            />
            
            <motion.div
              layoutId={`sticker-${selectedSticker.id}`}
              className="relative w-full max-w-4xl aspect-[4/3] bg-[#0a0c10] border-[8px] border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedStickerId(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center relative">
                   <div className="absolute w-6 h-1 bg-white rounded-full rotate-45" />
                   <div className="absolute w-6 h-1 bg-white rounded-full -rotate-45" />
                </div>
              </button>

              {/* Left Side: Large Image */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-[#1e2329]">
                 <img 
                   src={selectedSticker.imageUrl} 
                   className="w-full h-full object-cover" 
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent opacity-60" />
                 
                 {/* Rarity Tag */}
                 <div className="absolute bottom-10 left-10">
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-black uppercase tracking-[0.3em]">
                      {selectedSticker.rarity}
                    </span>
                 </div>
              </div>

              {/* Right Side: Details */}
              <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center gap-10">
                 <div className="space-y-4">
                    <h3 className="text-6xl font-kids font-black uppercase tracking-tight">{selectedSticker.name}</h3>
                    <p className="text-xl text-accent-block-blue font-bold italic opacity-60">{selectedSticker.scientificName}</p>
                 </div>

                 <div className="grid grid-cols-1 gap-6 py-10 border-y border-white/10">
                    <BackStat 
                      label={t.power} 
                      value={selectedSticker.pwr} 
                      color={
                        selectedSticker.rarity === 'Legendary' ? '#fbbf24' : 
                        selectedSticker.rarity === 'Rare' ? '#60a5fa' : '#94a3b8'
                      } 
                    />
                    <BackStat label={t.cuteness} value={selectedSticker.cut} color="#f472b6" />
                 </div>

                 <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        const baseDesc = language === 'PT' 
                          ? `Espécime do ecossistema ${selectedSticker.theme}. `
                          : `Specimen from the ${selectedSticker.theme} ecosystem. `;
                        
                        const factDesc = language === 'PT'
                          ? `Apresenta uma estrutura celular de blocos com nível de fofura de ${selectedSticker.cut} e poder de ${selectedSticker.pwr}.`
                          : `Features a block-based cellular structure with a cuteness level of ${selectedSticker.cut} and power of ${selectedSticker.pwr}.`;
                        
                        const text = `${selectedSticker.name}. ${selectedSticker.scientificName}. ${baseDesc} ${factDesc}`;
                        speechService.speak(text, language);
                      }}
                      className="flex-1 flex items-center justify-center gap-4 py-6 bg-accent-block-blue text-white rounded-[2rem] font-kids font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-center"
                    >
                       <Volume2 size={32} />
                       {t.back}
                    </button>
                    
                    <div className="px-8 py-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center">
                       <span className="text-[10px] font-black uppercase opacity-40">{t.obtained}</span>
                       <span className="text-2xl font-black">x{inventory.filter(id => id === selectedSticker.id).length}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StickerCardProps {
  key?: string | number;
  sticker: Sticker;
  isCollected: boolean;
  count: number;
  isNew: boolean;
  onView: () => void;
  onSelect: () => void;
  language: Language;
  t: any;
  isMuted?: boolean;
}

function StickerCard({ sticker, isCollected, count, isNew, onView, onSelect, language, t, isMuted = false }: StickerCardProps) {
  // Rarity Colors
  const rarityConfig: Record<string, any> = {
    Legendary: { color: '#fbbf24', border: 'border-accent-block-yellow', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]', bg: 'bg-accent-block-yellow/10' },
    Rare: { color: '#60a5fa', border: 'border-accent-block-blue', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.4)]', bg: 'bg-accent-block-blue/10' },
    Common: { color: '#94a3b8', border: 'border-gray-400', glow: 'shadow-none', bg: 'bg-gray-400/10' }
  };

  const config = rarityConfig[sticker.rarity] || rarityConfig.Common;

  return (
    <div 
      className="perspective-1000 aspect-[3/4] group relative"
      onMouseEnter={() => isNew && onView()}
    >
      <motion.div
        layoutId={`sticker-${sticker.id}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl border-2 cursor-pointer ${isCollected ? config.border + ' ' + config.glow : 'border-white/5 grayscale opacity-30'} transition-all duration-300 bg-[#1e2329]`}
        onClick={onSelect}
      >
        {/* Holographic Overlays */}
        {isCollected && (
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-gradient-to-tr from-white/10 via-transparent to-white/10 group-hover:opacity-40 transition-opacity" />
        )}

        {/* New Indicator */}
        {isNew && (
          <div className="absolute top-2 left-2 z-40">
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 bg-accent-block-blue rounded-full border-2 border-white shadow-[0_0_10px_rgba(96,165,250,1)]"
            />
          </div>
        )}

        {/* Expansion Hint */}
        <div className="absolute top-2 right-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="p-1 px-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[6px] font-black text-white/50 uppercase tracking-widest">
              {t.tapToExpand || 'Expand'}
           </div>
        </div>

        <div className="w-full h-[65%] relative overflow-hidden">
           <img 
             src={sticker.imageUrl} 
             alt={sticker.name} 
             className="w-full h-full object-cover" 
             referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#1e2329] to-transparent" />
           
           {!isCollected && (
             <div className="absolute inset-0 flex items-center justify-center z-20">
               <Lock size={24} className="text-white/20" />
             </div>
           )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 h-[35%] flex flex-col justify-between bg-[#1e2329]">
           <div>
              <div className="flex items-center justify-between mb-1 gap-1">
                 <h3 className={`text-[10px] font-black uppercase tracking-tight truncate ${isCollected ? 'text-white' : 'text-white/20'}`}>
                    {isCollected ? sticker.name : 'HIDDEN'}
                 </h3>
                 {isCollected && count > 1 && (
                   <span className="text-[8px] font-black bg-white/10 px-1.5 py-0.5 rounded-full text-white/60">x{count}</span>
                 )}
              </div>
              <div className="flex gap-1">
                 <span className="text-[6px] font-black text-white/40 uppercase tracking-widest">{sticker.rarity}</span>
              </div>
           </div>

           <div className="space-y-1.5 mt-2">
              <MiniBar label="PWR" value={sticker.pwr} color={config.color} isCollected={isCollected} />
              <MiniBar label="CUT" value={sticker.cut} color="#f472b6" isCollected={isCollected} />
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function MiniBar({ label, value, color, isCollected }: { label: string, value: number, color: string, isCollected: boolean }) {
  return (
    <div className="w-full flex items-center gap-2">
       <span className="text-[6px] font-black text-white/40 w-4">{label}</span>
       <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: isCollected ? `${value}%` : '0%', backgroundColor: color }} />
       </div>
       <span className={`text-[6px] font-black min-w-[12px] text-right ${isCollected ? 'text-white' : 'text-white/10'}`}>
          {isCollected ? value : '??'}
       </span>
    </div>
  );
}

function BackStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
         <span className="text-[9px] font-black uppercase text-text-secondary">{label}</span>
         <span className="text-sm font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
         <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

