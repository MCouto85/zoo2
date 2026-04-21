import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Cat, 
  History as HistoryIcon, 
  Home as HomeIcon, 
  Rocket, 
  Waves,
  Play,
  Lock,
  Snowflake,
  Sun,
  PawPrint
} from 'lucide-react';
import { GameTheme, Language } from '../../types';

interface World {
  id: GameTheme;
  label: Record<Language, string>;
  desc: Record<Language, string>;
  icon: any;
  color: string;
  bgUrl: string;
}

const WORLDS: World[] = [
  { 
    id: 'Zoo', 
    label: { PT: 'Zoo de Blocos', EN: 'Block Zoo', ES: 'Zoo de Bloques', FR: 'Zoo de Blocs' },
    desc: { PT: 'Lê e coleciona animais!', EN: 'Read and collect animals!', ES: '¡Lee y colecciona animales!', FR: 'Lisez et collectionnez des animaux !' },
    icon: <Cat className="text-white" size={32} />, 
    color: '#4ade80',
    bgUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'Space', 
    label: { PT: 'Aventura Espacial', EN: 'Space Adventure', ES: 'Aventura Espacial', FR: 'Aventure Spatiale' },
    desc: { PT: 'Explora os planetas!', EN: 'Explore the planets!', ES: '¡Explora los planetas!', FR: 'Explorez les planètes !' },
    icon: <Rocket className="text-white" size={32} />, 
    color: '#f87171',
    bgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'Ocean', 
    label: { PT: 'Mundo Submarino', EN: 'Underwater World', ES: 'Mundo Submarino', FR: 'Monde Sous-marin' },
    desc: { PT: 'Mergulha no oceano!', EN: 'Dive into the ocean!', ES: '¡Sumérgete en el océano!', FR: 'Plongez dans l\'océan !' },
    icon: <Waves className="text-white" size={32} />, 
    color: '#60a5fa',
    bgUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'History', 
    label: { PT: 'Atenas Antiga', EN: 'Ancient Athens', ES: 'Antigua Atenas', FR: 'Athènes Antique' },
    desc: { PT: 'Descobre a Grécia!', EN: 'Discover Greece!', ES: '¡Descubre Grecia!', FR: 'Découvrez la Grèce !' },
    icon: <HistoryIcon className="text-white" size={32} />, 
    color: '#fbbf24',
    bgUrl: 'https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'Home', 
    label: { PT: 'Brincar em Casa', EN: 'Play at Home', ES: 'Jugar en Casa', FR: 'Jouer à la Maison' },
    desc: { PT: 'Descobre a tua casa!', EN: 'Discover your home!', ES: '¡Descubre tu hogar!', FR: 'Découvrez votre maison !' },
    icon: <HomeIcon className="text-white" size={32} />, 
    color: '#38bdf8',
    bgUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'Arctic', 
    label: { PT: 'Mundo do Gelo', EN: 'Arctic World', ES: 'Mundo de Hielo', FR: 'Monde des Glaces' },
    desc: { PT: 'Explora o frio polar!', EN: 'Explore the polar cold!', ES: '¡Explora el frío polar!', FR: 'Explorez le froid polaire !' },
    icon: <Snowflake className="text-white" size={32} />, 
    color: '#93c5fd',
    bgUrl: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'Desert', 
    label: { PT: 'Deserto Quente', EN: 'Hot Desert', ES: 'Desierto Caliente', FR: 'Désert Chaud' },
    desc: { PT: 'Aventura nas dunas!', EN: 'Adventure in the dunes!', ES: '¡Aventura en las dunas!', FR: 'Aventure dans les dunes !' },
    icon: <Sun className="text-white" size={32} />, 
    color: '#fb923c',
    bgUrl: 'https://images.unsplash.com/photo-1445722421330-843818e69002?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'Farm', 
    label: { PT: 'Quinta dos Amigos', EN: 'Friends Farm', ES: 'Granja de Amigos', FR: 'Ferme des Amis' },
    desc: { PT: 'Cuida dos animais!', EN: 'Take care of animals!', ES: '¡Cuida de los animales!', FR: 'Prenez soin des animaux !' },
    icon: <PawPrint className="text-white" size={32} />, 
    color: '#4ade80',
    bgUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200'
  },
];

interface WorldCardProps {
  key?: React.Key;
  world: World;
  idx: number;
  isUnlocked: boolean;
  language: Language;
  t: any;
  onSelectWorld: (worldId: GameTheme) => void;
  hoveredWorldId: GameTheme | null;
  setHoveredWorldId: (id: GameTheme | null) => void;
}

function WorldCard({ world, idx, isUnlocked, language, t, onSelectWorld, hoveredWorldId, setHoveredWorldId, progress = 0 }: WorldCardProps & { progress?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const progressPercent = Math.min((progress / 100) * 100, 100);

  return (
    <div key={world.id} className="relative w-full" ref={cardRef}>
      <AnimatePresence>
        {!isUnlocked && hoveredWorldId === world.id && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-2 bg-text-primary text-white rounded-2xl shadow-xl whitespace-nowrap font-black text-xs uppercase tracking-wider border-2 border-white/20"
          >
            {t.tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-text-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.1, type: "spring" }}
        whileHover={isUnlocked ? { scale: 1.02, x: 10 } : {}}
        onClick={() => isUnlocked && onSelectWorld(world.id)}
        className={`
          relative w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] border-b-8 border-r-4 border-black/10 overflow-hidden mb-6 flex flex-col md:flex-row items-center cursor-pointer shadow-xl transition-all
          ${!isUnlocked ? 'grayscale opacity-60' : 'hover:border-b-12 hover:border-accent-block-blue/40'}
        `}
      >
        {/* Left Aspect: Icon & Color Block */}
        <div 
          className="w-full md:w-48 h-48 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: world.color }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <motion.div 
            className="relative z-10 text-white float-animation"
            style={{ animationDelay: `${idx * 0.3}s` }}
          >
            {React.cloneElement(world.icon, { size: 64, strokeWidth: 3 })}
          </motion.div>
          {/* Subtle bg texture/parallax */}
          <motion.img 
            src={world.bgUrl} 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            style={{ scale: 1.5 }}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 w-full">
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-4xl font-kids font-black uppercase text-text-primary leading-none tracking-tight">
              {world.label[language]}
            </h3>
            <p className="text-lg font-kids font-bold text-text-secondary opacity-70">
              {world.desc[language]}
            </p>
          </div>

          {/* Progress Section */}
          <div className="w-full md:w-64 flex flex-col gap-4">
            <div className="flex items-center justify-between font-kids font-black uppercase text-sm tracking-widest text-text-secondary">
              <span>{t.progress || 'Progresso'}</span>
              <span className="text-accent-block-blue">{progress}/90</span>
            </div>
            <div className="h-6 w-full bg-black/5 rounded-full p-1 border-2 border-black/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(progress / 90) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-accent-block-blue shadow-[0_0_15px_rgba(96,165,250,0.4)]"
                style={{ backgroundColor: world.color }}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {!isUnlocked ? (
               <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-text-secondary opacity-30">
                  <Lock size={32} />
               </div>
            ) : (
              <motion.div 
                className="w-16 h-16 rounded-full bg-white shadow-lg border-4 border-black/5 flex items-center justify-center text-accent-block-blue group-hover:bg-accent-block-blue group-hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <Play size={32} fill="currentColor" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface WorldSelectorProps {
  onSelectWorld: (worldId: GameTheme) => void;
  unlockedThemes: GameTheme[];
  language: Language;
  themeBgs: Record<GameTheme, string>;
  progressMetrics?: Record<string, number>;
}

export function WorldSelector({ onSelectWorld, unlockedThemes, language, themeBgs, progressMetrics = {} }: WorldSelectorProps) {
  const [hoveredWorldId, setHoveredWorldId] = useState<GameTheme | null>(null);

  const WORLD_T = {
    PT: { title: 'Mundos de Blocos', subtitle: 'Escolhe o teu próximo destino!', explore: 'Explorar', locked: 'Bloqueado', unlockStore: 'Loja', tooltip: 'Visita a Loja para desbloquear!', progress: 'Progresso' },
    EN: { title: 'Block Worlds', subtitle: 'Choose your next destination!', explore: 'Explore', locked: 'Locked', unlockStore: 'Store', tooltip: 'Visit the Store to unlock!', progress: 'Progress' },
    ES: { title: 'Mundos de Bloques', subtitle: '¡Elige tu próximo destino!', explore: 'Explorar', locked: 'Bloqueado', unlockStore: 'Tienda', tooltip: '¡Visita la Tienda para desbloquear!', progress: 'Progreso' },
    FR: { title: 'Mondes de Blocs', subtitle: 'Choisissez votre destination !', explore: 'Explorer', locked: 'Bloqué', unlockStore: 'Boutique', tooltip: 'Visitez la Boutique pour débloquer !', progress: 'Progrès' }
  };

  const t = WORLD_T[language];

  return (
    <div className="py-8 w-full max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14 text-center"
      >
        <h2 className="text-7xl font-kids font-black uppercase text-white block-logo leading-none drop-shadow-2xl mb-4">{t.title}</h2>
        <p className="text-text-primary text-2xl font-kids font-bold opacity-80">{t.subtitle}</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {WORLDS.map((world, idx) => {
          // Calculate aggregate progress for this world based on module masteries
          const moduleKeys = Object.keys(progressMetrics).filter(k => k.startsWith(`${world.id}_`));
          const totalModuleWins = moduleKeys.reduce((sum, k) => sum + Math.min(10, progressMetrics[k]), 0);
          const worldMasteryGoal = 90; // 9 modules * 10 levels each
          const realProgress = Math.min(worldMasteryGoal, totalModuleWins);

          return (
            <WorldCard 
              key={world.id}
              world={world}
              idx={idx}
              isUnlocked={unlockedThemes.includes(world.id)}
              language={language}
              t={t}
              onSelectWorld={onSelectWorld}
              hoveredWorldId={hoveredWorldId}
              setHoveredWorldId={setHoveredWorldId}
              progress={realProgress}
            />
          );
        })}
      </div>
    </div>
  );
}
