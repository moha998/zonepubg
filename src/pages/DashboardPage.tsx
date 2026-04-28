import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Shield,
  Zap,
  Star,
  Eye,
  Users,
  Calendar,
  Video,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Award,
  MessageSquare,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  LayoutDashboard,
  Package,
  Gift,
  Trophy,
  Target,
  Radio,
  Crosshair,
  Settings2,
  RefreshCw,
  Save,
  PowerOff,
  Loader2,
  Lock,
  Pencil,
  Check,
  X,
  Layout,
  Newspaper,
  Megaphone,
  Plus,
  Upload
} from 'lucide-react';
import { UserProfile, SiteStats, Clip, Giveaway, Event, Ranking } from '../types';

interface DashboardProps {
  userProfile: UserProfile | null;
  isAdmin: boolean;
  siteStats: SiteStats | null;
  allUsers: UserProfile[];
  clips: Clip[];
  giveaways: Giveaway[];
  events: Event[];
  onLogout: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  onDeleteUser?: (uid: string) => void;
  onUpdateUserRole?: (uid: string, role: 'admin' | 'user') => void;
  onNavigate: (tab: any) => void;
  isTournamentsHidden: boolean;
  onToggleTournaments: () => void;
  isCommentsEnabled: boolean;
  onToggleComments: () => void;
  competitionSettings: any[];
  onUpdateCompetitionSettings: (id: string, data: any, stopNow: boolean) => Promise<void>;
  isUpdatingSettings: boolean;
  onSyncData: (type: 'weapons' | 'attachments' | 'characters' | 'players' | 'news' | 'rankings') => Promise<void>;
  isLogoHidden: boolean;
  onToggleLogo: () => void;
  onToggleVisibility: (collectionName: string, id: string, currentStatus: boolean) => void;
  weapons: any[];
  attachments: any[];
  characters: any[];
  players: any[];
  news: any[];
  ads: any[];
}

const DashboardPage: React.FC<DashboardProps> = ({
  userProfile,
  isAdmin,
  siteStats,
  allUsers,
  clips,
  giveaways,
  events,
  onLogout,
  onUpdateProfile,
  onDeleteUser,
  onUpdateUserRole,
  onNavigate,
  isTournamentsHidden,
  onToggleTournaments,
  isCommentsEnabled,
  onToggleComments,
  competitionSettings,
  onUpdateCompetitionSettings,
  isUpdatingSettings,
  onSyncData,
  isLogoHidden,
  onToggleLogo,
  onToggleVisibility,
  weapons,
  attachments,
  characters,
  players,
  news,
  ads
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'admin-panel'>('overview');
  const [adminSubTab, setAdminSubTab] = useState<'sync' | 'content' | 'general' | 'users' | 'ads'>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);

  // Command Center State
  const [selectedSettingId, setSelectedSettingId] = useState('royal-pass');
  const [settingStartDate, setSettingStartDate] = useState('');
  const [settingEndDate, setSettingEndDate] = useState('');
  const [localIsTournamentsHidden, setLocalIsTournamentsHidden] = useState(isTournamentsHidden);
  const [localIsLogoHidden, setLocalIsLogoHidden] = useState(isLogoHidden);

  React.useEffect(() => {
    const setting = competitionSettings.find(s => s.id === selectedSettingId);
    if (setting) {
      setSettingStartDate(setting.startDate || '');
      setSettingEndDate(setting.endDate || '');
      setLocalIsTournamentsHidden(setting.isTournamentsHidden || false);
      setLocalIsLogoHidden(setting.isLogoHidden || false);
    }
  }, [selectedSettingId, competitionSettings]);

  if (!userProfile) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile({ displayName, photoURL });
    } finally {
      setIsSaving(false);
    }
  };

  const userClips = clips.filter(c => c.authorId === userProfile.uid);
  const userGiveaways = giveaways.filter(g => g.authorId === userProfile.uid);

  const stats = [
    { label: 'مقاطع الفيديو', value: userClips.length, icon: <Video size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'المسابقات', value: userGiveaways.length, icon: <Gift size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'النقاط', value: 1250, icon: <Zap size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'المرتبة', value: '#12', icon: <Trophy size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={40} />
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg">
                  <Shield size={16} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black gold-shimmer">{userProfile.displayName}</h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                {userProfile.email} • <span className="text-primary font-bold uppercase tracking-widest text-[10px]">{userProfile.role}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="px-6 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 rounded-2xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <LogOut size={18} />
              تسجيل الخروج
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard size={20} />
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Settings size={20} />
              الإعدادات
            </button>

            {isAdmin && (
              <>
                <div className="pt-6 pb-2 px-6">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">إدارة الموقع</span>
                </div>
                <button
                  onClick={() => setActiveTab('admin-panel')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'admin-panel' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Shield size={20} />
                  لوحة التحكم
                </button>
              </>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          if (stat.label === 'مقاطع الفيديو') onNavigate('home');
                          if (stat.label === 'المسابقات') onNavigate('giveaways');
                          if (stat.label === 'المرتبة') onNavigate('home');
                        }}
                        className="pro-card p-6 border-white/5 bg-bg-card/50 backdrop-blur-xl text-right hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                          {stat.icon}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black">{stat.value}</h3>
                      </button>
                    ))}
                  </div>

                  {/* Recent Activity & Site Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="pro-card p-8 border-white/5 bg-bg-card/50">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Activity size={20} className="text-primary" />
                          نشاطاتي الأخيرة
                        </h3>
                        <button 
                          onClick={() => onNavigate('home')}
                          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                        >
                          عرض الكل
                        </button>
                      </div>
                      <div className="space-y-4">
                        {userClips.length > 0 ? userClips.slice(0, 3).map((clip, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                              <Video size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold truncate">{clip.title}</h4>
                              <p className="text-[10px] text-slate-500">{new Date(clip.createdAt?.seconds * 1000).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <div className="flex items-center gap-1 text-primary">
                              <Zap size={12} />
                              <span className="text-xs font-black">{clip.votes}</span>
                            </div>
                          </div>
                        )) : (
                          <div className="py-12 text-center">
                            <Video size={40} className="mx-auto text-slate-800 mb-4" />
                            <p className="text-sm text-slate-500">لم تقم برفع أي مقاطع بعد</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {isAdmin && siteStats && (
                      <div className="pro-card p-8 border-primary/20 bg-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                              <BarChart3 size={20} className="text-primary" />
                              إحصائيات الموقع
                            </h3>
                            <span className="px-3 py-1 bg-primary text-black text-[10px] font-black rounded-full uppercase">مباشر</span>
                          </div>
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                                  <Eye size={20} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">الزيارات</p>
                                  <h4 className="text-xl font-black">{siteStats.visitors.toLocaleString()}</h4>
                                </div>
                              </div>
                              <TrendingUp size={20} className="text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-500">
                                  <Users size={20} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">المستخدمين</p>
                                  <h4 className="text-xl font-black">{allUsers.length.toLocaleString()}</h4>
                                </div>
                              </div>
                              <TrendingUp size={20} className="text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-500">
                                  <Zap size={20} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">المشاركات</p>
                                  <h4 className="text-xl font-black">{siteStats.totalParticipations.toLocaleString()}</h4>
                                </div>
                              </div>
                              <TrendingUp size={20} className="text-green-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="pro-card p-8 border-white/5 bg-bg-card/50"
                >
                  <h3 className="text-2xl font-black mb-8">إعدادات الحساب</h3>
                  <div className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">الاسم المستعار</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">رابط الصورة الشخصية</label>
                      <input 
                        type="text" 
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full btn-gold py-4 rounded-2xl font-black shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'admin-panel' && isAdmin && (
                <motion.div
                  key="admin-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Admin Sub-Navigation */}
                  <div className="flex flex-wrap items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                    {[
                      { id: 'general', label: 'التحكم العام', icon: <Settings size={16} /> },
                      { id: 'sync', label: 'المزامنة التكتيكية', icon: <Radio size={16} /> },
                      { id: 'content', label: 'إدارة المحتوى', icon: <Package size={16} /> },
                      { id: 'users', label: 'إدارة المستخدمين', icon: <Users size={16} /> },
                      { id: 'ads', label: 'إدارة الإعلانات', icon: <Megaphone size={16} /> },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setAdminSubTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          adminSubTab === tab.id 
                            ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {adminSubTab === 'sync' && (
                      <motion.div
                        key="sync"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pro-card p-8 border-primary/20 bg-bg-card/50 backdrop-blur-xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                        <h4 className="text-lg font-bold mb-8 flex items-center gap-3">
                          <Radio className="text-primary animate-pulse" size={24} /> مركز المزامنة التكتيكي
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { id: "weapons", label: "الأسلحة", icon: <Crosshair size={18} />, type: 'weapons', addType: 'weapon' },
                            { id: "attachments", label: "الملحقات", icon: <Settings2 size={18} />, type: 'attachments', addType: 'attachment' },
                            { id: "characters", label: "الشخصيات", icon: <Users size={18} />, type: 'characters', addType: 'character' },
                            { id: "players", label: "المحترفين", icon: <Trophy size={18} />, type: 'players', addType: 'player' },
                            { id: "news", label: "الأخبار", icon: <Newspaper size={18} />, type: 'news', addType: 'null' },
                            { id: "rankings", label: "المتصدرين", icon: <Star size={18} />, type: 'rankings', addType: 'null' },
                          ].map((item) => (
                            <div key={item.id} className="flex flex-col gap-2">
                              <button
                                onClick={() => onSyncData(item.type as any)}
                                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                              >
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                  {item.icon}
                                </div>
                                <span className="text-sm font-black">مزامنة {item.label}</span>
                              </button>
                              {item.addType !== 'null' && (
                                <button
                                  onClick={() => onNavigate(`add-${item.addType}`)}
                                  className="py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold hover:bg-primary hover:text-black transition-all"
                                >
                                  إضافة {item.label} جديد
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {adminSubTab === 'content' && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        <button 
                          onClick={() => onNavigate('events')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Calendar size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">الفعاليات</h4>
                          <p className="text-xs text-slate-500 mb-6">{events.length} فعالية مسجلة</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة الفعاليات</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('giveaways')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Gift size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">المسابقات</h4>
                          <p className="text-xs text-slate-500 mb-6">{giveaways.length} مسابقة نشطة</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة المسابقات</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('home')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Video size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">المقاطع</h4>
                          <p className="text-xs text-slate-500 mb-6">{clips.length} مقطع فيديو</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة المقاطع</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('news')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Newspaper size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">الأخبار</h4>
                          <p className="text-xs text-slate-500 mb-6">إدارة المقالات والأخبار</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة الأخبار</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('ads')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Megaphone size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">الإعلانات</h4>
                          <p className="text-xs text-slate-500 mb-6">إدارة المساحات الإعلانية</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة الإعلانات</div>
                        </button>
                      </motion.div>
                    )}

                    {adminSubTab === 'general' && (
                      <motion.div
                        key="general"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Visibility Controls */}
                          <div className="pro-card p-8 border-white/5 bg-bg-card/50">
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
                              <Eye className="text-primary" size={24} /> التحكم في الظهور
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Layout size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">شعار الموقع</p>
                                    <p className="text-[10px] text-slate-500">إخفاء أو إظهار شعار ZONE PUBG</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => onToggleLogo()}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isLogoHidden ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                >
                                  {isLogoHidden ? 'مخفي' : 'ظاهر'}
                                </button>
                              </div>

                              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Trophy size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">البطولات العالمية</p>
                                    <p className="text-[10px] text-slate-500">إخفاء أو إظهار قسم البطولات العالمية</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => onToggleTournaments()}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isTournamentsHidden ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                >
                                  {isTournamentsHidden ? 'مخفي' : 'ظاهر'}
                                </button>
                              </div>

                              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MessageSquare size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">نظام التعليقات</p>
                                    <p className="text-[10px] text-slate-500">تفعيل أو تعطيل التعليقات في الأخبار</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => onToggleComments()}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isCommentsEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                >
                                  {isCommentsEnabled ? 'مفعل' : 'معطل'}
                                </button>
                              </div>
                              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                      <Megaphone size={20} />
                                    </div>
                                    <div>
                                      <p className="font-bold text-sm">البنر الإعلاني للموقع</p>
                                      <p className="text-[10px] text-slate-500">بنر يظهر أعلى جميع صفحات الموقع</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const globalSetting = competitionSettings.find(s => s.id === 'global') || {};
                                      onUpdateCompetitionSettings('global', { 
                                        isBannerActive: !(globalSetting.isBannerActive || false),
                                        bannerText: globalSetting.bannerText || 'إعلان الموقع هنا',
                                        bannerLink: globalSetting.bannerLink || '#'
                                      }, false);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${competitionSettings.find(s => s.id === 'global')?.isBannerActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                  >
                                    {competitionSettings.find(s => s.id === 'global')?.isBannerActive ? 'مفعل' : 'معطل'}
                                  </button>
                                </div>
                                {competitionSettings.find(s => s.id === 'global')?.isBannerActive && (
                                  <div className="flex flex-col gap-3 mt-2 border-t border-white/5 pt-4">
                                    <input 
                                      type="text" 
                                      placeholder="نص الإعلان"
                                      value={competitionSettings.find(s => s.id === 'global')?.bannerText || ''}
                                      onChange={(e) => onUpdateCompetitionSettings('global', { bannerText: e.target.value }, false)}
                                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
                                    />
                                    <input 
                                      type="url" 
                                      placeholder="https://..."
                                      value={competitionSettings.find(s => s.id === 'global')?.bannerLink || ''}
                                      onChange={(e) => onUpdateCompetitionSettings('global', { bannerLink: e.target.value }, false)}
                                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary text-left font-mono"
                                      dir="ltr"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Event Settings */}
                          <div className="pro-card p-8 border-white/5 bg-bg-card/50">
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
                              <Calendar className="text-primary" size={24} /> إعدادات الفعاليات
                            </h4>
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">نوع الفعالية</label>
                                <select
                                  value={selectedSettingId}
                                  onChange={(e) => setSelectedSettingId(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                                >
                                  <option value="royal-pass">سحب الرويال باس</option>
                                  <option value="best-clip">لقطاتكم</option>
                                  <option value="daily-tournament">بطولات يومية</option>
                                  <option value="global">الإعدادات العامة</option>
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">تاريخ البداية</label>
                                  <input
                                    type="datetime-local"
                                    value={settingStartDate}
                                    onChange={(e) => setSettingStartDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all [color-scheme:dark]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">تاريخ النهاية</label>
                                  <input
                                    type="datetime-local"
                                    value={settingEndDate}
                                    onChange={(e) => setSettingEndDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all [color-scheme:dark]"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-4 pt-4">
                                <button
                                  onClick={() => onUpdateCompetitionSettings(selectedSettingId, {
                                    startDate: settingStartDate,
                                    endDate: settingEndDate,
                                    isLogoHidden: localIsLogoHidden,
                                    isTournamentsHidden: localIsTournamentsHidden
                                  }, false)}
                                  disabled={isUpdatingSettings}
                                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-black font-black hover:bg-white transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                  {isUpdatingSettings ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                  <span>حفظ</span>
                                </button>
                                <button
                                  onClick={() => onUpdateCompetitionSettings(selectedSettingId, {}, true)}
                                  disabled={isUpdatingSettings}
                                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                  <PowerOff size={20} />
                                  <span>إيقاف</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Global Tournaments List Management */}
                        <div className="pro-card p-8 border-white/5 bg-bg-card/50">
                          <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-bold flex items-center gap-3">
                              <Trophy className="text-primary" size={24} /> إدارة البطولات العالمية الرسمية
                            </h4>
                            <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold border border-primary/20 hover:bg-primary hover:text-black transition-all">
                              إضافة بطولة جديدة
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { id: 'pmgc', name: 'PMGC 2026', date: '2026-11-15', label: 'البطولة العالمية' },
                              { id: 'pmwi', name: 'PMWI Riyadh', date: '2026-07-20', label: 'الدعوة العالمية' },
                              { id: 'pmsl', name: 'PMSL EMEA', date: '2026-05-25', label: 'الدوري الإقليمي' },
                            ].map((t) => (
                              <div key={t.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Trophy size={20} />
                                  </div>
                                  <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><Edit size={14} /></button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-500"><Trash2 size={14} /></button>
                                  </div>
                                </div>
                                <h5 className="font-bold text-white mb-1">{t.name}</h5>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">{t.label}</p>
                                <div className="flex items-center gap-2 text-[10px] text-primary font-mono bg-primary/5 p-2 rounded-lg">
                                  <Calendar size={12} />
                                  {t.date}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {adminSubTab === 'users' && (
                      <motion.div
                        key="users"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h3 className="text-2xl font-black">إدارة المستخدمين</h3>
                          <div className="relative flex-1 max-w-md">
                            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                              type="text" 
                              placeholder="بحث عن مستخدم..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-3 outline-none focus:border-primary transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div className="pro-card border-white/5 bg-bg-card/50 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-right">
                              <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">المستخدم</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">البريد</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">الرتبة</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">آخر ظهور</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">الحالة</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">إجراءات</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {allUsers.filter(u => u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                                  <tr key={user.uid} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                                          {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-500">
                                              <User size={20} />
                                            </div>
                                          )}
                                        </div>
                                        <span className="font-bold text-sm">{user.displayName}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400'}`}>
                                        {user.role}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                                      {user.lastLoginAt ? (
                                        new Date(user.lastLoginAt?.seconds ? user.lastLoginAt.seconds * 1000 : user.lastLoginAt).toLocaleDateString('ar-EG', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })
                                      ) : 'غير متوفر'}
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.isBanned ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{user.isBanned ? 'محظور' : 'نشط'}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                          onClick={() => onUpdateUserRole?.(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                                          className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                          title="تغيير الرتبة"
                                        >
                                          <Shield size={16} />
                                        </button>
                                        <button 
                                          onClick={() => onDeleteUser?.(user.uid)}
                                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                          title="حذف المستخدم"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {adminSubTab === 'ads' && (
                      <motion.div
                        key="ads"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="pro-card p-8 border-white/5 bg-bg-card/50">
                          <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <Megaphone className="text-primary" size={24} /> إضافة أو تعديل إعلان
                          </h4>
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const form = e.target as HTMLFormElement;
                              const title = (form.elements.namedItem('adTitle') as HTMLInputElement).value;
                              const url = (form.elements.namedItem('adUrl') as HTMLInputElement).value;
                              const description = (form.elements.namedItem('adDescription') as HTMLInputElement).value;
                              
                              if (!title) return;
                              
                              try {
                                const newAd = {
                                  id: Date.now().toString(),
                                  title,
                                  description,
                                  url,
                                  icon: "Megaphone",
                                  createdAt: new Date(),
                                  authorId: "admin"
                                };
                                const { setDoc, doc } = await import('firebase/firestore');
                                const { db } = await import('../firebase');
                                await setDoc(doc(db, "ads", newAd.id), newAd);
                                alert("تمت إضافة الإعلان بنجاح!");
                                form.reset();
                              } catch(e) {
                                alert("حدث خطأ");
                              }
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-2">عنوان الإعلان</label>
                              <input required name="adTitle" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" placeholder="عنوان الخدمة أو الإعلان..." />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-2">وصف مختصر</label>
                              <input name="adDescription" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" placeholder="التفاصيل..." />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-2">رابط (اختياري)</label>
                              <input name="adUrl" type="url" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" placeholder="https://..." />
                            </div>
                            <button type="submit" className="px-6 py-3 bg-primary text-black font-bold rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
                              <Megaphone size={18} /> نشر الإعلان
                            </button>
                          </form>
                        </div>
                        <div className="pro-card p-8 border-white/5 bg-bg-card/50">
                          <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <Settings size={24} className="text-primary" /> الإعلانات الحالية
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ads.map((ad) => (
                              <div key={ad.id} className="p-4 bg-black/20 border border-white/10 rounded-xl flex items-center justify-between">
                                <div>
                                  <h5 className="font-bold text-white mb-1">{ad.title}</h5>
                                  {ad.description && <p className="text-xs text-slate-400">{ad.description}</p>}
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={async () => {
                                    if(confirm('هل أنت متأكد من الحذف؟')) {
                                      const { deleteDoc, doc } = await import('firebase/firestore');
                                      const { db } = await import('../firebase');
                                      await deleteDoc(doc(db, "ads", ad.id));
                                    }
                                  }} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
