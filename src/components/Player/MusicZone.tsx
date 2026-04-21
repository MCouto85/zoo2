import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Music, Heart, Disc, Volume2, Star } from 'lucide-react';
import { Language, RadioSong } from '../../types';

interface MusicZoneProps {
  unlockedMusics: string[];
  radioSongs: RadioSong[];
  language: Language;
}

export function MusicZone({ unlockedMusics, radioSongs, language }: MusicZoneProps) {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const t = {
    PT: { title: 'Rádio Zoo', subtitle: 'Ouve as tuas batidas desbloqueadas!', empty: 'Ainda não tens músicas. Completa níveis para ganhar!', play: 'Ouvir Agora', artist: 'Artista' },
    EN: { title: 'Zoo Radio', subtitle: 'Listen to your unlocked beats!', empty: 'No songs yet. Complete levels to win some!', play: 'Play Now', artist: 'Artist' },
    ES: { title: 'Radio Zoo', subtitle: '¡Escucha tus ritmos desbloqueados!', empty: 'Aún no tienes música. ¡Completa niveles para ganar!', play: 'Escuchar Ahora', artist: 'Artista' },
    FR: { title: 'Radio Zoo', subtitle: 'Écoutez vos morceaux débloqués !', empty: 'Pas encore de musique. Complétez des niveaux pour en gagner !', play: 'Écouter Maintenant', artist: 'Artiste' }
  }[language];

  const handlePlay = (url: string) => {
    if (currentSong === url) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(url);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="py-12 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
           <div className="w-16 h-16 bg-accent-block-red rounded-3xl flex items-center justify-center shadow-2xl rotate-6 text-white border-4 border-white">
              <Music size={32} />
           </div>
           <h2 className="text-7xl font-kids font-black uppercase text-white block-logo leading-none drop-shadow-2xl">
            {t.title}
           </h2>
        </div>
        <p className="text-text-primary text-2xl font-kids font-bold opacity-80">{t.subtitle}</p>
      </motion.div>

      {unlockedMusics.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-xl border-4 border-dashed border-white/40 rounded-[3rem] p-20 text-center space-y-6">
           <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white/50">
              <Disc size={64} className="animate-spin-slow" />
           </div>
           <p className="text-3xl font-kids font-black text-white drop-shadow-md">
             {t.empty}
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {unlockedMusics.map((url, idx) => {
            const radioSong = radioSongs.find(s => s.url === url);
            const meta = radioSong || { title: 'Música Especial', artist: 'Desconhecido', color: '#94a3b8' };
            const isCurrent = currentSong === url;

            return (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`
                  relative group bg-white rounded-[2.5rem] border-b-8 border-r-4 border-black/10 overflow-hidden shadow-2xl transition-all
                  ${isCurrent ? 'ring-8 ring-accent-block-yellow scale-105' : 'hover:scale-102'}
                `}
              >
                <div 
                  className="h-40 w-full relative flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform origin-center"
                  style={{ backgroundColor: meta.color }}
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                   <Disc 
                    size={80} 
                    className={`text-white/20 ${isCurrent && isPlaying ? 'animate-spin-slow' : ''}`} 
                   />
                   <Music size={40} className="absolute text-white" />

                   <button 
                    onClick={() => handlePlay(url)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all group"
                   >
                     <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center text-accent-block-red transform scale-0 group-hover:scale-100 transition-transform">
                        {isCurrent && isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                     </div>
                   </button>
                </div>

                <div className="p-8">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-kids font-black text-text-primary leading-tight uppercase line-clamp-1">{meta.title}</h4>
                        <p className="text-sm font-kids font-bold text-text-secondary opacity-60 uppercase tracking-widest">{t.artist}: {meta.artist}</p>
                      </div>
                      <div className="text-accent-block-yellow">
                         <Star size={24} fill="currentColor" />
                      </div>
                   </div>

                   <button 
                      onClick={() => handlePlay(url)}
                      className={`
                        w-full py-4 rounded-2xl font-kids font-black uppercase text-sm tracking-widest transition-all border-b-4 active:border-b-0 active:translate-y-1
                        ${isCurrent && isPlaying 
                          ? 'bg-accent-block-red text-white border-red-800' 
                          : 'bg-black/5 text-text-primary hover:bg-black/10 border-black/10'}
                      `}
                   >
                     {isCurrent && isPlaying ? 'Pausar' : t.play}
                   </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
