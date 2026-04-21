/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle, Star, Timer, Volume2 } from 'lucide-react';
import { GameModuleType, GameLevel, GameTheme, Language } from '../../types';
import { GAME_LEVELS, generateLevel } from '../../constants';
import { speechService } from '../../services/SpeechService';
import { DragMatchGame } from './DragMatchGame';

interface GameViewProps {
  moduleType: GameModuleType;
  theme: GameTheme;
  language: Language;
  userLevel?: number; // Current player level for this theme
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  onWin: () => void;
  onBack: () => void;
  isMuted?: boolean;
}

const GAME_TRANSLATIONS = {
  PT: { back: 'Voltar', levelTitle: 'Construtor', correct: 'Muito bem!! Estrela a caminho!', wrong: 'Oops! Tenta outra vez!', level: 'Nível' },
  EN: { back: 'Back', levelTitle: 'Builder', correct: 'Well done!! Star incoming!', wrong: 'Oops! Try again!', level: 'Level' },
  ES: { back: 'Volver', levelTitle: 'Constructor', correct: '¡Muy bien! ¡Estrella en camino!', wrong: '¡Oops! ¡Inténtalo de nuevo!', level: 'Nivel' },
  FR: { back: 'Retour', levelTitle: 'Constructeur', correct: 'Bien joué !! Étoile en route !', wrong: 'Oups ! Réessaie !', level: 'Niveau' }
};

export function GameView({ moduleType, theme, language, userLevel = 1, difficulty = 'Easy', onWin, onBack, isMuted = false }: GameViewProps) {
  const [level, setLevel] = useState<GameLevel | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [time, setTime] = useState(0);
  const [levelNum, setLevelNum] = useState(userLevel);

  const t = GAME_TRANSLATIONS[language];

  const pickLevel = (currentLevelNum: number) => {
    // Attempt to find pre-defined levels for this difficulty or random
    const relevantLevels = GAME_LEVELS.filter(l => l.type === moduleType && l.theme === theme && l.lang === language);
    
    let selected: GameLevel | undefined;
    
    if (relevantLevels.length > 0) {
      // 1. Try finding by difficulty field (if present)
      selected = relevantLevels.find(l => l.difficulty === currentLevelNum);
      
      // 2. Try finding by array index (Level 1 = Index 0, etc)
      if (!selected && relevantLevels[currentLevelNum - 1]) {
        selected = relevantLevels[currentLevelNum - 1];
      }
    }
    
    // 3. If no specific level found in static data, generate one dynamically
    if (!selected) {
      selected = generateLevel(theme, language, moduleType, currentLevelNum);
    }

    setLevel(selected);
    setSelectedOption(null);
    setStatus('playing');
  };

  // Sync internal level number with parent prop updates
  useEffect(() => {
    setLevelNum(userLevel);
    pickLevel(userLevel);
  }, [userLevel]);

  useEffect(() => {
    pickLevel(levelNum);
    
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [moduleType, theme, language]);

  // Narration effect
  useEffect(() => {
    if (level && status === 'playing' && !isMuted) {
      const timer = setTimeout(() => {
        speechService.speak(level.question, language);
      }, 800);
      return () => {
        clearTimeout(timer);
        speechService.stop();
      };
    }
  }, [level?.id, language, isMuted]);

  const handleOptionSelect = (opt: string) => {
    if (status !== 'playing') return;
    
    // Narrate choice
    if (!isMuted) {
      speechService.speak(opt, language);
    }
    
    setSelectedOption(opt);
    
    if (opt === level?.answer) {
      setStatus('correct');
      if (!isMuted) {
        speechService.speak(t.correct, language);
      }
      setTimeout(() => {
        onWin();
        const next = levelNum + 1;
        setLevelNum(next);
        pickLevel(next);
      }, 1500);
    } else {
      setStatus('wrong');
      if (!isMuted) {
        speechService.speak(t.wrong, language);
      }
      setTimeout(() => {
        setStatus('playing');
        setSelectedOption(null);
      }, 1000);
    }
  };

  if (!level) return null;

  if (moduleType === 'Adjectives' || moduleType === 'Praxias' || moduleType === 'Match' && difficulty !== 'Easy') {
    const items = level.options.map((opt, i) => ({
      id: `item-${i}`,
      label: opt,
      image: level.image, // In real app use different images
      targetId: opt === level.answer ? 'target-correct' : `target-${i}`
    }));

    const targets = [
      { id: 'target-correct', label: level.targetName || level.answer, image: level.image },
      // Add decoy targets based on difficulty
      ...(difficulty !== 'Easy' ? [{ id: 'target-1', label: (language === 'PT' ? 'ERRADO' : 'WRONG') }] : [])
    ];

    return (
       <div className="max-w-6xl mx-auto py-8">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-white bg-black/20 px-6 py-2 rounded-full hover:bg-black/30 transition-all mb-10 group md:inline-flex border-2 border-white/20"
         >
           <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           <span className="font-black uppercase text-sm tracking-wide">{t.back}</span>
         </button>
         
         <DragMatchGame 
           id={level.id}
           question={level.question}
           items={items}
           targets={targets}
           onWin={onWin}
           language={language}
           difficulty={difficulty}
         />
       </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white bg-black/20 px-6 py-2 rounded-full hover:bg-black/30 transition-all mb-10 group md:inline-flex border-2 border-white/20"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-black uppercase text-sm tracking-wide">{t.back}</span>
      </button>

      <AnimatePresence>
        <motion.div
          key={level.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20, position: 'absolute', width: '100%' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: -1 }}
            className="block-card p-4 aspect-square relative group bg-white overflow-visible lg:-rotate-2 hover:rotate-0 transition-transform duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.2),0_15px_0_#f3f4f6]"
          >
            {/* Decorative Studs for a Toy Block look */}
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-accent-block-blue border-4 border-white shadow-lg z-30 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-white/30" />
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-accent-block-red border-4 border-white shadow-lg z-30 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-white/30" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-accent-block-yellow border-4 border-white shadow-lg z-30 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-white/30" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-accent-leaf border-4 border-white shadow-lg z-30 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-white/30" />
            </div>

            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-12 border-white relative shadow-inner ring-4 ring-black/5 bg-slate-50">
              <img 
                src={level.image} 
                alt="Referência" 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              
              {/* Internal Shadow for recessed look */}
              <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] rounded-[1.8rem] pointer-events-none" />
              
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <Timer size={16} className="text-white" />
                <span className="text-sm font-black text-white tabular-nums tracking-wider">{time}s</span>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
               animate={{ opacity: 1, scale: 1, rotate: 1 }}
               className="bg-white p-12 rounded-[3.5rem] border-b-12 border-r-4 border-black/10 shadow-2xl relative lg:rotate-1"
            >
              <div className="absolute -top-4 -left-4 bg-accent-block-yellow text-white p-3 rounded-2xl shadow-lg border-2 border-white z-20">
                 <Star size={32} fill="currentColor" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <span className="text-lg font-black uppercase tracking-widest text-accent-block-yellow opacity-80">{t.levelTitle} {t.level} {levelNum}</span>
                 </div>
                 <button 
                  onClick={() => !isMuted && speechService.speak(level.question, language)}
                  className={`bg-accent-block-yellow/20 p-2 rounded-xl transition-colors text-accent-block-yellow ${isMuted ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-accent-block-yellow/40'}`}
                  title={isMuted ? "Sons desligados" : "Ouvir novamente"}
                 >
                    <Volume2 size={24} />
                 </button>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black leading-tight text-text-primary block-logo drop-shadow-none" style={{ WebkitTextStroke: '0px', color: 'var(--color-text-primary)' }}>
                {level.question}
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-6 relative min-h-[300px]">
              {level.options.map((opt, idx) => {
                 const colors = ['bg-accent-block-red', 'bg-accent-block-blue', 'bg-accent-block-yellow', 'bg-accent-leaf'];
                 const color = colors[idx % colors.length];
                 
                 return (
                  <motion.button
                    key={`${level.id}-${opt}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    disabled={status !== 'playing'}
                    onClick={() => handleOptionSelect(opt)}
                    className={`
                      p-8 rounded-3xl border-b-8 border-r-8 border-black/10 text-white font-black text-4xl transition-all shadow-lg active:border-b-0 active:translate-y-2
                      ${selectedOption === opt 
                        ? (status === 'correct' ? 'bg-accent-leaf border-green-800 scale-105' : 'bg-red-400 border-red-900')
                        : `${color} border-black/20 hover:scale-105`
                      }
                    `}
                  >
                    {opt}
                  </motion.button>
                 );
              })}
            </div>

            <AnimatePresence>
              {status !== 'playing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-12 bg-white/80 p-6 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center gap-4"
                >
                  {status === 'correct' ? (
                    <>
                      <div className="bg-accent-leaf p-2 rounded-full border-2 border-white text-white">
                        <CheckCircle2 size={32} />
                      </div>
                      <span className="text-accent-leaf text-2xl font-black uppercase">{t.correct}</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-accent-block-red p-2 rounded-full border-2 border-white text-white">
                        <XCircle size={32} />
                      </div>
                      <span className="text-accent-block-red text-2xl font-black uppercase">{t.wrong}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
