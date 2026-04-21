/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Sparkles, Star, Zap, Lock, Unlock, CreditCard, CheckCircle2 } from 'lucide-react';
import { Sticker, GameTheme, StoreCreditPack, Language } from '../../types';
import { PACK_COST, THEME_COSTS, CREDIT_PACKS } from '../../constants';

interface ZOOStoreProps {
  credits: number;
  unlockedThemes: GameTheme[];
  language: Language;
  onBuyPack: () => Sticker | undefined;
  onUnlockTheme: (theme: GameTheme) => void;
  onBuyCredits: (pack: StoreCreditPack) => void;
}

const STORE_TRANSLATIONS = {
  PT: {
    title: 'Loja do Zôo',
    subtitle: 'Tudo o que precisas para construir o teu mundo!',
    pack: 'Saco de Animais',
    packDesc: 'Um novo amiguinho surpresa!',
    themes: 'Novos Mundos',
    themesDesc: 'Explora novos temas e letras!',
    credits: 'Recarregar Estrelas',
    creditsDesc: 'Continua a aventura!',
    buy: 'Comprar',
    unlock: 'Desbloquear',
    unlocked: 'Desbloqueado',
    stars: 'Estrelas',
    surprise: 'Surpresa!',
    opening: 'A Abrir...',
    confirm: 'Gostei Muito!'
  },
  EN: {
    title: 'ZOO Store',
    subtitle: 'Everything you need to build your world!',
    pack: 'Animal Bag',
    packDesc: 'A new surprise friend!',
    themes: 'New Worlds',
    themesDesc: 'Explore new themes and letters!',
    credits: 'Recharge Stars',
    creditsDesc: 'Keep the adventure going!',
    buy: 'Buy',
    unlock: 'Unlock',
    unlocked: 'Unlocked',
    stars: 'Stars',
    surprise: 'Surprise!',
    opening: 'Opening...',
    confirm: 'I Love It!'
  },
  ES: {
    title: 'Tienda del Zoo',
    subtitle: '¡Todo lo que necesitas para construir tu mundo!',
    pack: 'Bolsa de Animales',
    packDesc: '¡Un nuevo amigo sorpresa!',
    themes: 'Nuevos Mundos',
    themesDesc: '¡Explora nuevos temas y letras!',
    credits: 'Recargar Estrellas',
    creditsDesc: '¡Continúa la aventura!',
    buy: 'Comprar',
    unlock: 'Desbloquear',
    unlocked: 'Desbloqueado',
    stars: 'Estrellas',
    surprise: '¡Sorpresa!',
    opening: 'Abriendo...',
    confirm: '¡Me encanta!'
  },
  FR: {
    title: 'Boutique du Zoo',
    subtitle: 'Tout ce dont vous avez besoin pour construire votre monde !',
    pack: 'Sac d\'Animaux',
    packDesc: 'Un nouvel ami surprise !',
    themes: 'Nouveaux Mondes',
    themesDesc: 'Explorez de nouveaux thèmes et lettres !',
    credits: 'Recharger des Étoiles',
    creditsDesc: 'Continuez l\'aventure !',
    buy: 'Acheter',
    unlock: 'Débloquer',
    unlocked: 'Débloqué',
    stars: 'Étoiles',
    surprise: 'Surprise !',
    opening: 'Ouverture...',
    confirm: 'J\'adore !'
  }
};

export function ZOOStore({ credits, unlockedThemes, language, onBuyPack, onUnlockTheme, onBuyCredits }: ZOOStoreProps) {
  const [activeTab, setActiveTab] = useState<'packs' | 'themes' | 'credits'>('packs');
  const [isOpening, setIsOpening] = useState(false);
  const [openedSticker, setOpenedSticker] = useState<Sticker | null>(null);

  const t = STORE_TRANSLATIONS[language];

  const handleBuyPack = () => {
    if (credits < PACK_COST) return;
    setIsOpening(true);
    setOpenedSticker(null);

    setTimeout(() => {
      const sticker = onBuyPack();
      if (sticker) {
        setOpenedSticker(sticker);
        setIsOpening(false);
      }
    }, 2000);
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12 bg-white/40 p-12 rounded-[4rem] border-4 border-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10">
          <ShoppingBag size={120} />
        </div>
        <h2 className="text-7xl font-black uppercase text-white block-logo mb-4 drop-shadow-xl">{t.title}</h2>
        <p className="text-text-primary font-bold text-2xl uppercase tracking-wider">{t.subtitle}</p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 bg-black/5 p-2 rounded-[2.5rem] w-fit mx-auto border-2 border-white/50">
          <TabButton 
            active={activeTab === 'packs'} 
            onClick={() => setActiveTab('packs')} 
            label={t.pack} 
            icon={<div className="p-2 bg-accent-block-yellow rounded-xl shadow-md"><ShoppingBag size={20} className="text-white" /></div>} 
          />
          <TabButton 
            active={activeTab === 'themes'} 
            onClick={() => setActiveTab('themes')} 
            label={t.themes} 
            icon={<div className="p-2 bg-accent-block-blue rounded-xl shadow-md"><Unlock size={20} className="text-white" /></div>} 
          />
          <TabButton 
            active={activeTab === 'credits'} 
            onClick={() => setActiveTab('credits')} 
            label={t.credits} 
            icon={<div className="p-2 bg-accent-pink rounded-xl shadow-md"><CreditCard size={20} className="text-white" /></div>} 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'packs' && (
          <motion.div
            key="packs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            {/* Pack Purchase Card */}
            <div className="w-full lg:w-1/2 max-w-md">
              <div className="block-card p-12 text-center group bg-white shadow-3xl">
                <div className="relative mb-8 inline-block">
                  <div className="absolute -inset-10 bg-accent-block-yellow/20 blur-3xl rounded-full scale-125 group-hover:scale-150 transition-transform" />
                  <div className="w-36 h-36 bg-accent-block-yellow rounded-[3rem] flex items-center justify-center relative shadow-xl border-4 border-white rotate-6 group-hover:rotate-12 transition-transform">
                    <ShoppingBag className="w-16 h-16 text-white" />
                  </div>
                </div>

                <h3 className="text-4xl font-black uppercase mb-4 text-text-primary">{t.pack}</h3>
                <p className="text-text-secondary text-xl font-bold mb-10 leading-snug">{t.packDesc}</p>

                <div className="flex flex-col items-center gap-8">
                  <div className="flex items-center gap-4 bg-accent-block-yellow/10 border-4 border-accent-block-yellow px-10 py-4 rounded-[2.5rem] shadow-xl">
                    <Sparkles size={28} className="text-accent-block-yellow" fill="currentColor" />
                    <span className="text-4xl font-black text-accent-block-yellow">{PACK_COST} {t.stars}</span>
                  </div>

                  <button
                    disabled={credits < PACK_COST || isOpening}
                    onClick={handleBuyPack}
                    className={`
                      w-full bubble-button text-2xl h-20
                      ${credits >= PACK_COST && !isOpening
                        ? 'bg-accent-block-red border-red-800'
                        : 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed border-b-0 translate-y-2'
                      }
                    `}
                  >
                    {isOpening ? t.opening : t.buy}
                  </button>
                </div>
              </div>
            </div>

            {/* Pack Opening Reveal */}
            <div className="flex-1 w-full flex items-center justify-center min-h-[500px]">
              <AnimatePresence mode="wait">
                {isOpening ? (
                  <motion.div
                    key="opening-anim"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 1], opacity: 1, rotate: [0, -5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    className="relative"
                  >
                    <Zap className="text-accent-block-blue" size={120} fill="currentColor" />
                    <div className="absolute -inset-20 bg-accent-block-blue/20 blur-[80px] rounded-full -z-10" />
                  </motion.div>
                ) : openedSticker ? (
                  <motion.div
                    key="reveal"
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    className="max-w-sm w-full"
                  >
                    <div className="aspect-[4/5] block-card p-6 bg-white shadow-inner-card relative overflow-hidden group">
                      <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-black/5">
                        <img 
                          src={openedSticker.imageUrl} 
                          alt={openedSticker.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase mb-2 inline-block border border-white/30 tracking-widest">{openedSticker.rarity}</span>
                          <h4 className="text-4xl font-black text-white uppercase block-logo leading-none drop-shadow-lg">{openedSticker.name}</h4>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenedSticker(null)}
                      className="mt-8 w-full py-5 bg-accent-block-blue text-white rounded-[2rem] font-black uppercase text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      {t.confirm}
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-center bg-white/10 p-20 rounded-[4rem] border-8 border-white/20 border-dashed">
                     <Star size={120} className="text-white/30 mx-auto mb-6" fill="currentColor" />
                     <p className="text-white/50 font-black text-2xl uppercase tracking-widest">{t.surprise}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'themes' && (
          <motion.div
            key="themes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(Object.keys(THEME_COSTS) as (keyof typeof THEME_COSTS)[]).map((theme) => {
              const cost = THEME_COSTS[theme];
              const isUnlocked = unlockedThemes.includes(theme);
              const canAfford = credits >= cost;
              const isFree = cost === 0;

              return (
                <div 
                  key={theme}
                  className={`block-card p-8 bg-white relative overflow-hidden group ${isUnlocked ? 'border-accent-block-green/50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-text-primary border-2 border-black/5">
                      {theme === 'History' && <Star size={32} />}
                      {theme === 'Home' && <Unlock size={32} />}
                      {theme === 'Space' && <Zap size={32} />}
                      {theme === 'Ocean' && <ShoppingBag size={32} />}
                    </div>
                    {isUnlocked ? (
                      <CheckCircle2 size={32} className="text-accent-block-green" />
                    ) : (
                      <Lock size={32} className="text-text-secondary/30" />
                    )}
                  </div>

                  <h3 className="text-3xl font-black uppercase mb-2">{theme}</h3>
                  <p className="text-text-secondary font-bold text-sm mb-8">Desbloqueia novos níveis e desafios de {theme}!</p>

                  <div className="mt-auto">
                    {!isUnlocked ? (
                      <button
                        disabled={!canAfford && !isFree}
                        onClick={() => onUnlockTheme(theme)}
                        className={`
                          w-full py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-3 transition-all
                          ${(canAfford || isFree)
                            ? 'bg-accent-block-blue text-white shadow-lg shadow-blue-200 hover:scale-105' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        {isFree ? t.buy : (
                          <>
                            <Sparkles size={18} fill="currentColor" />
                            {cost} {t.stars}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-4 bg-accent-block-green/10 text-accent-block-green rounded-2xl font-black uppercase text-center border-2 border-accent-block-green/20">
                        {t.unlocked}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'credits' && (
          <motion.div
            key="credits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {CREDIT_PACKS.map((pack) => (
              <div 
                key={pack.id} 
                className={`block-card p-10 bg-white text-center group hover:scale-105 transition-transform relative ${pack.isPromo ? 'border-4 border-accent-block-yellow' : ''}`}
              >
                {pack.isPromo && (
                  <div className="absolute top-0 right-0 py-2 px-10 bg-accent-block-red text-white font-black text-[10px] uppercase rotate-45 translate-x-10 translate-y-4 shadow-md">
                    OFERTA
                  </div>
                )}

                <div className="mb-8 relative inline-block">
                  <div className={`absolute -inset-6 bg-accent-block-yellow/20 blur-2xl rounded-full ${pack.isPromo ? 'animate-pulse' : ''}`} />
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-accent-block-yellow border-4 border-white shadow-xl ${
                    pack.amount >= 1200 ? 'bg-accent-block-yellow text-white' : 'bg-white'
                  }`}>
                    {pack.amount < 500 ? <Sparkles size={48} fill="currentColor" /> : <Zap size={48} fill="currentColor" />}
                  </div>
                </div>

                <h3 className="text-2xl font-black uppercase mb-1">{pack.label}</h3>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-black text-accent-block-yellow leading-none">+{pack.amount} {t.stars}</div>
                  {pack.bonusAmount && (
                    <div className="mt-2 bg-accent-block-green text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                      +{pack.bonusAmount} Bónus Grátis!
                    </div>
                  )}
                </div>
                
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => onBuyCredits(pack)}
                    className="w-full py-4 bg-accent-block-green text-white rounded-[1.5rem] font-black text-xl shadow-lg border-b-6 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    € {pack.price}
                  </button>
                  {pack.id === 'pack-mega' && (
                    <p className="text-[10px] font-black text-text-secondary uppercase opacity-50 italic">Utilizado por mestres verdadeiros</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black uppercase tracking-wider text-sm transition-all
        ${active 
          ? 'bg-white text-accent-block-blue shadow-lg border-2 border-accent-block-blue/10' 
          : 'text-text-secondary hover:text-text-primary hover:bg-white/50'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
