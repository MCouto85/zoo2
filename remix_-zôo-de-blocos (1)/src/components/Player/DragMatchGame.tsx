import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Star, RefreshCcw } from 'lucide-react';
import { Language } from '../../types';

import { speechService } from '../../services/SpeechService';

interface DragMatchGameProps {
  id: string;
  question: string;
  items: { id: string; label: string; image?: string; targetId: string }[];
  targets: { id: string; label: string; image?: string }[];
  onWin: () => void;
  language: Language;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

function DraggableItem({ id, label, image }: { id: string; label: string; image?: string; key?: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative p-4 bg-white rounded-2xl border-4 border-black/5 shadow-xl cursor-grab active:cursor-grabbing
        transition-all hover:scale-105 active:scale-95 z-50
        ${isDragging ? 'opacity-50 ring-4 ring-accent-block-blue' : ''}
      `}
    >
      {image && <img src={image} alt={label} className="w-16 h-16 object-contain pointer-events-none mb-2" />}
      <span className="font-kids font-black uppercase text-sm block text-center whitespace-nowrap">{label}</span>
      
      {/* Block pattern decoration */}
      <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-accent-block-blue/20" />
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-block-blue/20" />
    </div>
  );
}

function DroppableTarget({ id, label, image, matchedItem, language }: { id: string; label: string; image?: string, matchedItem?: any, language: string; key?: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-w-[200px] min-h-[150px] p-6 rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center gap-4
        ${isOver ? 'bg-accent-block-blue/10 border-accent-block-blue border-solid scale-105' : 'bg-black/5 border-black/10'}
        ${matchedItem ? 'bg-accent-block-green/10 border-accent-block-green border-solid' : ''}
      `}
    >
      {matchedItem ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          {matchedItem.image && <img src={matchedItem.image} className="w-20 h-20 object-contain" />}
          <span className="font-kids font-black uppercase text-accent-block-green">{matchedItem.label}</span>
          <div className="absolute top-2 right-2 text-accent-block-green">
             <Check size={24} strokeWidth={4} />
          </div>
        </motion.div>
      ) : (
        <>
          {image && <img src={image} alt={label} className="w-24 h-24 object-cover rounded-2xl border-4 border-white shadow-md mb-2" />}
          <span className="font-kids font-black uppercase text-xs text-center opacity-40 leading-tight">
            {language === 'PT' ? 'Arraste aqui' : 'Drop here'}<br/>{label}
          </span>
        </>
      )}
    </div>
  );
}

export function DragMatchGame({ id, question, items, targets, onWin, language, difficulty = 'Easy' }: DragMatchGameProps) {
  const [matches, setMatches] = useState<Record<string, string>>({}); // targetId -> itemId
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakeTargetId, setShakeTargetId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { over, active } = event;

    if (over && over.id) {
      const targetId = over.id as string;
      const itemId = active.id as string;

      const item = items.find(i => i.id === itemId);
      if (item && item.targetId === targetId) {
        setMatches(prev => ({ ...prev, [targetId]: itemId }));
      } else {
        // Handle Error
        setShakeTargetId(targetId);
        speechService.speak(language === 'PT' ? 'Oh não, tenta outra vez!' : 'Oh no, try again!', language);
        setTimeout(() => setShakeTargetId(null), 500);
      }
    }
  };

  useEffect(() => {
    setMatches({});
    setIsCompleted(false);
    setShakeTargetId(null);
  }, [id]);

  useEffect(() => {
    const matchedItemIds = Object.values(matches);
    const itemsThatMustBeMatched = items.filter(item => targets.some(t => t.id === item.targetId));
    
    if (itemsThatMustBeMatched.length > 0 && itemsThatMustBeMatched.every(item => matchedItemIds.includes(item.id))) {
      setIsCompleted(true);
      setTimeout(() => onWin(), 1500);
    }
  }, [matches, targets, items, onWin]);

  const activeItem = items.find(i => i.id === activeId);

  return (
    <div className="w-full space-y-12 py-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-kids font-black uppercase text-white drop-shadow-xl block-logo">
          {question}
        </h2>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Draggable Dock */}
          <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[3rem] border-b-12 border-black/10 shadow-2xl space-y-6 min-h-[300px]">
            <h3 className="text-xl font-kids font-black uppercase text-text-secondary opacity-50 flex items-center gap-2">
               <RefreshCcw size={18} /> {language === 'PT' ? 'Opções' : 'Options'}
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {items.filter(item => !Object.values(matches).includes(item.id)).map((item) => (
                <DraggableItem key={item.id} id={item.id} label={item.label} image={item.image} />
              ))}
              {items.filter(item => !Object.values(matches).includes(item.id)).length === 0 && !isCompleted && (
                 <div className="text-accent-block-blue font-black uppercase animate-pulse">
                    {language === 'PT' ? 'Tudo encaixado!' : 'Everything fits!'}
                 </div>
              )}
            </div>
          </div>

          {/* Droppable Targets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/40 p-8 rounded-[3rem] border-4 border-white/50 backdrop-blur-md">
            {targets.map((target) => (
              <motion.div
                key={target.id}
                animate={shakeTargetId === target.id ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <DroppableTarget 
                  id={target.id} 
                  label={target.label} 
                  image={target.image} 
                  matchedItem={items.find(i => i.id === matches[target.id])}
                  language={language}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId && activeItem ? (
            <div className="p-4 bg-white rounded-2xl border-4 border-accent-block-blue shadow-2xl scale-110 rotate-3 cursor-grabbing">
              {activeItem.image && <img src={activeItem.image} className="w-16 h-16 object-contain pointer-events-none mb-2" />}
              <span className="font-kids font-black uppercase text-sm block text-center whitespace-nowrap">{activeItem.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Completion Celebration */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white p-12 rounded-[4rem] shadow-3xl text-center space-y-4 border-12 border-accent-block-green">
               <div className="w-24 h-24 bg-accent-block-green rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <Star size={64} fill="currentColor" />
               </div>
               <h3 className="text-6xl font-kids font-black uppercase text-accent-block-green drop-shadow-sm">
                 {language === 'PT' ? 'ESPETACULAR!' : 'AMAZING!'}
               </h3>
               <p className="text-xl font-kids font-bold text-text-secondary opacity-60">
                 {language === 'PT' ? 'Conseguiste ligar tudo com sucesso.' : 'You matched everything successfully.'}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
