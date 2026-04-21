/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie as RechartsPie
} from 'recharts';
import { 
  Users, 
  BarChart3, 
  BookMarked, 
  TrendingUp, 
  Settings,
  Activity,
  History,
  ShieldAlert,
  DollarSign,
  Package,
  Unlock,
  Lock,
  UserCheck,
  UserMinus,
  Trash2,
  Star,
  ShoppingBag,
  FileCode,
  Zap,
  ChevronRight,
  Plus,
  UserPlus,
  Search,
  Filter,
  Save,
  RotateCcw,
  Eye,
  Edit3,
  ArrowLeft,
  Music,
  Volume2,
  Image as ImageIcon,
  Check,
  X,
  Languages,
  Layers,
  Video,
  FileUp,
  FileDown,
  Disc,
  Library,
  UploadCloud,
  Play,
  Home
} from 'lucide-react';
import { Achievement, ManagedUser, GameTheme, Sticker, StoreCreditPack, GameLevel, Language, GameModuleType, MediaAsset, RadioSong } from '../../types';
import { STICKER_POOL, CREDIT_PACKS, THEME_COSTS, GAME_LEVELS, THEME_BACKGROUNDS } from '../../constants';

interface AdminDashboardProps {
  userCount: number;
  achievements: Achievement[];
  config: {
    themeBgs: Record<GameTheme, string>;
    themeMusics: Record<GameTheme, string[]>;
    themeVideos: Record<GameTheme, string[]>;
    mediaLibrary: MediaAsset[];
    radioSongs: RadioSong[];
    bgMusicUrl: string;
    masterVolume: number;
  };
  onUpdateConfig: (newConfig: Partial<AdminDashboardProps['config']>) => void;
}

const PROGRESS_DATA = [
  { day: 'Seg', progress: 120 },
  { day: 'Ter', progress: 340 },
  { day: 'Qua', progress: 560 },
  { day: 'Qui', progress: 410 },
  { day: 'Sex', progress: 890 },
  { day: 'Sáb', progress: 1200 },
  { day: 'Dom', progress: 980 },
];

const DIFFICULTY_DATA = [
  { theme: 'Zoo', avgLevel: 14, difficulty: 2 },
  { theme: 'Space', avgLevel: 8, difficulty: 4 },
  { theme: 'Ocean', avgLevel: 5, difficulty: 5 },
  { theme: 'History', avgLevel: 12, difficulty: 3 },
  { theme: 'Home', avgLevel: 25, difficulty: 1 },
];

const DEMO_USERS: ManagedUser[] = [
  { id: '1', username: 'Duarte M.', credits: 450, status: 'active', lastActivity: 'Hoje, 14:02', unlockedThemes: 3 },
  { id: '2', username: 'Sofia R.', credits: 120, status: 'active', lastActivity: 'Ontem', unlockedThemes: 1 },
  { id: '3', username: 'Lucas P.', credits: 50, status: 'locked', lastActivity: 'Há 3 dias', unlockedThemes: 0 },
  { id: '4', username: 'Matilde S.', credits: 890, status: 'active', lastActivity: 'Hoje, 09:15', unlockedThemes: 4 },
  { id: '5', username: 'Tiago F.', credits: 210, status: 'active', lastActivity: 'Há 1 hora', unlockedThemes: 2 },
];

export function AdminDashboard({ userCount, achievements: propAchievements, config, onUpdateConfig }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content' | 'store' | 'assets'>('stats');
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [storageUsage, setStorageUsage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const libraryFileInputRef = useRef<HTMLInputElement>(null);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [libFilterType, setLibFilterType] = useState<'all' | 'image' | 'audio'>('all');
  const [libFilterTheme, setLibFilterTheme] = useState<'all' | GameTheme>('all');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        setRealStats(data);
        setManagedUsers(data.users);
      });
  }, []);

  const totalStickerCount = STICKER_POOL.length;

  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "zoo_config_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        onUpdateConfig({
          themeBgs: importedConfig.themeBgs,
          themeMusics: importedConfig.themeMusics,
          themeVideos: importedConfig.themeVideos || {},
          mediaLibrary: importedConfig.mediaLibrary || [],
          masterVolume: importedConfig.masterVolume
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (err) {
        alert("Erro ao importar ficheiro! Certifica-te de que é um JSON válido.");
      }
    };
    reader.readAsText(file);
  };
  
  // Content Editor State
  const [selectedTheme, setSelectedTheme] = useState<GameTheme | null>(null);
  const [contentMode, setContentMode] = useState<'stickers' | 'levels' | 'radio'>('levels');
  const [editingSticker, setEditingSticker] = useState<Sticker | null>(null);
  const [editingLevel, setEditingLevel] = useState<GameLevel | null>(null);
  const [editingRadioSong, setEditingRadioSong] = useState<RadioSong | null>(null);
  const [isSelectingMedia, setIsSelectingMedia] = useState<{ type: 'sticker' } | { type: 'radio', index: number } | { type: 'theme-bg' } | { type: 'theme-music' } | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>(STICKER_POOL);
  const [levels, setLevels] = useState<GameLevel[]>(GAME_LEVELS);

  // Filters for levels
  const [levelFilterLang, setLevelFilterLang] = useState<Language>('PT');
  const [levelFilterType, setLevelFilterType] = useState<GameModuleType | 'All'>('All');

  // Store Management State
  const [packs, setPacks] = useState<StoreCreditPack[]>(CREDIT_PACKS);
  const [costs, setCosts] = useState(THEME_COSTS);

  const handleUpdateLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;
    setLevels(prev => prev.map(l => l.id === editingLevel.id ? editingLevel : l));
    setEditingLevel(null);
  };

  const toggleUserStatus = (id: string) => {
    setManagedUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u
    ));
  };

  const handleUpdateSticker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSticker) return;
    setStickers(prev => prev.map(s => s.id === editingSticker.id ? editingSticker : s));
    setEditingSticker(null);
  };

  // Metrics Data Calculation
  const stickersByTheme = STICKER_POOL.reduce((acc, s) => {
    acc[s.theme] = (acc[s.theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const PIE_DATA = Object.entries(stickersByTheme).map(([name, value]) => ({ name, value }));
  const COLORS = ['#60a5fa', '#f87171', '#4ade80', '#fbbf24', '#a78bfa'];

  return (
    <div className="py-8 relative">
      {/* Global Success Indicator */}
      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: -20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-accent-block-green text-white px-12 py-4 rounded-3xl font-black uppercase shadow-2xl z-[999] flex items-center gap-3 border-4 border-white scale-110"
          >
            <Check size={24} strokeWidth={4} />
            Alterações Guardadas!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black uppercase text-text-primary block-logo leading-none">Cúpula do Zoo</h2>
          <p className="text-text-secondary font-bold text-lg mt-2">Centro de Comando Pedagógico e Estratégico</p>
        </div>
        
        <div className="flex bg-black/5 p-1.5 rounded-2xl border-2 border-white/50 overflow-x-auto max-w-full">
          <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<Activity size={18} />} label="Métricas" />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Comunidade" />
          <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<FileCode size={18} />} label="Conteúdos" />
          <TabButton active={activeTab === 'store'} onClick={() => setActiveTab('store')} icon={<ShoppingBag size={18} />} label="Boutique" />
          <TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={<Layers size={18} />} label="Assets & Rádio" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' && realStats && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard icon={<Users size={24} />} label="Exploradores Ativos" value={realStats.totalUsers} color="accent-block-blue" trend={`+${realStats.activeToday}`} />
              <StatCard icon={<Star size={24} />} label="Total Estrelas" value={realStats.totalCredits} color="accent-block-yellow" trend="Global" />
              <StatCard icon={<ShoppingBag size={24} />} label="Cromos Obtidos" value={realStats.inventorySize} color="accent-block-green" trend="Total" />
              <StatCard icon={<BookMarked size={24} />} label="Total Cromos" value={totalStickerCount} color="accent-block-red" trend="Estável" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="block-card p-10 bg-white">
                <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                   <Activity className="text-accent-block-blue" /> Tráfego Pedagógico
                </h3>
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PROGRESS_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 'bold'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 'bold'}} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                           itemStyle={{ fontWeight: 'black', textTransform: 'uppercase' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="progress" 
                          stroke="#60a5fa" 
                          strokeWidth={6} 
                          dot={{ r: 8, fill: '#60a5fa', strokeWidth: 4, stroke: '#fff' }}
                          activeDot={{ r: 12, strokeWidth: 0 }}
                        />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="block-card p-10 bg-white">
                <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                   <ShieldAlert className="text-accent-block-red" /> Níveis de Dificuldade
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsPie
                        data={realStats.difficultyStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {realStats.difficultyStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {realStats.difficultyStats.map((d: any) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-black uppercase">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="block-card bg-white p-10"
          >
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-3xl font-black uppercase">Diretório de Construtores</h3>
               <button className="flex items-center gap-2 bg-accent-block-blue text-white px-6 py-3 rounded-2xl font-black uppercase text-sm border-b-6 border-blue-800 shadow-lg hover:translate-y-1 hover:border-b-0 transition-all">
                  <UserPlus size={18} /> Novo Aluno
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-black/5 text-left">
                    <th className="pb-6 text-sm font-black uppercase text-text-secondary tracking-widest pl-4">Nome / Login</th>
                    <th className="pb-6 text-sm font-black uppercase text-text-secondary tracking-widest">Estado</th>
                    <th className="pb-6 text-sm font-black uppercase text-text-secondary tracking-widest">Estrelas</th>
                    <th className="pb-6 text-sm font-black uppercase text-text-secondary tracking-widest">Mundos</th>
                    <th className="pb-6 text-sm font-black uppercase text-text-secondary tracking-widest text-right pr-4">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/5">
                  {managedUsers.map(user => (
                    <tr key={user.id} className="group hover:bg-black/2 transition-colors">
                      <td className="py-6 pl-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center font-black text-xl text-text-secondary border-2 border-black/5">
                             {user.username[0]}
                           </div>
                           <div>
                              <p className="font-black text-lg leading-none">{user.username}</p>
                              <span className="text-xs text-text-secondary font-bold">ID: #{String(user.id).padStart(4, '0')}</span>
                           </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 shadow-sm ${
                          user.status === 'active' ? 'bg-accent-block-green/10 text-accent-block-green border-accent-block-green/20' : 'bg-red-100 text-red-600 border-red-200'
                        }`}>
                          {user.status === 'active' ? 'ATIVO' : 'BLOQUEADO'}
                        </span>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2 font-black text-accent-block-yellow">
                           <Star size={16} fill="currentColor" />
                           {user.credits}
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2 font-black">
                           <Unlock size={16} className="text-accent-block-blue" />
                           {user.unlockedThemes}
                        </div>
                      </td>
                      <td className="py-6 text-right pr-4">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toggleUserStatus(user.id)}
                            className="p-3 bg-bg hover:bg-white rounded-xl text-text-secondary transition-all shadow-sm active:scale-90"
                          >
                            {user.status === 'active' ? <UserMinus size={20} /> : <UserCheck size={20} />}
                          </button>
                          <button className="p-3 bg-accent-block-red/10 hover:bg-accent-block-red hover:text-white rounded-xl text-accent-block-red transition-all shadow-sm active:scale-90">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {!selectedTheme ? (
              <div className="block-card p-10 bg-white shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                   <div>
                      <h3 className="text-4xl font-black uppercase block-logo text-accent-block-blue leading-none">Gestor de Conteúdos</h3>
                      <p className="text-text-secondary font-bold text-lg">Administra o currículo pedagógico e coleções de cada mundo.</p>
                   </div>
                   <div className="flex bg-bg p-2 rounded-2xl border-4 border-white shadow-inner">
                      <button 
                        onClick={() => setContentMode('levels')}
                        className={`px-6 py-3 rounded-xl font-black uppercase text-xs transition-all ${contentMode === 'levels' ? 'bg-accent-block-blue text-white shadow-lg' : 'text-text-secondary'}`}
                      >
                        Exercícios
                      </button>
                      <button 
                        onClick={() => setContentMode('stickers')}
                        className={`px-6 py-3 rounded-xl font-black uppercase text-xs transition-all ${contentMode === 'stickers' ? 'bg-accent-block-yellow text-white shadow-lg' : 'text-text-secondary'}`}
                      >
                        Cromos
                      </button>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {['Zoo', 'Space', 'Ocean', 'History', 'Home'].map(theme => {
                     const themeStickers = stickers.filter(s => s.theme === theme);
                     const themeLevels = levels.filter(l => l.theme === theme);
                     return (
                       <div 
                         key={theme} 
                         onClick={() => setSelectedTheme(theme as GameTheme)}
                         className="p-8 rounded-[3.5rem] bg-bg border-4 border-white shadow-xl group cursor-pointer hover:-translate-y-3 transition-all relative overflow-hidden"
                       >
                         <div 
                           className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12"
                           style={{ color: COLORS[['Zoo', 'Space', 'Ocean', 'History', 'Home'].indexOf(theme)] }}
                         >
                            {contentMode === 'stickers' ? <Package size={120} /> : <FileCode size={120} />}
                         </div>
                         <div className="flex items-center justify-between mb-8">
                            <div 
                              className="w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg font-black text-3xl text-white"
                              style={{ backgroundColor: COLORS[['Zoo', 'Space', 'Ocean', 'History', 'Home'].indexOf(theme)] }}
                            >
                               {theme[0]}
                            </div>
                            <div className="bg-white/50 px-4 py-2 rounded-2xl border-2 border-white font-black text-[10px] uppercase tracking-widest group-hover:bg-white transition-colors">
                               Explorar
                            </div>
                         </div>
                         <h4 className="text-3xl font-black uppercase mb-4">{theme}</h4>
                         <div className="space-y-3">
                           <p className="text-sm font-bold text-text-secondary flex justify-between items-center">
                              <span className="flex items-center gap-2 opacity-60"><Package size={14} /> Cromos</span>
                              <span className="text-text-primary bg-white px-3 py-1 rounded-xl border border-black/5">{themeStickers.length}</span>
                           </p>
                           <p className="text-sm font-bold text-text-secondary flex justify-between items-center">
                              <span className="flex items-center gap-2 opacity-60"><Activity size={14} /> Exercícios</span>
                              <span className="text-text-primary bg-white px-3 py-1 rounded-xl border border-black/5">{themeLevels.length}</span>
                           </p>
                         </div>
                         <div className="mt-8">
                            <div className="flex justify-between text-[10px] font-black uppercase text-text-secondary mb-2">
                               <span>Progresso do Mundo</span>
                               <span>{Math.round((themeLevels.length / 50) * 100)}%</span>
                            </div>
                            <div className="h-4 w-full bg-white rounded-full overflow-hidden border-2 border-black/5 p-0.5">
                               <div 
                                 className="h-full rounded-full transition-all duration-1000" 
                                 style={{ 
                                   width: `${(themeLevels.length / 50) * 100}%`,
                                   backgroundColor: COLORS[['Zoo', 'Space', 'Ocean', 'History', 'Home'].indexOf(theme)]
                                 }} 
                               />
                            </div>
                         </div>
                       </div>
                     );
                   })}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between bg-white/40 p-6 rounded-[2.5rem] border-4 border-white shadow-xl">
                  <button 
                    onClick={() => { setSelectedTheme(null); setEditingSticker(null); setEditingLevel(null); }}
                    className="flex items-center gap-3 text-text-primary font-black uppercase text-sm bg-white px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition-all"
                  >
                    <ArrowLeft size={18} /> Todos os Mundos
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black uppercase tracking-widest text-text-secondary">EDITANDO:</span>
                    <span className="px-6 py-2 bg-accent-block-blue text-white rounded-full font-black uppercase text-sm shadow-inner-card">{selectedTheme}</span>
                  </div>
                  <div className="flex bg-bg p-1.5 rounded-xl border-2 border-white shadow-inner">
                    <button 
                      onClick={() => setContentMode('levels')}
                      className={`px-4 py-2 rounded-lg font-black uppercase text-[10px] transition-all ${contentMode === 'levels' ? 'bg-white text-accent-block-blue shadow-md' : 'text-text-secondary'}`}
                    >
                      Níveis
                    </button>
                    <button 
                      onClick={() => setContentMode('stickers')}
                      className={`px-4 py-2 rounded-lg font-black uppercase text-[10px] transition-all ${contentMode === 'stickers' ? 'bg-white text-accent-block-yellow shadow-md' : 'text-text-secondary'}`}
                    >
                      Fotos
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Item List */}
                  <div className="lg:col-span-3 block-card p-10 bg-white shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <h3 className="text-3xl font-black uppercase flex items-center gap-4">
                        {contentMode === 'stickers' ? <Package className="text-accent-block-yellow" size={32} /> : <FileCode className="text-accent-block-blue" size={32} />}
                        {contentMode === 'stickers' ? 'Coleção de Cromos' : 'Currículo de Exercícios'}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {contentMode === 'levels' && (
                          <>
                            <select 
                              value={levelFilterLang}
                              onChange={(e) => setLevelFilterLang(e.target.value as Language)}
                              className="px-4 py-2 bg-bg border-2 border-black/5 rounded-xl text-[10px] font-black uppercase outline-none focus:border-accent-block-blue"
                            >
                              <option value="PT">🇵🇹 PORTUGUÊS</option>
                              <option value="EN">🇬🇧 ENGLISH</option>
                              <option value="ES">🇪🇸 ESPAÑOL</option>
                              <option value="FR">🇫🇷 FRANÇAIS</option>
                            </select>
                            <select 
                              value={levelFilterType}
                              onChange={(e) => setLevelFilterType(e.target.value as any)}
                              className="px-4 py-2 bg-bg border-2 border-black/5 rounded-xl text-[10px] font-black uppercase outline-none focus:border-accent-block-blue"
                            >
                              <option value="All">TODOS OS TIPOS</option>
                              <option value="Letters">LETRAS</option>
                              <option value="Syllables">SÍLABAS</option>
                              <option value="Digraphs">DÍGRAFOS</option>
                              <option value="Order">ORDEM</option>
                              <option value="Tonic">TÓNICAS</option>
                              <option value="Phrases">FRASES</option>
                              <option value="Match">CORRESPONDÊNCIA</option>
                            </select>
                          </>
                        )}
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                          <input type="text" placeholder="Pesquisar..." className="pl-10 pr-4 py-2 bg-bg border-2 border-black/5 rounded-xl text-xs font-bold w-40 outline-none focus:border-accent-block-blue" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {contentMode === 'stickers' ? (
                        stickers.filter(s => s.theme === selectedTheme).map(sticker => (
                          <div 
                            key={sticker.id}
                            onClick={() => setEditingSticker(sticker)}
                            className={`p-4 rounded-[2.5rem] border-4 transition-all cursor-pointer group flex flex-col items-center text-center ${editingSticker?.id === sticker.id ? 'border-accent-block-yellow bg-accent-block-yellow/5 shadow-lg' : 'border-black/5 bg-bg hover:border-white hover:shadow-2xl'}`}
                          >
                            <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 relative border-2 border-white shadow-inner">
                              <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                              <div className="absolute top-3 right-3">
                                 <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase text-white shadow-lg ${
                                   sticker.rarity === 'Legendary' ? 'bg-accent-block-yellow' : 
                                   sticker.rarity === 'Rare' ? 'bg-accent-block-red' : 'bg-accent-block-blue'
                                 }`}>
                                   {sticker.rarity}
                                 </div>
                              </div>
                            </div>
                            <h5 className="font-black uppercase text-sm leading-tight mb-2 px-2">{sticker.name}</h5>
                            <div className="mt-auto flex gap-4 w-full">
                               <div className="flex-1 bg-white/50 rounded-xl py-1 text-[10px] font-black text-text-secondary uppercase">ID #{sticker.id}</div>
                               <div className="flex-1 bg-white/50 rounded-xl py-1 text-[10px] font-black text-accent-block-blue">PWR {sticker.pwr}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        levels.filter(l => l.theme === selectedTheme && l.lang === levelFilterLang && (levelFilterType === 'All' || l.type === levelFilterType)).map(level => (
                          <div 
                            key={level.id}
                            onClick={() => setEditingLevel(level)}
                            className={`p-6 rounded-[2.5rem] border-4 transition-all cursor-pointer group flex flex-col ${editingLevel?.id === level.id ? 'border-accent-block-blue bg-accent-block-blue/5 shadow-lg' : 'border-black/5 bg-bg hover:border-white hover:shadow-2xl'}`}
                          >
                            <div className="flex justify-between items-start mb-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-black/5 text-accent-block-blue">
                                  {level.id.includes('l') ? 'L' : level.id.includes('s') ? 'S' : 'O'}
                               </div>
                               <span className="text-[8px] font-black uppercase text-text-secondary opacity-50">#{level.id}</span>
                            </div>
                            <h5 className="font-black text-xs leading-snug mb-4 line-clamp-2">{level.question}</h5>
                            <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
                               <span className="text-[10px] font-black text-accent-block-blue">{level.type}</span>
                               <span className="text-[10px] font-black text-accent-block-green bg-accent-block-green/5 px-2 py-1 rounded-lg">VERIFICADO</span>
                            </div>
                          </div>
                        ))
                      )}
                      <div className="p-6 rounded-[2.5rem] border-4 border-dashed border-black/10 flex flex-col items-center justify-center text-text-secondary hover:border-accent-block-blue hover:text-accent-block-blue transition-all cursor-pointer bg-bg hover:bg-white group">
                        <Plus size={48} className="group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-3">Novo {contentMode === 'stickers' ? 'Cromo' : 'Exercício'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editor Forms */}
                  <div className="space-y-6">
                    {/* Sticker Editor View */}
                    {contentMode === 'stickers' && (
                       <div className="block-card p-10 bg-white border-l-[12px] border-accent-block-yellow shadow-xl sticky top-24">
                        {editingSticker ? (
                          <form onSubmit={handleUpdateSticker} className="space-y-8">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-black uppercase flex items-center gap-3">
                                <Edit3 size={24} className="text-accent-block-yellow" /> Editar Cromo
                              </h3>
                              <button type="button" onClick={() => setEditingSticker(null)}><X size={20} className="text-text-secondary" /></button>
                            </div>
                            
                            <div className="space-y-1">
                               <label className="text-[10px] font-black uppercase text-text-secondary ml-3 flex items-center gap-2 italic">Pré-visualização</label>
                               <div className="aspect-square rounded-[2rem] overflow-hidden border-4 border-bg shadow-xl">
                                  <img src={editingSticker.imageUrl} className="w-full h-full object-cover" />
                               </div>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Nome do Animal</label>
                                <input 
                                  type="text" 
                                  value={editingSticker.name}
                                  onChange={e => setEditingSticker({...editingSticker, name: e.target.value})}
                                  className="w-full px-5 py-4 rounded-2xl bg-bg border-4 border-black/5 font-black text-lg outline-none focus:border-accent-block-yellow transition-all"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Raridade</label>
                                    <select 
                                      value={editingSticker.rarity}
                                      onChange={e => setEditingSticker({...editingSticker, rarity: e.target.value as any})}
                                      className="w-full px-5 py-4 rounded-2xl bg-bg border-4 border-black/5 font-black text-sm outline-none"
                                    >
                                      <option value="Common">Comum</option>
                                      <option value="Rare">Raro</option>
                                      <option value="Legendary">Lendário</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Poder (PWR)</label>
                                    <input 
                                      type="number" 
                                      value={editingSticker.pwr}
                                      onChange={e => setEditingSticker({...editingSticker, pwr: parseInt(e.target.value)})}
                                      className="w-full px-5 py-4 rounded-2xl bg-bg border-4 border-black/5 font-black text-sm"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between ml-2">
                                  <label className="text-[10px] font-black uppercase text-text-secondary">URL da Imagem</label>
                                  <button 
                                    type="button"
                                    onClick={() => setIsSelectingMedia({ type: 'sticker' })}
                                    className="text-[9px] font-black uppercase text-accent-block-blue hover:underline flex items-center gap-1"
                                  >
                                    <Library size={12} /> Escolher da Biblioteca
                                  </button>
                                </div>
                                <input 
                                  type="text" 
                                  value={editingSticker.imageUrl}
                                  onChange={e => setEditingSticker({...editingSticker, imageUrl: e.target.value})}
                                  className="w-full px-5 py-3 rounded-2xl bg-bg border-4 border-black/5 font-mono text-[10px] outline-none focus:border-accent-block-yellow"
                                />
                              </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                               <button 
                                 type="submit"
                                 className="flex-1 py-5 bg-accent-block-yellow text-white rounded-3xl font-black uppercase text-sm shadow-xl border-b-8 border-yellow-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
                               >
                                 <Save size={20} /> Guardar Alterações
                               </button>
                            </div>
                          </form>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-32 grayscale opacity-40">
                             <Package size={80} className="animate-bounce" />
                             <p className="text-sm font-black uppercase leading-relaxed max-w-[200px] mx-auto">Seleciona um cromo para ajustar a raridade e o poder pedagógico.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Level Editor View */}
                    {contentMode === 'levels' && (
                       <div className="block-card p-10 bg-white border-l-[12px] border-accent-block-blue shadow-xl sticky top-24">
                        {editingLevel ? (
                          <form onSubmit={handleUpdateLevel} className="space-y-8">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-black uppercase flex items-center gap-3">
                                <Edit3 size={24} className="text-accent-block-blue" /> Editar Exercício
                              </h3>
                              <button type="button" onClick={() => setEditingLevel(null)}><X size={20} className="text-text-secondary" /></button>
                            </div>

                            <div className="space-y-5">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Pergunta / Enunciado</label>
                                <textarea 
                                  value={editingLevel.question}
                                  onChange={e => setEditingLevel({...editingLevel, question: e.target.value})}
                                  className="w-full px-5 py-4 rounded-2xl bg-bg border-4 border-black/5 font-black text-sm outline-none focus:border-accent-block-blue transition-all min-h-[100px]"
                                />
                              </div>
                              
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Resposta Correta</label>
                                <input 
                                  type="text" 
                                  value={editingLevel.answer}
                                  onChange={e => setEditingLevel({...editingLevel, answer: e.target.value})}
                                  className="w-full px-5 py-4 rounded-2xl bg-bg border-4 border-black/5 font-black text-lg outline-none focus:border-accent-block-blue transition-all"
                                />
                              </div>

                              <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Opções de Resposta</label>
                                <div className="grid grid-cols-2 gap-3">
                                  {editingLevel.options.map((opt, idx) => (
                                    <input 
                                      key={idx}
                                      type="text" 
                                      value={opt}
                                      onChange={e => {
                                        const newOpts = [...editingLevel.options];
                                        newOpts[idx] = e.target.value;
                                        setEditingLevel({...editingLevel, options: newOpts});
                                      }}
                                      className="w-full px-4 py-3 rounded-xl bg-bg border-2 border-black/5 font-bold text-xs"
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-secondary ml-2">Tipo de Mecânica</label>
                                <div className="flex bg-bg p-2 rounded-2xl border-2 border-black/5">
                                   {['Letters', 'Syllables', 'Digraphs', 'Order', 'Tonic', 'Phrases', 'Match'].map(t => (
                                     <button 
                                       key={t}
                                       type="button"
                                       onClick={() => setEditingLevel({...editingLevel, type: t as any})}
                                       className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${editingLevel.type === t ? 'bg-white text-accent-block-blue shadow-lg' : 'text-text-secondary'}`}
                                     >
                                       {t.substring(0, 3)}
                                     </button>
                                   ))}
                                </div>
                              </div>
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-5 bg-accent-block-blue text-white rounded-3xl font-black uppercase text-sm shadow-xl border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
                            >
                              <Save size={20} /> Guardar Exercício
                            </button>
                          </form>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-32 grayscale opacity-40">
                             <FileCode size={80} className="animate-pulse" />
                             <p className="text-sm font-black uppercase leading-relaxed max-w-[200px] mx-auto">Seleciona um exercício para editar as perguntas e respostas pedagógicas.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'store' && (
          <motion.div
            key="store"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <StatCard icon={<DollarSign size={24} />} label="Vendas Hoje" value="€ 120,40" color="accent-block-green" trend="+18%" />
               <StatCard icon={<TrendingUp size={24} />} label="Conversão" value="4.2%" color="accent-block-blue" trend="+0.5%" />
               <StatCard icon={<Zap size={24} />} label="Ativos em Promo" value="3" color="accent-block-yellow" trend="Max" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Pack Management */}
               <div className="block-card p-10 bg-white">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-black uppercase">Gestor de Recargas</h3>
                     <Settings size={20} className="text-text-secondary" />
                  </div>
                  
                  <div className="space-y-4">
                    {packs.map(pack => (
                      <div key={pack.id} className="flex items-center justify-between p-6 bg-bg rounded-[2.5rem] border-2 border-black/5 group hover:border-accent-block-blue transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-black/5 text-accent-block-yellow">
                              <Star size={24} fill="currentColor" />
                           </div>
                           <div>
                              <h5 className="font-black uppercase text-sm">{pack.label}</h5>
                              <p className="text-[10px] font-bold text-text-secondary">{pack.amount} Estrelas</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="text-right mr-2">
                             <input 
                              type="text" 
                              value={`€ ${pack.price}`} 
                              readOnly 
                              className="w-20 text-right font-black text-sm bg-transparent outline-none cursor-default" 
                             />
                           </div>
                           <button className="p-2 bg-white rounded-xl text-text-secondary border-2 border-black/5 hover:text-accent-block-blue transition-all">
                              <Edit3 size={14} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Campaigns & Promos */}
               <div className="block-card p-10 bg-white border-b-[20px] border-accent-block-red">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-2xl font-black uppercase">Campanhas Ativas</h3>
                     <button className="text-accent-block-red font-black uppercase text-[10px] border-2 border-accent-block-red px-4 py-2 rounded-full hover:bg-accent-block-red hover:text-white transition-all">
                        Criar Flash Sale
                     </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative p-8 rounded-[3rem] bg-gradient-to-br from-accent-block-red to-red-800 text-white shadow-2xl overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 transform rotate-12 -translate-y-4 translate-x-4 opacity-10 group-hover:scale-110 transition-transform">
                          <Zap size={150} fill="currentColor" />
                       </div>
                       <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                             <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 inline-block">Flash Sale Lançamento</span>
                             <h4 className="text-3xl font-black uppercase leading-none mb-2 text-white drop-shadow-md">Safari Pack Beta</h4>
                             <p className="text-sm font-bold text-white/80">Descontos de 50% em mundos bloqueados por mais 24h.</p>
                          </div>
                          <div className="mt-8 flex items-center gap-4">
                             <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-white w-[65%]" />
                             </div>
                             <span className="text-xs font-black uppercase">65% Meta</span>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Price Table - Worlds */}
            <div className="block-card p-10 bg-white shadow-inner-card">
               <h3 className="text-2xl font-black uppercase mb-8">Gestão de Mundos</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(costs).map(([theme, cost]) => (
                    <div key={theme} className="p-6 rounded-3xl bg-bg border-4 border-white shadow-md text-center">
                       <h6 className="font-black uppercase text-xs text-text-secondary mb-3">{theme}</h6>
                       <div className="text-2xl font-black text-text-primary px-4 py-2 bg-white rounded-2xl border-2 border-black/5">
                          {cost === 0 ? 'FREE' : `${cost} ⭐`}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'assets' && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* World Intelligence Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] border-4 border-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-accent-block-blue" />
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-accent-block-blue text-white rounded-[1.5rem] shadow-xl flex items-center justify-center">
                    <Layers size={32} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black uppercase leading-none block-logo">Arquiteto de Mundos</h3>
                    <p className="text-text-secondary font-bold text-sm mt-1 opacity-60">Consolidação estratégica de ambientes e média.</p>
                 </div>
               </div>
               
               <div className="flex flex-wrap items-center gap-4">
                 <div className="bg-bg px-5 py-3 rounded-2xl border-2 border-white shadow-inner flex flex-col items-center min-w-[120px]">
                    <span className="text-[9px] font-black uppercase text-text-secondary mb-1">Capacidade</span>
                    <div className="w-24 h-2 bg-black/5 rounded-full overflow-hidden">
                       <div className={`h-full transition-all ${storageUsage > 4 ? 'bg-accent-block-red' : storageUsage > 2.5 ? 'bg-accent-block-yellow' : 'bg-accent-block-green'}`} style={{ width: `${(storageUsage / 5) * 100}%` }} />
                    </div>
                    <span className="text-[9px] font-black mt-1">{storageUsage.toFixed(1)}MB / 5.0MB</span>
                 </div>

                 <div className="flex gap-2">
                   <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-bg rounded-2xl hover:bg-white transition-all shadow-sm border-2 border-transparent hover:border-black/5"><FileUp size={20} /></button>
                   <button onClick={handleExportConfig} className="p-4 bg-bg rounded-2xl hover:bg-white transition-all shadow-sm border-2 border-transparent hover:border-black/5"><FileDown size={20} /></button>
                   <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportConfig} />
                 </div>

                 <button 
                  onClick={() => { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); }}
                  className="px-8 py-4 bg-black text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-b-6 border-gray-800 active:border-b-0"
                 >
                   <Save size={18} /> Guardar Config
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
               {/* Gestor de Rádio Zoo */}
               <div className="xl:col-span-12">
                  <div className="block-card p-10 bg-white border-l-[12px] border-accent-block-red shadow-2xl">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-accent-block-red rounded-2xl flex items-center justify-center text-white shadow-lg">
                              <Music size={32} />
                           </div>
                           <div>
                              <h4 className="text-3xl font-black uppercase leading-tight">Gestor da Rádio Zoo</h4>
                              <p className="text-text-secondary font-bold text-sm">Organiza as batidas desbloqueáveis para os exploradores.</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => {
                             const newSong: RadioSong = { url: '', title: 'Nova Música', artist: 'Artista', color: '#60a5fa' };
                             onUpdateConfig({ radioSongs: [...(config.radioSongs || []), newSong] });
                           }}
                           className="bg-accent-block-red text-white px-8 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                           <Plus size={18} /> Adicionar Faixa
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(config.radioSongs || []).map((song, idx) => (
                           <div key={idx} className="p-6 bg-bg rounded-[2.5rem] border-4 border-white shadow-xl relative group">
                              <button 
                                 onClick={() => onUpdateConfig({ radioSongs: config.radioSongs.filter((_, i) => i !== idx) })}
                                 className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-accent-block-red text-accent-block-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                              >
                                 <X size={14} />
                              </button>
                              
                              <div className="flex items-center gap-4 mb-6">
                                 <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: song.color }}>
                                    <Disc size={24} className="animate-spin-slow" />
                                 </div>
                                 <div className="flex-1">
                                    <input 
                                       value={song.title}
                                       onChange={(e) => {
                                          const newSongs = [...config.radioSongs];
                                          newSongs[idx] = { ...song, title: e.target.value };
                                          onUpdateConfig({ radioSongs: newSongs });
                                       }}
                                       className="w-full bg-transparent border-b-2 border-transparent focus:border-accent-block-red font-black uppercase text-sm outline-none px-1"
                                       placeholder="Título"
                                    />
                                    <input 
                                       value={song.artist}
                                       onChange={(e) => {
                                          const newSongs = [...config.radioSongs];
                                          newSongs[idx] = { ...song, artist: e.target.value };
                                          onUpdateConfig({ radioSongs: newSongs });
                                       }}
                                       className="w-full bg-transparent border-b-2 border-transparent focus:border-accent-block-red font-bold text-[10px] text-text-secondary outline-none px-1"
                                       placeholder="Artista"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="space-y-1">
                                    <div className="flex justify-between items-end px-1">
                                       <label className="text-[8px] font-black uppercase text-text-secondary">URL MP3</label>
                                       <button 
                                          onClick={() => setIsSelectingMedia({ type: 'radio', index: idx })}
                                          className="text-[7px] font-black uppercase text-accent-block-blue hover:underline"
                                       >
                                          Biblioteca
                                       </button>
                                    </div>
                                    <input 
                                       value={song.url}
                                       onChange={(e) => {
                                          const newSongs = [...config.radioSongs];
                                          newSongs[idx] = { ...song, url: e.target.value };
                                          onUpdateConfig({ radioSongs: newSongs });
                                       }}
                                       className="w-full bg-white border-2 border-black/5 rounded-xl px-3 py-2 text-[9px] font-mono outline-none"
                                    />
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <label className="text-[8px] font-black uppercase text-text-secondary px-1">Cor</label>
                                    <div className="flex gap-1.5 flex-1">
                                       {['#60a5fa', '#4ade80', '#fb923c', '#f87171', '#c084fc', '#ec4899', '#fbbf24'].map(c => (
                                          <button
                                             key={c}
                                             onClick={() => {
                                                const newSongs = [...config.radioSongs];
                                                newSongs[idx] = { ...song, color: c };
                                                onUpdateConfig({ radioSongs: newSongs });
                                             }}
                                             className={`w-6 h-6 rounded-lg border-2 transition-all ${song.color === c ? 'border-black scale-110 shadow-md' : 'border-white shadow-sm'}`}
                                             style={{ backgroundColor: c }}
                                          />
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

              {/* Theme Settings Panel */}
              <div className="xl:col-span-12 space-y-8">
                 <div className="bg-white p-3 rounded-[2.5rem] border-4 border-white shadow-xl flex gap-2 overflow-x-auto no-scrollbar max-w-fit mx-auto">
                    {(['Zoo', 'Space', 'Ocean', 'History', 'Home'] as GameTheme[]).map(theme => (
                       <button
                         key={theme}
                         onClick={() => setSelectedTheme(theme)}
                         className={`px-8 py-3 rounded-2xl font-black uppercase text-xs transition-all flex items-center gap-2 ${
                           selectedTheme === theme 
                             ? 'bg-accent-block-blue text-white shadow-xl -translate-y-1' 
                             : 'bg-bg text-text-secondary hover:bg-white'
                         }`}
                       >
                         {theme === 'Zoo' ? <Zap size={14} /> : theme === 'Space' ? <Star size={14} /> : theme === 'Ocean' ? <Activity size={14} /> : theme === 'History' ? <History size={14} /> : <Home size={14} />}
                         {theme}
                       </button>
                    ))}
                 </div>

                 {selectedTheme ? (
                   <div className="block-card p-10 bg-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                         <ImageIcon size={120} />
                      </div>
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-2xl font-black uppercase">Mundo: <span className="text-accent-block-blue font-logo">{selectedTheme}</span></h4>
                        <div className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-4">
                           <Volume2 size={16} />
                           <input 
                             type="range" min="0" max="1" step="0.01"
                             value={config.masterVolume}
                             onChange={(e) => onUpdateConfig({ masterVolume: parseFloat(e.target.value) })}
                             className="w-24 accent-accent-block-blue h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                           />
                           <span className="text-[10px] font-black w-8">{Math.round(config.masterVolume * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-4">
                             <div className="flex items-center justify-between ml-4">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Papel de Parede</label>
                               <button 
                                 type="button"
                                 onClick={() => setIsSelectingMedia({ type: 'theme-bg' })}
                                 className="text-[9px] font-black uppercase text-accent-block-blue hover:underline"
                               >
                                 Biblioteca
                               </button>
                             </div>
                            <div className="aspect-video rounded-[2.5rem] bg-bg border-4 border-white shadow-2xl overflow-hidden relative shadow-inner group/preview">
                               <img src={config.themeBgs[selectedTheme]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <input 
                              type="text" 
                              value={config.themeBgs[selectedTheme]}
                              onChange={(e) => onUpdateConfig({ themeBgs: { ...config.themeBgs, [selectedTheme]: e.target.value } })}
                              className="w-full px-6 py-4 rounded-2xl bg-bg border-2 border-black/5 font-mono text-[10px] outline-none focus:border-accent-block-blue"
                              placeholder="URL da Imagem..."
                            />
                         </div>

                         <div className="space-y-8">
                            <div className="space-y-4">
                               <div className="flex items-center justify-between ml-4">
                                  <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Engenharia Sonora</label>
                                  <button 
                                    type="button"
                                    onClick={() => setIsSelectingMedia({ type: 'theme-music' })}
                                    className="text-[9px] font-black uppercase text-accent-block-blue hover:underline"
                                  >
                                    Biblioteca
                                  </button>
                                </div>
                               <div className="bg-bg p-6 rounded-[2.5rem] border-2 border-black/5 relative">
                                  <textarea 
                                     value={config.themeMusics[selectedTheme]?.join('\n') || ''}
                                     onChange={(e) => {
                                       const list = e.target.value.split('\n').map(u => u.trim()).filter(Boolean);
                                       onUpdateConfig({ themeMusics: { ...config.themeMusics, [selectedTheme]: list } });
                                     }}
                                     className="w-full h-24 bg-transparent outline-none font-mono text-[11px] resize-none"
                                     placeholder="Dica: Cola URLs MP3 um por linha..."
                                  />
                                  <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-black/5">
                                     <Music size={14} className="text-accent-block-blue" />
                                     <span className="text-[10px] font-black">{config.themeMusics[selectedTheme]?.length || 0}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-4">Vídeos de Suporte</label>
                               <div className="bg-bg p-6 rounded-[2.5rem] border-2 border-black/5 relative">
                                  <textarea 
                                     value={config.themeVideos[selectedTheme]?.join('\n') || ''}
                                     onChange={(e) => {
                                       const list = e.target.value.split('\n').map(u => u.trim()).filter(Boolean);
                                       onUpdateConfig({ themeVideos: { ...config.themeVideos, [selectedTheme]: list } });
                                     }}
                                     className="w-full h-20 bg-transparent outline-none font-mono text-[11px] resize-none"
                                  />
                                  <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-black/5">
                                     <Video size={14} className="text-accent-block-red" />
                                     <span className="text-[10px] font-black">{config.themeVideos[selectedTheme]?.length || 0}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="block-card p-16 bg-bg border-4 border-dashed border-white text-center flex flex-col items-center justify-center opacity-70">
                      <Zap size={40} className="text-accent-block-blue animate-pulse mb-6" />
                      <h4 className="text-2xl font-black uppercase">Configurador de Temas</h4>
                      <p className="text-text-secondary font-bold text-sm">Clica num mundo acima para gerir os seus recursos identidade.</p>
                   </div>
                 )}
              </div>

              <div className="xl:col-span-12">
                 <div className="block-card p-10 bg-white shadow-2xl flex flex-col min-h-[600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-accent-block-green rounded-2xl flex items-center justify-center text-white shadow-lg">
                             <Library size={32} />
                          </div>
                          <div>
                             <h4 className="text-3xl font-black uppercase leading-tight">Biblioteca de Media</h4>
                             <p className="text-text-secondary font-bold text-sm">Grelha consolidada de assets visuais e sonoros.</p>
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-4">
                          <div className="flex bg-bg p-1.5 rounded-2xl border-2 border-black/5 shadow-inner">
                             {(['all', 'image', 'audio'] as const).map(type => (
                                <button
                                  key={type}
                                  onClick={() => setLibFilterType(type)}
                                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${libFilterType === type ? 'bg-white text-accent-block-blue shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                   {type === 'all' ? 'Tudo' : type === 'image' ? 'Fotos' : 'Sons'}
                                </button>
                             ))}
                          </div>
                          <select 
                             value={libFilterTheme}
                             onChange={(e) => setLibFilterTheme(e.target.value as any)}
                             className="bg-bg border-2 border-black/5 px-4 py-3 rounded-2xl text-[10px] font-black uppercase min-w-[160px] outline-none focus:border-accent-block-blue"
                          >
                             <option value="all">TODOS OS MUNDOS</option>
                             <option value="unassigned">SEM MUNDO</option>
                             {['Zoo', 'Space', 'Ocean', 'History', 'Home'].map(t => (
                               <option key={t} value={t}>{t.toUpperCase()}</option>
                             ))}
                          </select>
                          <button 
                            onClick={() => libraryFileInputRef.current?.click()}
                            className="bg-accent-block-green text-white px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                          >
                            <UploadCloud size={18} /> Upload
                          </button>
                       </div>
                    </div>
                    
                    <input 
                       type="file" multiple ref={libraryFileInputRef} className="hidden" accept="audio/*,image/*" 
                       onChange={async (e) => {
                          const files = Array.from(e.target.files || []) as File[];
                           if (!files.length) return;
                           setLoadingAssets(true);
                           const newAssets: MediaAsset[] = [];
                           let skippedCount = 0;
                           for (const file of files) {
                             if (file.size > 30 * 1024 * 1024) { skippedCount++; continue; }
                             try {
                               const dataUrl = await new Promise<string>((res, rej) => {
                                 const r = new FileReader(); r.onload = (ev) => res(ev.target?.result as string); r.onerror = rej; r.readAsDataURL(file);
                               });
                               newAssets.push({ 
                                 id: Math.random().toString(36).substr(2, 9), 
                                 name: file.name.substring(0, 15), 
                                 url: dataUrl, 
                                 type: file.type.startsWith('audio') ? 'audio' : 'image',
                                 theme: selectedTheme || undefined
                               });
                             } catch (err) { console.error(err); }
                           }
                           if (skippedCount > 0) alert(`${skippedCount} ficheiros ignorados (>30MB).`);
                           if (newAssets.length > 0) onUpdateConfig({ mediaLibrary: [...config.mediaLibrary, ...newAssets] });
                           setLoadingAssets(false);
                           e.target.value = '';
                       }}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pr-2 no-scrollbar pb-8 overflow-y-auto max-h-[600px]">
                       {config.mediaLibrary
                         .filter(asset => {
                            if (libFilterType !== 'all' && asset.type !== libFilterType) return false;
                            if (libFilterTheme !== 'all') {
                               if (libFilterTheme === 'unassigned') return !asset.theme;
                               return asset.theme === libFilterTheme;
                            }
                            return true;
                         })
                         .map(asset => (
                           <div key={asset.id} className="relative aspect-square bg-bg rounded-[2.5rem] border-4 border-white shadow-xl group overflow-hidden hover:scale-105 transition-all">
                              {asset.type === 'image' ? (
                                <img src={asset.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                                   <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-2 border-2 border-black/5">
                                      <Music size={32} className="text-accent-block-blue" />
                                   </div>
                                   <span className="text-[9px] font-black uppercase text-text-secondary px-4 text-center truncate w-full">{asset.name}</span>
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 gap-3 backdrop-blur-sm">
                                <span className="text-[10px] font-black text-white uppercase text-center mb-2 truncate w-full">{asset.name}</span>
                                <div className="flex flex-col w-full gap-2">
                                   <button 
                                     disabled={!selectedTheme}
                                     onClick={() => {
                                       if (!selectedTheme) return;
                                       if (asset.type === 'image') {
                                         onUpdateConfig({ 
                                           themeBgs: { ...config.themeBgs, [selectedTheme]: asset.url },
                                           mediaLibrary: config.mediaLibrary.map(a => a.id === asset.id ? { ...a, theme: selectedTheme } : a)
                                         });
                                       } else {
                                         const cur = config.themeMusics[selectedTheme] || [];
                                         if (!cur.includes(asset.url)) {
                                           onUpdateConfig({ 
                                              themeMusics: { ...config.themeMusics, [selectedTheme]: [...cur, asset.url] },
                                              mediaLibrary: config.mediaLibrary.map(a => a.id === asset.id ? { ...a, theme: selectedTheme } : a)
                                           });
                                         }
                                       }
                                       setIsSaved(true); setTimeout(() => setIsSaved(false), 1500);
                                     }}
                                     className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${selectedTheme ? 'bg-accent-block-blue text-white shadow-xl hover:scale-105' : 'bg-white/20 text-white/50 cursor-not-allowed'}`}
                                   >
                                      <Zap size={14} /> Atribuir
                                   </button>
                                   <button 
                                     onClick={() => onUpdateConfig({ mediaLibrary: config.mediaLibrary.filter(a => a.id !== asset.id) })}
                                     className="w-full py-3 bg-accent-block-red text-white rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 transition-all shadow-lg"
                                   >
                                      Remover
                                   </button>
                                </div>
                              </div>
                              
                              {asset.theme && (
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border-2 border-black/5 flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-accent-block-blue" />
                                  <span className="text-[10px] font-black uppercase text-text-primary">{asset.theme}</span>
                                </div>
                              )}
                           </div>
                         ))}
                       {config.mediaLibrary.length === 0 && (
                          <div className="col-span-full flex flex-col items-center justify-center py-32 text-text-secondary opacity-30 text-center">
                             <Library size={64} className="mb-4" />
                             <p className="text-2xl font-black uppercase">Biblioteca Vazia</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Media Selection Overlay */}
      <AnimatePresence>
        {isSelectingMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3.5rem] border-8 border-white shadow-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden"
            >
               <div className="p-8 border-b-4 border-bg flex items-center justify-between bg-white/50 backdrop-blur-xl">
                  <div>
                    <h3 className="text-3xl font-black uppercase flex items-center gap-3">
                       <Library className="text-accent-block-blue" /> Selecionar Media
                    </h3>
                    <p className="text-sm font-bold text-text-secondary">Escolhe um ficheiro da biblioteca para atribuir ao recurso.</p>
                  </div>
                  <button 
                    onClick={() => setIsSelectingMedia(null)}
                    className="w-12 h-12 bg-bg hover:bg-black/5 rounded-2xl flex items-center justify-center text-text-secondary transition-all"
                  >
                    <X size={24} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-bg/30">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {config.mediaLibrary
                      .filter(a => (isSelectingMedia?.type === 'sticker' || isSelectingMedia?.type === 'theme-bg') ? a.type === 'image' : a.type === 'audio')
                      .map(asset => (
                      <div 
                        key={asset.id}
                        onClick={() => {
                          if (isSelectingMedia?.type === 'sticker' && editingSticker) {
                            setEditingSticker({ ...editingSticker, imageUrl: asset.url });
                          } else if (isSelectingMedia?.type === 'radio') {
                             const idx = isSelectingMedia.index;
                             const newSongs = [...config.radioSongs];
                             newSongs[idx] = { ...newSongs[idx], url: asset.url };
                             onUpdateConfig({ radioSongs: newSongs });
                             alert("Música atribuída com sucesso!");
                          } else if (isSelectingMedia?.type === 'theme-bg' && selectedTheme) {
                             onUpdateConfig({ themeBgs: { ...config.themeBgs, [selectedTheme]: asset.url } });
                             alert("Papel de parede atualizado!");
                          } else if (isSelectingMedia?.type === 'theme-music' && selectedTheme) {
                             const current = config.themeMusics[selectedTheme] || [];
                             onUpdateConfig({ themeMusics: { ...config.themeMusics, [selectedTheme]: [...current, asset.url] } });
                             alert("Música adicionada ao mundo!");
                          }
                          setIsSelectingMedia(null);
                        }}
                        className="relative aspect-square bg-white rounded-[2.5rem] border-4 border-white shadow-lg overflow-hidden group cursor-pointer hover:scale-105 transition-all"
                      >
                         {asset.type === 'image' ? (
                           <img src={asset.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                         ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-accent-block-blue p-6 text-center">
                              <Music size={40} className="mb-3" />
                              <span className="text-[9px] font-black uppercase line-clamp-2">{asset.name}</span>
                           </div>
                         )}
                         <div className="absolute inset-0 bg-accent-block-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Zap size={32} className="text-white drop-shadow-lg" />
                         </div>
                      </div>
                    ))}
                    {config.mediaLibrary.filter(a => (isSelectingMedia?.type === 'sticker' || isSelectingMedia?.type === 'theme-bg') ? a.type === 'image' : a.type === 'audio').length === 0 && (
                       <div className="col-span-full py-20 text-center opacity-30">
                          <Library size={48} className="mx-auto mb-4" />
                          <p className="font-black uppercase">Nenhum asset de {(isSelectingMedia?.type === 'sticker' || isSelectingMedia?.type === 'theme-bg') ? 'Imagem' : 'Áudio'} encontrado</p>
                       </div>
                    )}
                  </div>
               </div>

               <div className="p-8 bg-white border-t-4 border-bg flex justify-end">
                  <button 
                    onClick={() => setIsSelectingMedia(null)}
                    className="px-10 py-4 bg-accent-block-blue text-white rounded-2xl font-black uppercase text-sm shadow-xl active:translate-y-1 transition-all"
                  >
                    Fechar Galeria
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function StatCard({ icon, label, value, color, trend }: { icon: any, label: string, value: string | number, color: string, trend: string }) {
  const isUp = trend.startsWith('+');
  return (
    <div className={`block-card p-8 bg-white border-b-8 shadow-2xl transition-all hover:-translate-y-2 ${
      color === 'accent-block-blue' ? 'border-blue-600' :
      color === 'accent-block-green' ? 'border-green-600' :
      color === 'accent-block-yellow' ? 'border-yellow-500' : 'border-red-600'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl text-white shadow-lg ${
          color === 'accent-block-blue' ? 'bg-accent-block-blue' :
          color === 'accent-block-green' ? 'bg-accent-block-green' :
          color === 'accent-block-yellow' ? 'bg-accent-block-yellow' : 'bg-accent-block-red'
        }`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 ${
          isUp ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {trend}
        </span>
      </div>
      <h3 className="text-4xl font-black text-text-primary block-logo leading-none mb-1">{value}</h3>
      <p className="text-xs font-black text-text-secondary uppercase tracking-widest leading-none">{label}</p>
    </div>
  );
}

function ProgressBar({ label, progress, color }: { label: string, progress: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-3 px-2">
        <span className="text-sm font-black text-text-secondary uppercase tracking-tighter">{label}</span>
        <span className="text-xl font-black text-text-primary">{progress}%</span>
      </div>
      <div className="h-6 w-full bg-bg rounded-full p-1 border-4 border-white shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color} rounded-full shadow-lg border-2 border-white/20`}
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-sm transition-all whitespace-nowrap ${
        active 
          ? 'bg-white text-text-primary shadow-xl border-b-6 border-black/10 -translate-y-1' 
          : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
      }`}
    >
      <span className={active ? 'text-accent-block-blue' : ''}>{icon}</span>
      {label}
    </button>
  );
}
