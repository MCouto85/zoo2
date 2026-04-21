/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Columns, 
  Hash, 
  MoveRight, 
  ChevronUp, 
  MessageSquare, 
  Layers,
  ChevronLeft,
  Sparkles,
  Activity,
  Lock,
  Play
} from 'lucide-react';
import { GameTheme, Language } from '../../types';
import { GAME_LEVELS } from '../../constants';

interface ModuleSelectorProps {
  theme: GameTheme;
  language: Language;
  onSelectModule: (module: string, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  onBack: () => void;
  progressMetrics?: Record<string, number>;
}

const MODULES_DATA: Record<Language, any[]> = {
  PT: [
    { id: 'Letters', icon: <Type size={32} />, label: 'Letras', desc: 'Aprende os sons e as formas básicas das letras.', color: '#f87171' },
    { id: 'Syllables', icon: <Columns size={32} />, label: 'Sílabas', desc: 'Separa e une as sílabas para formar palavras.', color: '#60a5fa' },
    { id: 'Digraphs', icon: <Hash size={32} />, label: 'Dígrafos', desc: 'Explora os sons especiais como LH, NH e CH.', color: '#4ade80' },
    { id: 'Order', icon: <MoveRight size={32} />, label: 'Ordenar', desc: 'Coloca as palavras e letras na ordem certa.', color: '#fbbf24' },
    { id: 'Tonic', icon: <ChevronUp size={32} />, label: 'Sílaba Forte', desc: 'Descobre qual é a sílaba mais forte da palavra.', color: '#c084fc' },
    { id: 'Phrases', icon: <MessageSquare size={32} />, label: 'Frases', desc: 'Constrói frases e melhora a tua leitura.', color: '#fb923c' },
    { id: 'Match', icon: <Layers size={32} />, label: 'Descobre', desc: 'Faz par entre imagens e as suas descrições.', color: '#2dd4bf' },
    { id: 'Adjectives', icon: <Sparkles size={32} />, label: 'Adjetivos', desc: 'Aprende a descrever o mundo com cores e tamanhos.', color: '#ec4899' },
    { id: 'Praxias', icon: <Activity size={32} />, label: 'Praxias', desc: 'Imita os animais e treina os teus movimentos.', color: '#06b6d4' },
  ],
  EN: [
    { id: 'Letters', icon: <Type size={32} />, label: 'Letters', desc: 'Learn the basic sounds and shapes of letters.', color: '#f87171' },
    { id: 'Syllables', icon: <Columns size={32} />, label: 'Syllables', desc: 'Split and join syllables to form words.', color: '#60a5fa' },
    { id: 'Digraphs', icon: <Hash size={32} />, label: 'Digraphs', desc: 'Explore special sounds and letter blends.', color: '#4ade80' },
    { id: 'Order', icon: <MoveRight size={32} />, label: 'Order', desc: 'Put words and letters in the correct sequence.', color: '#fbbf24' },
    { id: 'Tonic', icon: <ChevronUp size={32} />, label: 'Strong Syllable', desc: 'Find out which syllable is the strongest.', color: '#c084fc' },
    { id: 'Phrases', icon: <MessageSquare size={32} />, label: 'Phrases', desc: 'Build sentences and improve your reading.', color: '#fb923c' },
    { id: 'Match', icon: <Layers size={32} />, label: 'Match', desc: 'Pair images with their correct descriptions.', color: '#2dd4bf' },
    { id: 'Adjectives', icon: <Sparkles size={32} />, label: 'Adjectives', desc: 'Learn to describe the world with colors and sizes.', color: '#ec4899' },
    { id: 'Praxias', icon: <Activity size={32} />, label: 'Praxias', desc: 'Imitate animals and train your movements.', color: '#06b6d4' },
  ],
  ES: [
    { id: 'Letters', icon: <Type size={32} />, label: 'Letras', desc: 'Aprende los sonidos y formas básicas.', color: '#f87171' },
    { id: 'Syllables', icon: <Columns size={32} />, label: 'Sílabas', desc: 'Separa bloques para formar palabras.', color: '#60a5fa' },
    { id: 'Digraphs', icon: <Hash size={32} />, label: 'Dígrafos', desc: 'Sonidos especiales como LL, RR, CH.', color: '#4ade80' },
    { id: 'Order', icon: <MoveRight size={32} />, label: 'Ordena', desc: 'Lógica rítmica de las letras.', color: '#fbbf24' },
    { id: 'Tonic', icon: <ChevronUp size={32} />, label: 'Sílaba Tónica', desc: 'Acentuación y ritmo de las palabras.', color: '#c084fc' },
    { id: 'Phrases', icon: <MessageSquare size={32} />, label: 'Frases', desc: 'Aprende a leer frases completas.', color: '#fb923c' },
    { id: 'Match', icon: <Layers size={32} />, label: 'Descubre', desc: 'Imagen y texto en armonía.', color: '#2dd4bf' },
    { id: 'Adjectives', icon: <Sparkles size={32} />, label: 'Adjetivos', desc: 'Aprende a describir el mundo con colores y tamaños.', color: '#ec4899' },
    { id: 'Praxias', icon: <Activity size={32} />, label: 'Praxias', desc: 'Imita a los animales y entrena tus movimientos.', color: '#06b6d4' },
  ],
  FR: [
    { id: 'Letters', icon: <Type size={32} />, label: 'Lettres', desc: 'Apprenez les sons et les formes.', color: '#f87171' },
    { id: 'Syllables', icon: <Columns size={32} />, label: 'Syllabes', desc: 'Casser des blocs pour lire.', color: '#60a5fa' },
    { id: 'Digraphs', icon: <Hash size={32} />, label: 'Digraphes', desc: 'Sons spéciaux et mélanges.', color: '#4ade80' },
    { id: 'Order', icon: <MoveRight size={32} />, label: 'Ordre', desc: 'La logique derrière les lettres.', color: '#fbbf24' },
    { id: 'Tonic', icon: <ChevronUp size={32} />, label: 'Syllabe Forte', desc: 'Trouvez l\'accentuation correcte.', color: '#c084fc' },
    { id: 'Phrases', icon: <MessageSquare size={32} />, label: 'Phrases', desc: 'Temps de lecture rigolo.', color: '#fb923c' },
    { id: 'Match', icon: <Layers size={32} />, label: 'Match', desc: 'Image et texte correspondants.', color: '#2dd4bf' },
    { id: 'Adjectives', icon: <Sparkles size={32} />, label: 'Adjectifs', desc: 'Apprenez à décrire le monde avec des couleurs.', color: '#ec4899' },
    { id: 'Praxias', icon: <Activity size={32} />, label: 'Praxies', desc: 'Imitez les animaux et entraînez vos mouvements.', color: '#06b6d4' },
  ]
};

const TRANSLATIONS = {
  PT: { title: 'Escolhe o teu Jogo', subtitle: 'Pronto para aprender a brincar?', back: 'Outros Mundos', comingSoon: 'Bloqueado', progress: 'Domínio' },
  EN: { title: 'Choose your Game', subtitle: 'Ready to play and learn?', back: 'Other Worlds', comingSoon: 'Locked', progress: 'Mastery' },
  ES: { title: 'Elige tu Juego', subtitle: '¿Listo para jugar y aprender?', back: 'Otros Mundos', comingSoon: 'Bloqueado', progress: 'Dominio' },
  FR: { title: 'Choisis ton Jeu', subtitle: 'Prêt à jouer et à apprendre ?', back: 'Autres Mondes', comingSoon: 'Bloqué', progress: 'Maîtrise' }
};

interface ModuleCardProps {
  key?: React.Key;
  mod: any;
  idx: number;
  isAvailable: boolean;
  language: Language;
  t: any;
  onSelect: (id: string) => void;
  progressPercent: number;
}

function ModuleCard({ mod, idx, isAvailable, language, t, onSelect, progressPercent }: ModuleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05, type: "spring" }}
      whileHover={isAvailable ? { scale: 1.02, x: 5 } : {}}
      onClick={() => isAvailable && onSelect(mod.id)}
      className={`
        relative w-full bg-white/90 backdrop-blur-xl rounded-[2rem] border-b-6 border-r-3 border-black/10 overflow-hidden mb-4 flex flex-col md:flex-row items-center cursor-pointer shadow-lg transition-all
        ${!isAvailable ? 'grayscale opacity-60' : 'hover:border-b-10 hover:border-accent-block-blue/40'}
      `}
    >
      {/* Left Icon Block */}
      <div 
        className="w-full md:w-32 h-32 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: mod.color }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <motion.div 
          className="relative z-10 text-white float-animation"
          style={{ animationDelay: `${idx * 0.2}s` }}
        >
          {React.cloneElement(mod.icon, { size: 40, strokeWidth: 3 })}
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 md:px-8 flex flex-col md:flex-row items-center gap-6 w-full">
        <div className="flex-1 text-center md:text-left space-y-1">
          <h3 className="text-2xl font-kids font-black uppercase text-text-primary leading-none tracking-tight">
            {mod.label}
          </h3>
          <p className="text-sm font-kids font-bold text-text-secondary opacity-60">
            {mod.desc}
          </p>
        </div>

        {/* Local Progress Indicator */}
        <div className="w-full md:w-48 flex flex-col gap-2">
          <div className="flex items-center justify-between font-kids font-black uppercase text-[10px] tracking-widest text-text-secondary opacity-50">
            <span>{t.progress}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-3 w-full bg-black/5 rounded-full p-0.5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progressPercent}%` }}
               className="h-full rounded-full"
               style={{ backgroundColor: mod.color }}
             />
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-4">
           {isAvailable && (
              <div className="bg-accent-block-yellow/20 px-3 py-1 rounded-full border-2 border-accent-block-yellow/40 flex items-center gap-1">
                 <Sparkles size={14} className="text-accent-block-yellow" fill="currentColor" />
                 <span className="text-xs font-black text-accent-block-yellow">+20</span>
              </div>
           )}

           {!isAvailable ? (
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-text-secondary opacity-20">
                 <Lock size={24} />
              </div>
           ) : (
             <motion.div 
               className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-black/5 flex items-center justify-center text-accent-block-blue"
               whileHover={{ scale: 1.1, rotate: 10 }}
             >
               <Play size={24} fill="currentColor" />
             </motion.div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

export function ModuleSelector({ theme, language, onSelectModule, onBack, progressMetrics = {} }: ModuleSelectorProps) {
  const [selectedModId, setSelectedModId] = useState<string | null>(null);

  const availableModuleTypes = GAME_LEVELS
    .filter(level => level.theme === theme && level.lang === language)
    .map(level => level.type)
    .filter((value, index, self) => self.indexOf(value) === index);

  const themeNames: Record<GameTheme, Record<Language, string>> = {
    Zoo: { PT: 'Zoo de Blocos', EN: 'Block Zoo', ES: 'Zoo de Bloques', FR: 'Zoo de Blocs' },
    History: { PT: 'Atenas Antiga', EN: 'Ancient Athens', ES: 'Atenas Antigua', FR: 'Athènes Antique' },
    Home: { PT: 'Brincar em Casa', EN: 'Home Play', ES: 'Jugar en Casa', FR: 'Jouer à la Maison' },
    Space: { PT: 'Aventura Espacial', EN: 'Space Adventure', ES: 'Aventura Espacial', FR: 'Aventure Spatiale' },
    Ocean: { PT: 'Mundo Submarino', EN: 'Undersea World', ES: 'Mundo Submarino', FR: 'Monde Sous-Marin' },
    Arctic: { PT: 'Mundo do Gelo', EN: 'Arctic World', ES: 'Mundo de Hielo', FR: 'Monde des Glaces' },
    Desert: { PT: 'Deserto Quente', EN: 'Hot Desert', ES: 'Desierto Caliente', FR: 'Désert Chaud' },
    Farm: { PT: 'Quinta dos Amigos', EN: 'Friends Farm', ES: 'Granja de Amigos', FR: 'Ferme des Amis' }
  };

  const currentModules = MODULES_DATA[language];
  const t = TRANSLATIONS[language];

  // Global progress for this theme
  const themeProgress = progressMetrics[theme] || 0;

  const difficulties: { id: 'Easy' | 'Medium' | 'Hard', label: Record<Language, string>, color: string, speed: number }[] = [
    { id: 'Easy', label: { PT: 'Fácil', EN: 'Easy', ES: 'Fácil', FR: 'Facile' }, color: '#4ade80', speed: 1 },
    { id: 'Medium', label: { PT: 'Médio', EN: 'Medium', ES: 'Medio', FR: 'Moyen' }, color: '#fbbf24', speed: 1.5 },
    { id: 'Hard', label: { PT: 'Difícil', EN: 'Hard', ES: 'Difícil', FR: 'Difficile' }, color: '#f87171', speed: 2 },
  ];

  return (
    <div className="py-8 max-w-5xl mx-auto relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center md:text-left"
        >
          <h2 className="text-6xl font-kids font-black uppercase text-white block-logo leading-none drop-shadow-xl">{themeNames[theme][language]}</h2>
          <p className="text-text-primary text-xl font-kids font-bold opacity-80 mt-2">{t.subtitle}</p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md px-8 py-4 rounded-[1.5rem] font-kids font-black uppercase text-sm border-2 border-white/20 shadow-xl hover:bg-white/30 transition-all text-white self-center md:self-auto"
        >
          <ChevronLeft size={20} />
          {t.back}
        </motion.button>
      </div>

      <div className="flex flex-col gap-2">
        {currentModules.map((mod, idx) => {
          const isAvailable = availableModuleTypes.includes(mod.id as any);
          
          // Calculate actual progress for this specific module
          const moduleKey = `${theme}_${mod.id}`;
          const currentLevel = progressMetrics[moduleKey] || 0;
          const masteryGoal = 10;
          const moduleProgress = isAvailable 
            ? Math.min(100, Math.floor((currentLevel / masteryGoal) * 100)) 
            : 0;

          return (
            <ModuleCard 
              key={mod.id}
              mod={mod}
              idx={idx}
              isAvailable={isAvailable}
              language={language}
              t={t}
              onSelect={(id) => setSelectedModId(id)}
              progressPercent={moduleProgress}
            />
          );
        })}
      </div>

      {/* Difficulty Modal */}
      <AnimatePresence>
        {selectedModId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 shadow-2xl border-8 border-black/5"
            >
              <h3 className="text-4xl font-kids font-black uppercase text-text-primary text-center mb-8">
                {language === 'PT' ? 'Escolhe a Dificuldade' : 'Choose Difficulty'}
              </h3>
              
              <div className="grid gap-4">
                {difficulties.map((diff) => (
                  <motion.button
                    key={diff.id}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectModule(selectedModId, diff.id)}
                    className="flex items-center gap-6 p-6 rounded-[2rem] border-4 border-black/5 hover:border-black/10 transition-all text-left group"
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: diff.color }}
                    >
                       <Play size={32} fill="currentColor" />
                    </div>
                    <div className="flex-1">
                       <span className="text-2xl font-kids font-black uppercase block leading-none mb-1" style={{ color: diff.color }}>{diff.label[language]}</span>
                       <div className="h-2 w-full bg-black/5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: '30%', backgroundColor: diff.color }} />
                       </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button 
                onClick={() => setSelectedModId(null)}
                className="mt-8 w-full py-4 text-text-secondary font-black uppercase text-sm hover:text-text-primary transition-colors"
              >
                {language === 'PT' ? 'Cancelar' : 'Cancel'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
