/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ShoppingBag, 
  BookOpen, 
  LayoutDashboard, 
  User as UserIcon, 
  LogOut,
  Play,
  UserPlus,
  Mail,
  Lock,
  ArrowLeft,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { UserStats, UserRole, Sticker, Achievement, GameTheme, Language, StoreCreditPack, AppConfig, MediaAsset, RadioSong } from './types';
import { STICKER_POOL, WIN_REWARD, PACK_COST, THEME_BACKGROUNDS, THEME_COSTS, CREDIT_PACKS, generateLevel, REWARD_SONGS } from './constants';

import { Navbar } from './components/Shared/Navbar';
import { WorldSelector } from './components/Player/WorldSelector';
import { ModuleSelector } from './components/Player/ModuleSelector';
import { GameView } from './components/Player/GameView';
import { StickerAlbum } from './components/Player/StickerAlbum';
import { ZOOStore } from './components/Player/ZOOStore';
import { MusicZone } from './components/Player/MusicZone';
import { AdminDashboard } from './components/Admin/AdminDashboard';

export default function App() {
  const [view, setView] = useState<'login' | 'world' | 'home' | 'game' | 'album' | 'store' | 'radio' | 'admin'>('login');
  const [user, setUser] = useState<UserStats | null>(null);
  const [currentTheme, setCurrentTheme] = useState<GameTheme>('Zoo');
  const [language, setLanguage] = useState<Language>('PT');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Global Config States (Admin managed) - Persistent
  const [themeBgs, setThemeBgs] = useState<Record<GameTheme, string>>(() => {
    const saved = localStorage.getItem('zoo-theme-bgs');
    return saved ? JSON.parse(saved) : THEME_BACKGROUNDS;
  });
  
  const [themeMusics, setThemeMusics] = useState<Record<GameTheme, string[]>>(() => {
    const saved = localStorage.getItem('zoo-theme-musics');
    if (saved) return JSON.parse(saved);
    return {
      Zoo: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'],
      History: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'],
      Home: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
      Space: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'],
      Ocean: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'],
      Arctic: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3'],
      Desert: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'],
      Farm: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3']
    };
  });

  const [themeVideos, setThemeVideos] = useState<Record<GameTheme, string[]>>(() => {
    const saved = localStorage.getItem('zoo-theme-videos');
    if (saved) return JSON.parse(saved);
    return {
      Zoo: ['https://www.w3schools.com/html/mov_bbb.mp4'], 
      History: ['https://www.w3schools.com/html/movie.mp4'], 
      Home: [], 
      Space: ['https://www.w3schools.com/html/mov_bbb.mp4'],
      Ocean: ['https://www.w3schools.com/html/mov_bbb.mp4'],
      Arctic: [],
      Desert: [],
      Farm: []
    };
  });

  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('zoo-media-library');
    const parsed = saved ? JSON.parse(saved) : [];
    if (parsed.length > 0) console.log(`Biblioteca de média carregada: ${parsed.length} ativos.`);
    return parsed;
  });

  const [radioSongs, setRadioSongs] = useState<RadioSong[]>(() => {
    const saved = localStorage.getItem('zoo-radio-songs');
    if (saved) return JSON.parse(saved);
    return [
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Aventura em Casa', artist: 'Zôo-Bot 1', color: '#60a5fa' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', title: 'Selva de Blocos', artist: 'Zôo-Bot 2', color: '#4ade80' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', title: 'Espaço Sideral', artist: 'Zôo-Bot 3', color: '#c084fc' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', title: 'Mundo Submarino', artist: 'Zôo-Bot 4', color: '#06b6d4' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', title: 'Reino Antigo', artist: 'Zôo-Bot 5', color: '#fb923c' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', title: 'Festa Estelar', artist: 'Super Panda', color: '#f87171' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', title: 'Dança do Zoo', artist: 'Mestre Leão', color: '#fbbf24' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', title: 'Ritmo Safari', artist: 'Macaquinho DJ', color: '#ec4899' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', title: 'Batida Lunar', artist: 'Astronauta', color: '#818cf8' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', title: 'Som das Ondas', artist: 'Baleia Jazz', color: '#2dd4bf' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', title: 'Eco Histórico', artist: 'Dinossauro Rei', color: '#94a3b8' },
      { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', title: 'Galáxia Kids', artist: 'Robô Espacial', color: '#c084fc' },
    ];
  });

  const [masterVolume, setMasterVolume] = useState(() => {
    const saved = localStorage.getItem('zoo-master-volume');
    return saved ? parseFloat(saved) : 0.15;
  });
  
  const [isMuted, setIsMuted] = useState(false);
  
  // Track index for playlists per theme
  const [playlistIndex, setPlaylistIndex] = useState<Record<GameTheme, number>>({
    Zoo: 0, History: 0, Home: 0, Space: 0, Ocean: 0, Arctic: 0, Desert: 0, Farm: 0
  });

  // Persist changes
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          if (data.themeBgs) setThemeBgs(data.themeBgs);
          if (data.themeMusics) setThemeMusics(data.themeMusics);
          if (data.themeVideos) setThemeVideos(data.themeVideos);
          if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
          if (data.radioSongs) setRadioSongs(data.radioSongs);
          if (data.masterVolume !== undefined) setMasterVolume(data.masterVolume);
        }
      });
  }, []);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeBgs, themeMusics, themeVideos, mediaLibrary, radioSongs, masterVolume })
      });
      localStorage.setItem('zoo-theme-bgs', JSON.stringify(themeBgs));
      localStorage.setItem('zoo-theme-musics', JSON.stringify(themeMusics));
      localStorage.setItem('zoo-theme-videos', JSON.stringify(themeVideos));
      localStorage.setItem('zoo-media-library', JSON.stringify(mediaLibrary));
      localStorage.setItem('zoo-radio-songs', JSON.stringify(radioSongs));
      localStorage.setItem('zoo-master-volume', masterVolume.toString());
    }
  }, [themeBgs, themeMusics, themeVideos, mediaLibrary, radioSongs, masterVolume, user]);

  useEffect(() => {
    if (user) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    }
  }, [user]);

  // Login/Register form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginConfirmPassword, setLoginConfirmPassword] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const themeMusicsRef = useRef(themeMusics);
  const playlistIndexRef = useRef(playlistIndex);
  const currentThemeRef = useRef(currentTheme);

  useEffect(() => {
    themeMusicsRef.current = themeMusics;
    playlistIndexRef.current = playlistIndex;
    currentThemeRef.current = currentTheme;
  }, [themeMusics, playlistIndex, currentTheme]);

  const resolveAudioUrl = (url: string) => {
    if (!url) return '';
    // Suno transformation: suno.com/s/ID -> cdn1.suno.ai/ID.mp3
    if (url.includes('suno.com/s/')) {
      const parts = url.split('/s/');
      const trackId = parts[parts.length - 1];
      if (trackId && trackId.length > 5) { // Basic sanity check for ID
        return `https://cdn1.suno.ai/${trackId}.mp3`;
      }
    }
    return url;
  };

  useEffect(() => {
    // Dynamic body background update
    if (view !== 'login') {
      document.body.style.backgroundImage = `url(${themeBgs[currentTheme]})`;
    } else {
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=2000')";
    }
  }, [currentTheme, view, themeBgs]);

  useEffect(() => {
    const audio = document.createElement('audio');
    audio.preload = 'auto';
    
    audio.onended = () => {
      const theme = currentThemeRef.current;
      const currentPlaylist = themeMusicsRef.current[theme] || [];
      if (currentPlaylist.length > 1) {
        setPlaylistIndex(prev => ({
          ...prev,
          [theme]: (prev[theme] + 1) % currentPlaylist.length
        }));
      }
    };

    audio.onerror = (e) => {
      console.warn("Audio element error caught:", audio.error?.message || "Unknown error", audio.src);
      // If a specific source fails, we might want to try the next one in playlist if it exists
      // but for now, just logging helps diagnose if it's a specific URL issue
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, []); // Run once on mount

  // Handle Audio Updates and Playback
  useEffect(() => {
    if (audioRef.current) {
      const globalPlaylist = themeMusics[currentTheme] || [];
      const userUnlocked = user?.unlockedMusics || [];
      const currentPlaylist = [...globalPlaylist, ...userUnlocked];
      
      const currentTrackIndex = playlistIndex[currentTheme] || 0;
      const currentTrack = currentPlaylist[currentTrackIndex % currentPlaylist.length] || '';
      const resolvedSrc = resolveAudioUrl(currentTrack);
      
      if (resolvedSrc) {
        try {
          // Normalize URL check (browsers return absolute URLs for .src)
          const tempAudio = new Audio();
          tempAudio.src = resolvedSrc;
          const absoluteResolvedSrc = tempAudio.src;

          if (audioRef.current.src !== absoluteResolvedSrc) {
            audioRef.current.pause();
            audioRef.current.src = resolvedSrc;
            audioRef.current.load();
            audioRef.current.loop = currentPlaylist.length === 1;
          }

          // Try playing if view is active
          if (view !== 'login' && view !== 'admin' && audioRef.current.paused) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(err => {
                if (err.name !== 'NotAllowedError') {
                  console.warn("Audio playback failed for src:", resolvedSrc, err);
                }
              });
            }
          }
        } catch (err) {
          console.error("Audio assignment error:", err);
        }
      } else {
        audioRef.current.pause();
      }
      
      audioRef.current.volume = (isMuted || view === 'radio') ? 0 : masterVolume;
    }
  }, [themeMusics, currentTheme, playlistIndex, masterVolume, isMuted, view]);

  const handleLogin = (role: UserRole) => {
    if (!loginUsername || !loginPassword) {
      alert("Por favor, preenche todos os campos!");
      return;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    })
    .then(async r => {
      if (!r.ok) throw new Error("Credenciais inválidas");
      const userData = await r.json();
      setUser(userData);
      setView(userData.role === 'ADMIN' ? 'admin' : 'world');
    })
    .catch(err => alert(err.message));
  };

  const handleRegister = () => {
    if (!loginUsername || !loginEmail || !loginPassword || !loginConfirmPassword) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
    if (loginPassword !== loginConfirmPassword) {
      alert("As palavras-passe não coincidem!");
      return;
    }

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, email: loginEmail, password: loginPassword })
    })
    .then(async r => {
      if (!r.ok) throw new Error("Erro ao registar utilizador");
      const userData = await r.json();
      setUser(userData);
      setView('world');
    })
    .catch(err => alert(err.message));
  };

  const handleWin = (creditsEarned: number = WIN_REWARD) => {
    if (!user) return;
    
    let songUnlocked = false;
    let unlockedUrl = '';

    setUser(prev => {
      if (!prev) return null;
      const moduleKey = `${currentTheme}_${activeModule}`;
      const currentModuleLevel = (prev.progressMetrics?.[moduleKey] || 0) + 1;
      const newUnlockedMusics = [...(prev.unlockedMusics || [])];

      // Total levels in theme (old key for backwards compatibility and global theme bar)
      const currentThemeLevels = (prev.progressMetrics?.[currentTheme] || 0) + 1;

      // Reward music every 10 levels globally in theme
      if (currentThemeLevels % 10 === 0) {
        const available = REWARD_SONGS.filter(s => !newUnlockedMusics.includes(s));
        if (available.length > 0) {
          unlockedUrl = available[Math.floor(Math.random() * available.length)];
          newUnlockedMusics.push(unlockedUrl);
          songUnlocked = true;
        }
      }

      return {
        ...prev,
        credits: prev.credits + creditsEarned,
        completedLevels: prev.completedLevels + 1,
        unlockedMusics: newUnlockedMusics,
        progressMetrics: {
          ...prev.progressMetrics,
          [moduleKey]: currentModuleLevel,
          [currentTheme]: currentThemeLevels
        }
      };
    });

    if (songUnlocked) {
      setTimeout(() => {
        alert(`🎈 PARABÉNS! Completaste uma meta no mundo ${currentTheme} e ganhaste uma nova MÚSICA! 🎵`);
      }, 2000);
    }

    const newAchievement: Achievement = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Desafio Ganho!',
      description: `${user.username} ganhou ${creditsEarned} Estrelas em ${currentTheme}!`,
      timestamp: Date(),
      userId: '1',
      username: user.username
    };

    setAchievements(prev => [newAchievement, ...prev].slice(0, 10));
    
    // Premium HD 3D Fireworks Celebration
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, 
        colors: ['#FFE700', '#FFD700', '#FF1493'], shapes: ['star'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#60a5fa', '#4ade80', '#c084fc'], shapes: ['circle'] });
    }, 250);
  };

  const unlockTheme = (theme: GameTheme) => {
    if (!user) return;
    const cost = (THEME_COSTS as any)[theme] || 0;
    if (user.credits < cost) return;

    setUser(prev => prev ? ({
      ...prev,
      credits: prev.credits - cost,
      unlockedThemes: [...prev.unlockedThemes, theme]
    }) : null);
  };

  const buyCredits = (pack: StoreCreditPack) => {
    if (!user) return;
    setUser(prev => prev ? ({
      ...prev,
      credits: prev.credits + (pack.amount + (pack.bonusAmount || 0))
    }) : null);
  };

  const buyPack = () => {
    if (!user || user.credits < PACK_COST) return;

    // Pseudo-random rarity selection
    const r = Math.random() * 100;
    let rarity: Sticker['rarity'] = 'Common';
    if (r < 6) rarity = 'Legendary';
    else if (r < 30) rarity = 'Rare';

    const possibleStickers = STICKER_POOL.filter(s => s.rarity === rarity);
    const newSticker = possibleStickers[Math.floor(Math.random() * possibleStickers.length)];

    setUser(prev => prev ? ({
      ...prev,
      credits: prev.credits - PACK_COST,
      inventory: [...prev.inventory, newSticker.id]
    }) : null);

    return newSticker;
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${view === 'login' ? (isAdminMode ? 'bg-black' : 'bg-bg') : ''}`}>
      {/* Mute Button (Floating for all pages, Navbar overlaps when logged in) */}
      {view === 'login' && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`fixed top-6 right-6 z-[60] p-4 rounded-3xl transition-all shadow-2xl border-4 ${
            isMuted 
              ? 'bg-accent-block-red text-white border-red-200' 
              : 'bg-white text-text-primary border-black/5 hover:scale-110 active:scale-95'
          }`}
        >
          {isMuted ? <VolumeX size={32} strokeWidth={3} /> : <Volume2 size={32} strokeWidth={3} />}
        </button>
      )}

      {/* Background layer for active gameplay/navigation */}
      {view !== 'login' && view !== 'admin' && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${themeBgs[currentTheme] || 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1920'})` }} 
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div 
            key="login-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 flex items-center justify-center p-6 relative overflow-hidden transition-all duration-1000 ${isAdminMode ? 'bg-black' : 'bg-bg'}`}
          >
            <div className={`absolute inset-0 transition-opacity ${isAdminMode ? 'bg-white/5 opacity-100' : 'opacity-0'} pointer-events-none`} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`z-10 bg-white/95 backdrop-blur-3xl p-10 md:p-14 rounded-[4rem] border-4 shadow-3xl max-w-xl w-full text-center relative transition-colors ${isAdminMode ? 'border-black' : 'border-white'}`}
            >
              {/* Language Selection at the top */}
              <div className="flex justify-center gap-3 mb-10 bg-black/5 p-2 rounded-3xl border-2 border-white/50 w-fit mx-auto">
                {(['PT', 'EN', 'ES', 'FR'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                      language === lang 
                        ? 'bg-accent-block-blue shadow-lg scale-110 -translate-y-1' 
                        : 'bg-white hover:bg-white/70'
                    }`}
                  >
                    {{ PT: '🇵🇹', EN: '🇬🇧', ES: '🇪🇸', FR: '🇫🇷' }[lang]}
                  </button>
                ))}
              </div>

              <h1 className={`text-6xl font-extrabold mb-10 block-logo uppercase leading-none tracking-tight transition-colors ${isAdminMode ? 'text-black' : 'text-accent-block-yellow'}`}>
                {isAdminMode ? 'Painel Mestre' : 'Zôo de Blocos'}
              </h1>

              <div className="space-y-6 text-left">
                <AnimatePresence mode="wait">
                  {!isRegistering ? (
                    <motion.div
                      key="login-fields"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase text-text-secondary ml-4 flex items-center gap-2">
                          <UserIcon size={14} /> {isAdminMode ? 'Admin ID' : 'Explorador'}
                        </label>
                        <input 
                          type="text" 
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          placeholder={isAdminMode ? "admin" : "Ex: Construtor Júnior"}
                          className={`w-full px-6 py-4 rounded-2xl bg-white border-4 border-black/5 outline-none font-bold text-lg transition-all ${isAdminMode ? 'focus:border-black' : 'focus:border-accent-block-blue'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase text-text-secondary ml-4 flex items-center gap-2">
                          <Lock size={14} /> {isAdminMode ? 'Chave de Mestre' : 'Palavra-passe'}
                        </label>
                        <input 
                          type="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full px-6 py-4 rounded-2xl bg-white border-4 border-black/5 outline-none font-bold text-lg transition-all ${isAdminMode ? 'focus:border-black' : 'focus:border-accent-block-blue'}`}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase text-text-secondary ml-4 flex items-center gap-2">
                          <UserIcon size={14} /> Nome Completo
                        </label>
                        <input 
                          type="text" 
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          placeholder="João Silva"
                          className="w-full px-6 py-4 rounded-2xl bg-white border-4 border-black/5 focus:border-accent-block-blue outline-none font-bold text-lg transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase text-text-secondary ml-4 flex items-center gap-2">
                          <Mail size={14} /> Email
                        </label>
                        <input 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="joao@exemplo.com"
                          className="w-full px-6 py-4 rounded-2xl bg-white border-4 border-black/5 focus:border-accent-block-blue outline-none font-bold text-lg transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase text-text-secondary ml-4">Senha</label>
                          <input 
                            type="password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-white border-4 border-black/5 focus:border-accent-block-blue outline-none font-bold text-lg transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase text-text-secondary ml-4">Confirmar</label>
                          <input 
                            type="password" 
                            value={loginConfirmPassword}
                            onChange={(e) => setLoginConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-white border-4 border-black/5 focus:border-accent-block-blue outline-none font-bold text-lg transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-10 space-y-5">
                {!isRegistering ? (
                  <>
                    <button 
                      onClick={() => handleLogin(isAdminMode ? 'ADMIN' : 'PLAYER')}
                      className={`w-full bubble-button text-3xl py-8 ${isAdminMode ? 'bg-black border-gray-900 shadow-none' : 'bg-accent-block-red border-red-900 shadow-[0_15px_40px_rgba(248,113,113,0.4)]'}`}
                    >
                      <Play size={28} fill="currentColor" strokeWidth={3} className="mr-4" />
                      {isAdminMode ? 'ACEDER CÚPULA' : 'ENTRAR'}
                    </button>
                    <div className="flex gap-4">
                      {!isAdminMode ? (
                        <>
                          <button 
                            onClick={() => setIsRegistering(true)}
                            className="flex-1 py-4 bg-white text-text-primary rounded-[1.5rem] font-kids font-black uppercase text-sm border-4 border-black/5 hover:bg-black/5 transition-all shadow-lg"
                          >
                            ⭐ Criar Conta
                          </button>
                          <button 
                            onClick={() => setIsAdminMode(true)}
                            className="flex-1 py-4 bg-black/5 text-text-secondary rounded-[1.5rem] font-kids font-black uppercase text-sm border-4 border-black/5 hover:text-text-primary transition-all"
                          >
                            🛠️ Admin
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setIsAdminMode(false)}
                          className="w-full py-4 bg-white text-text-primary rounded-2xl font-black uppercase text-sm border-2 border-black/5 hover:bg-black/5 transition-all flex items-center justify-center gap-2"
                        >
                          <ArrowLeft size={18} /> Voltar ao Início
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleRegister}
                      className="w-full bubble-button text-2xl py-6 bg-accent-block-green border-green-900 shadow-[0_15px_40px_rgba(74,222,128,0.4)]"
                    >
                      🚀 REGISTAR AGORA!
                    </button>
                    <button 
                      onClick={() => setIsRegistering(false)}
                      className="w-full py-4 text-text-secondary font-kids font-black uppercase text-xs hover:text-text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={14} /> Já tenho conta
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : user ? (
          <motion.div 
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pb-12"
          >
            <Navbar 
              user={user} 
              onViewChange={setView} 
              currentView={view} 
              onLogout={() => { setUser(null); setView('login'); }}
              language={language}
              onLanguageChange={setLanguage}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />

            <main className="max-w-7xl mx-auto px-6 pt-24">
              <AnimatePresence mode="wait">
                {view === 'world' && (
                  <motion.div
                    key="world"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <WorldSelector 
                      unlockedThemes={user.unlockedThemes}
                      language={language}
                      themeBgs={themeBgs}
                      progressMetrics={user.progressMetrics}
                      onSelectWorld={(theme) => {
                        setCurrentTheme(theme);
                        setView('home');
                      }} 
                    />
                  </motion.div>
                )}

                {view === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ModuleSelector 
                      theme={currentTheme}
                      language={language}
                      progressMetrics={user.progressMetrics}
                      onSelectModule={(module, diff) => {
                        setActiveModule(module);
                        setDifficulty(diff);
                        setView('game');
                      }} 
                      onBack={() => setView('world')}
                    />
                  </motion.div>
                )}

                {view === 'game' && activeModule && (
                  <motion.div
                    key="game"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                  >
                    <GameView 
                      moduleType={activeModule as any}
                      theme={currentTheme}
                      language={language}
                      userLevel={(user.progressMetrics?.[`${currentTheme}_${activeModule}`] || 0) + 1}
                      difficulty={difficulty}
                      onWin={handleWin}
                      onBack={() => setView('home')}
                      isMuted={isMuted}
                    />
                  </motion.div>
                )}

                {view === 'album' && (
                  <motion.div
                    key="album"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <StickerAlbum inventory={user.inventory} language={language} isMuted={isMuted} />
                  </motion.div>
                )}

                {view === 'store' && (
                  <motion.div
                    key="store"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ZOOStore 
                      credits={user.credits} 
                      unlockedThemes={user.unlockedThemes}
                      language={language}
                      onBuyPack={buyPack} 
                      onUnlockTheme={unlockTheme}
                      onBuyCredits={buyCredits}
                    />
                  </motion.div>
                )}

                {view === 'radio' && (
                  <motion.div
                    key="radio"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <MusicZone 
                      unlockedMusics={user.unlockedMusics || []} 
                      radioSongs={radioSongs}
                      language={language} 
                    />
                  </motion.div>
                )}

                {view === 'admin' && (
                  <motion.div
                    key="admin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdminDashboard 
                      userCount={12} 
                      achievements={achievements} 
                      config={{
                        themeBgs,
                        themeMusics,
                        themeVideos,
                        mediaLibrary,
                        radioSongs,
                        bgMusicUrl: themeMusics[currentTheme]?.[0] || '',
                        masterVolume
                      }}
                      onUpdateConfig={(newConfig) => {
                        if (newConfig.themeBgs) setThemeBgs(prev => ({ ...prev, ...newConfig.themeBgs }));
                        if (newConfig.themeMusics) setThemeMusics(prev => ({ ...prev, ...newConfig.themeMusics }));
                        if (newConfig.themeVideos) setThemeVideos(prev => ({ ...prev, ...newConfig.themeVideos }));
                        if (newConfig.mediaLibrary) {
                          console.log("A atualizar biblioteca de média:", newConfig.mediaLibrary.length, "itens");
                          setMediaLibrary(newConfig.mediaLibrary);
                        }
                        if (newConfig.radioSongs) setRadioSongs(newConfig.radioSongs);
                        if (newConfig.masterVolume !== undefined) setMasterVolume(newConfig.masterVolume);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
