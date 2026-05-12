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
  CheckCircle2,
  Clock,
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
  Upload,
  Share2,
  Flame,
  Heart,
  MessageCircle,
  Bookmark,
  Download
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
  const [adminSubTab, setAdminSubTab] = useState<'sync' | 'content' | 'general' | 'users' | 'ads' | 'tiktok' | 'players' | 'giveaways'>('general');
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

  const [isTiktokLoading, setIsTiktokLoading] = useState(false);
  const [tiktokSyncStatus, setTiktokSyncStatus] = useState<'disconnected' | 'connected'>('disconnected');
  const [tiktokCredentials, setTiktokCredentials] = useState({ clientKey: '', clientSecret: '' });
  const [showTiktokForm, setShowTiktokForm] = useState(false);
  const [autoSyncSettings, setAutoSyncSettings] = useState({
    news: false,
    events: false,
    results: false,
    rp: false
  });

  const [tiktokAccount, setTiktokAccount] = useState<{username: string, avatar: string, followers: string} | null>(null);
  const [syncLogs, setSyncLogs] = useState<{id: number, type: string, title: string, status: string, time: string}[]>([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [syncTarget, setSyncTarget] = useState<any>(null);
  const [showSyncResult, setShowSyncResult] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const generationSteps = [
    'تحليل محتوى الخبر واستخراج الكلمات المفتاحية...',
    'توليد نص احترافي (Script) للمقطع القصير...',
    'تنسيق الصور والمؤثرات البصرية بنظام 9:16...',
    'إضافة الموسيقى الحماسية وتأثيرات الانتقال...',
    'تصدير المقطع بجودة 4K للنشر المباشر...'
  ];

  const handleManualSync = (item: any) => {
    if (tiktokSyncStatus !== 'connected') {
      setShowTiktokForm(true);
      return;
    }
    setSyncTarget(item);
    setIsGeneratingVideo(true);
    setGenerationStep(0);
    setShowSyncResult(false);
    
    // Simulate steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= generationSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGeneratingVideo(false);
          setGeneratedVideoUrl(item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80');
          setShowSyncResult(true);
          saveLog({ 
            type: item.category || 'فيديو', 
            title: `مقطع احترافي: ${item.title}`, 
            status: 'success' 
          });
        }, 1000);
      } else {
        setGenerationStep(currentStep);
      }
    }, 1200);
  };

  // Load TikTok values from storage
  React.useEffect(() => {
    const savedStatus = localStorage.getItem('tiktok_sync_status');
    const savedAccount = localStorage.getItem('tiktok_account');
    const savedLogs = localStorage.getItem('tiktok_sync_logs');
    
    if (savedStatus === 'connected' && savedAccount) {
      setTiktokSyncStatus('connected');
      setTiktokAccount(JSON.parse(savedAccount));
    }
    
    if (savedLogs) {
      setSyncLogs(JSON.parse(savedLogs));
    } else {
      setSyncLogs([
        { id: 1, type: 'الأخبار', title: 'تسريبات الموسم القادم', status: 'success', time: 'منذ ساعتين' },
        { id: 2, type: 'الفعاليات', title: 'فعالية رقصات التعاون', status: 'success', time: 'منذ 5 ساعات' },
        { id: 3, type: 'النتائج', title: 'بطولة المحترفين - اليوم الأول', status: 'failure', time: 'أمس' },
      ]);
    }

    // Load auto sync settings
    const settings = { ...autoSyncSettings };
    Object.keys(settings).forEach(key => {
      const val = localStorage.getItem(`tiktok_sync_${key}`);
      if (val !== null) {
        settings[key as keyof typeof autoSyncSettings] = val === 'true';
      }
    });
    setAutoSyncSettings(settings);
  }, []);

  const saveLog = (log: {type: string, title: string, status: string}) => {
    const newLog = { id: Date.now(), ...log, time: 'الآن' };
    setSyncLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 10);
      localStorage.setItem('tiktok_sync_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTiktokLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tiktokCredentials.clientKey || !tiktokCredentials.clientSecret) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    setIsTiktokLoading(true);
    // Simulate API call to TikTok OAuth
    setTimeout(() => {
      setIsTiktokLoading(false);
      setTiktokSyncStatus('connected');
      setShowTiktokForm(false);
      const mockAccount = {
        username: 'ZonePubg_Official',
        avatar: 'https://images.unsplash.com/photo-1611605698335-8b1c4d797352?w=100&h=100&fit=crop',
        followers: '125.4K'
      };
      setTiktokAccount(mockAccount);
      localStorage.setItem('tiktok_sync_status', 'connected');
      localStorage.setItem('tiktok_account', JSON.stringify(mockAccount));
      saveLog({ type: 'نظام', title: 'تم ربط الحساب بنجاح', status: 'success' });
      alert('تم ربط حساب تيك توك بنجاح! يمكنك الآن تفعيل خيارات المزامنة التلقائية.');
    }, 2500);
  };

  const toggleSyncSetting = (key: keyof typeof autoSyncSettings) => {
    if (tiktokSyncStatus !== 'connected') {
      alert('يرجى ربط حساب تيك توك أولاً لتتمكن من تفعيل المزامنة التلقائية.');
      return;
    }
    const newValue = !autoSyncSettings[key];
    setAutoSyncSettings(prev => ({ ...prev, [key]: newValue }));
    localStorage.setItem(`tiktok_sync_${key}`, String(newValue));
  };

  const [participants, setParticipants] = useState([
    { user: 'PUBG_MASTER', mission: 'مشاركة الموقع', status: 'pending', date: 'منذ 5 دقائق' },
    { user: 'SULTAN_ZONE', mission: 'تسجيل دخول يومي', status: 'confirmed', date: 'منذ ساعة' },
    { user: 'ERANGEL_KING', mission: 'تقييم لقطة', status: 'pending', date: 'منذ ساعتين' },
    { user: 'LEGEND_99', mission: 'مشاركة الموقع', status: 'confirmed', date: 'منذ 4 ساعات' },
  ]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<{user: string, mission: string} | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<string | null>(null);

  const startDrawingProcess = () => {
    const confirmed = participants.filter(p => p.status === 'confirmed');
    if (confirmed.length === 0) {
      alert('لا يوجد مشاركين مؤكدين لإجراء السحب!');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    
    // Cycle animation
    let count = 0;
    const maxCycles = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * confirmed.length);
      setCurrentCandidate(confirmed[randomIndex].user);
      count++;

      if (count >= maxCycles) {
        clearInterval(interval);
        setTimeout(() => {
          const finalWinner = confirmed[Math.floor(Math.random() * confirmed.length)];
          setWinner(finalWinner);
          saveLog({ type: 'سحب', title: `فوز اللاعب ${finalWinner.user} بالسحب التلقائي`, status: 'success' });
        }, 500);
      }
    }, 150);
  };

  const handleConfirmParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants[index].status = 'confirmed';
    setParticipants(newParticipants);
    saveLog({ type: 'سحب', title: `تأكيد مشاركة ${newParticipants[index].user}`, status: 'success' });
  };

  const handleRemoveParticipant = (index: number) => {
    const user = participants[index].user;
    setParticipants(prev => prev.filter((_, i) => i !== index));
    saveLog({ type: 'سحب', title: `استبعاد ${user}`, status: 'failure' });
  };

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
                      ...(isAdmin ? [{ id: 'tiktok', label: 'مزامنة تيك توك', icon: (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.51-1.51-1.92-2.52-.02 2.41.01 4.82-.01 7.23-.01 1.76-.32 3.53-1.07 5.12-.66 1.41-1.74 2.65-3.13 3.39-1.5.8-3.23 1.15-4.92 1.01-1.89-.15-3.75-.95-5.12-2.27-1.43-1.38-2.31-3.32-2.45-5.3-.17-2.38.65-4.82 2.27-6.57 1.54-1.66 3.82-2.61 6.08-2.53.01 1.43.01 2.87.01 4.31-.83-.1-1.69.07-2.42.5-.66.39-1.16 1.05-1.33 1.8-.19 1.13.23 2.37 1.1 3.12.82.72 2.01.95 3.04.62 1.14-.37 1.95-1.4 2.1-2.58.07-1.39.04-2.79.05-4.18 0-4.07-.01-8.13.01-12.2z"/>
                        </svg>
                      ) }] : []),
                      { id: 'giveaways', label: 'إدارة السحوبات', icon: <Gift size={16} /> },
                      { id: 'players', label: 'أدوات اللاعبين', icon: <Target size={16} /> },
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

                  {/* Video Generation Result Modal */}
                  <AnimatePresence>
                    {showSyncResult && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                          <div className="relative aspect-[9/16] bg-black">
                            <img src={generatedVideoUrl || ''} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 p-8 flex flex-col justify-end">
                              <div className="space-y-4 text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full">
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  <span className="text-xs font-bold text-primary">تم النشر بنجاح</span>
                                </div>
                                <h3 className="text-2xl font-black leading-tight text-white">{syncTarget?.title}</h3>
                                <p className="text-sm text-slate-400">تمت المزامنة مع حساب @{tiktokAccount?.username}</p>
                                
                                <div className="flex gap-3 pt-4">
                                  <button 
                                    onClick={() => window.open('https://tiktok.com', '_blank')}
                                    className="flex-1 py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                                  >
                                    <Share2 size={20} />
                                    فتح في تيك توك
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = generatedVideoUrl || '';
                                      link.download = `PUBG_ZONE_${Date.now()}.jpg`;
                                      link.click();
                                    }}
                                    className="p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors"
                                  >
                                    <Download size={20} />
                                  </button>
                                </div>
                                <button 
                                  onClick={() => setShowSyncResult(false)}
                                  className="w-full py-3 text-slate-400 text-sm font-bold hover:text-white transition-colors"
                                >
                                  إغلاق المعاينة
                                </button>
                              </div>
                            </div>
                            
                            {/* Static overlay icons to feel like TikTok */}
                            <div className="absolute left-4 bottom-32 flex flex-col items-center gap-6 text-white/90">
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                  <Heart size={20} />
                                </div>
                                <span className="text-[10px] font-bold">12.5K</span>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                  <MessageCircle size={20} />
                                </div>
                                <span className="text-[10px] font-bold">458</span>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                  <Bookmark size={20} />
                                </div>
                                <span className="text-[10px] font-bold">1.2K</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Video Generation Simulation Overlay */}
                  <AnimatePresence>
                    {isGeneratingVideo && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                      >
                        <div className="max-w-md w-full text-center space-y-8">
                          {/* 9:16 Preview Mockup */}
                          <div className="relative mx-auto w-48 h-80 rounded-[2.5rem] border-[6px] border-white/10 overflow-hidden bg-zinc-900 shadow-2xl shadow-primary/20">
                            <img src={syncTarget?.image} alt="" className="w-full h-full object-cover opacity-60 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-4 flex flex-col justify-end text-right">
                              <div className="space-y-2">
                                <div className="h-1.5 w-12 bg-primary rounded-full" />
                                <h4 className="text-[10px] font-black leading-tight text-white">{syncTarget?.title}</h4>
                                <div className="flex items-center gap-1">
                                  <div className="w-4 h-4 rounded-full bg-white/10" />
                                  <div className="h-1 w-16 bg-white/20 rounded-full" />
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <RefreshCw className="text-primary animate-spin" size={32} />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-xl font-black tracking-tight">جاري إنشاء مقطع احترافي...</h3>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                              <p className="text-sm font-bold text-primary animate-bounce">{generationSteps[generationStep]}</p>
                            </div>
                            
                            {/* Process Indicator */}
                            <div className="flex justify-center gap-1">
                              {generationSteps.map((_, i) => (
                                <div 
                                  key={i}
                                  className={`h-1 rounded-full transition-all duration-500 ${
                                    i <= generationStep ? 'w-8 bg-primary shadow-lg shadow-primary/40' : 'w-4 bg-white/10'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">يتم الآن تطبيق خوارزميات الذكاء الاصطناعي لتحويل الخبر لمحتوى تيك توك</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Giveaway Drawing Overlay */}
                  <AnimatePresence>
                    {isDrawing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-hidden"
                      >
                        {/* Background Particles/Effects */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                        </div>

                        <div className="max-w-xl w-full text-center relative z-10">
                          {!winner ? (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="space-y-12"
                            >
                              <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary mb-8 animate-spin-slow">
                                  <Trophy size={64} />
                                </div>
                                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                              </div>

                              <div className="space-y-4">
                                <h2 className="text-4xl font-black italic gold-shimmer tracking-tighter uppercase">Analyzing Participants</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Selecting authentic winner from database</p>
                              </div>

                              <div className="flex flex-col items-center gap-6">
                                <motion.div 
                                  key={currentCandidate}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  className="px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] min-w-[320px]"
                                >
                                  <span className="text-3xl font-black text-white font-mono">{currentCandidate}</span>
                                </motion.div>
                                
                                <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-primary"
                                    animate={{ width: ['0%', '100%'] }}
                                    transition={{ duration: 3, ease: "linear" }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="space-y-10"
                            >
                              <div className="relative">
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', damping: 12 }}
                                  className="w-48 h-48 rounded-[3rem] bg-primary flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_80px_rgba(255,184,0,0.4)]"
                                >
                                  <Award size={96} />
                                </motion.div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 text-6xl">🎉</div>
                              </div>

                              <div className="space-y-2">
                                <h2 className="text-5xl font-black tracking-tighter uppercase gold-shimmer">MATCH FOUND!</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Target selection complete</p>
                              </div>

                              <div className="p-10 rounded-[3rem] bg-white/5 border border-primary/30 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Official Winner</p>
                                  <h3 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">{winner.user}</h3>
                                  <div className="flex items-center justify-center gap-2 text-slate-500 font-bold">
                                    <Shield size={16} />
                                    <span>Verified Participation ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                                  </div>
                                </div>
                              </div>

                              <button 
                                onClick={() => setIsDrawing(false)}
                                className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-primary transition-all active:scale-95 shadow-2xl"
                              >
                                إغلاق والعودة للوحة التحكم
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {adminSubTab === 'tiktok' && (
                      <motion.div
                        key="tiktok"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="pro-card p-1 bg-gradient-to-br from-[#ff0050]/20 via-transparent to-[#00f2ea]/20 border-white/5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-3xl -z-10" />
                          <div className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 space-y-6">
                              <div className="flex items-center gap-4">
                                <div className="p-4 rounded-3xl bg-black text-white border border-white/10 shadow-2xl shadow-[#ff0050]/20 group-hover:scale-110 transition-transform">
                                   <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                     <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.55-1.51-1.92-2.52-.02 2.41.01 4.82-.01 7.23-.01 1.76-.32 3.53-1.07 5.12-.66 1.41-1.74 2.65-3.13 3.39-1.5.8-3.23 1.15-4.92 1.01-1.89-.15-3.75-.95-5.12-2.27-1.43-1.38-2.31-3.32-2.45-5.3-.17-2.38.65-4.82 2.27-6.57 1.54-1.66 3.82-2.61 6.08-2.53.01 1.43.01 2.87.01 4.31-.83-.1-1.69.07-2.42.5-.66.39-1.16 1.05-1.33 1.8-.19 1.13.23 2.37 1.1 3.12.82.72 2.01.95 3.04.62 1.14-.37 1.95-1.4 2.1-2.58.07-1.39.04-2.79.05-4.18 0-4.07-.01-8.13.01-12.2z"/>
                                   </svg>
                                </div>
                                <div>
                                  <h4 className="text-3xl font-black italic tracking-tighter uppercase">TikTok Command Center</h4>
                                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${tiktokSyncStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                    {tiktokSyncStatus === 'connected' ? 'المزامنة مفعلة وجاهزة' : 'بانتظار ربط الحساب'}
                                  </p>
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed max-w-xl font-medium">
                                قم بإدارة التكامل السلس بين أخبار موقعك ومحتوى تيك توك. يمكنك أتمتة النشر، وإدارة القوالب التفاعلية، ومتابعة نمو جمهورك من مكان واحد.
                              </p>
                              
                              <div className="flex flex-wrap gap-4">
                                {tiktokSyncStatus === 'disconnected' && !showTiktokForm ? (
                                  <button 
                                    onClick={() => setShowTiktokForm(true)}
                                    className="group relative px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden shadow-2xl shadow-white/10"
                                  >
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <Share2 size={20} className="relative z-10" />
                                    <span className="relative z-10">إعداد ربط تيك توك</span>
                                  </button>
                                ) : tiktokSyncStatus === 'connected' ? (
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                                      <div className="w-10 h-10 rounded-full border-2 border-primary/50 p-0.5">
                                        <img src={tiktokAccount?.avatar} alt={tiktokAccount?.username} className="w-full h-full rounded-full object-cover" />
                                      </div>
                                      <div>
                                        <p className="text-xs font-black text-white">@{tiktokAccount?.username}</p>
                                        <p className="text-[10px] font-bold text-primary">{tiktokAccount?.followers} متابع</p>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        setTiktokSyncStatus('disconnected');
                                        setTiktokAccount(null);
                                        localStorage.removeItem('tiktok_sync_status');
                                        localStorage.removeItem('tiktok_account');
                                        saveLog({ type: 'نظام', title: 'تم إلغاء ربط الحساب', status: 'failure' });
                                      }}
                                      className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                      title="إلغاء الربط"
                                    >
                                      <PowerOff size={20} />
                                    </button>
                                  </div>
                                ) : (
                                  <form onSubmit={handleTiktokLink} className="space-y-4 w-full max-w-md bg-black/60 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                      <h5 className="font-black text-sm uppercase tracking-widest text-[#ff0050]">إدخال بيانات المطور</h5>
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 cursor-pointer hover:bg-white/10" onClick={() => setShowTiktokForm(false)}>
                                        <X size={16} />
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Client Key</label>
                                        <input 
                                          type="text"
                                          required
                                          placeholder="Enter TikTok Client Key"
                                          value={tiktokCredentials.clientKey}
                                          onChange={(e) => setTiktokCredentials(prev => ({ ...prev, clientKey: e.target.value }))}
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:border-[#ff0050] focus:ring-1 focus:ring-[#ff0050]/50 outline-none transition-all placeholder:text-white/20"
                                        />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Client Secret</label>
                                        <input 
                                          type="password"
                                          required
                                          placeholder="Enter TikTok Client Secret"
                                          value={tiktokCredentials.clientSecret}
                                          onChange={(e) => setTiktokCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:border-[#00f2ea] focus:ring-1 focus:ring-[#00f2ea]/50 outline-none transition-all placeholder:text-white/20"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                      <button 
                                        type="submit"
                                        disabled={isTiktokLoading}
                                        className="flex-1 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-primary active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                                      >
                                        {isTiktokLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                        تأكيد المزامنة
                                      </button>
                                    </div>
                                  </form>
                                )}
                              </div>
                            </div>

                            <div className="w-full md:w-96 space-y-6">
                              <div className="p-8 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl space-y-6">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">إدارة النشر الذكي</span>
                                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">AI AUTO-POST</div>
                                </div>
                                
                                <div className="space-y-4">
                                  {[
                                    { id: 'news', label: 'نشر الأخبار اليومية', icon: <Newspaper size={16} /> },
                                    { id: 'events', label: 'الفعاليات والتسريبات', icon: <Flame size={16} /> },
                                    { id: 'results', label: 'نتائج بطولات PUBG', icon: <Trophy size={16} /> },
                                    { id: 'rp', label: 'أخبار الرويال باس', icon: <Zap size={16} /> },
                                  ].map((item) => (
                                    <div 
                                      key={item.id} 
                                      onClick={() => toggleSyncSetting(item.id as any)}
                                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-colors ${autoSyncSettings[item.id as keyof typeof autoSyncSettings] ? 'bg-primary text-black' : 'bg-white/5 text-slate-400'}`}>
                                          {item.icon}
                                        </div>
                                        <span className="text-xs font-bold">{item.label}</span>
                                      </div>
                                      <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${autoSyncSettings[item.id as keyof typeof autoSyncSettings] ? 'bg-primary' : 'bg-white/10'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${autoSyncSettings[item.id as keyof typeof autoSyncSettings] ? 'right-1 bg-black' : 'left-1 bg-slate-500'}`} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Manual Sync Tool */}
                        <div className="pro-card p-0 border-white/5 bg-[#ff0050]/5 relative overflow-hidden">
                          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ff0050]/10 blur-3xl rounded-full" />
                          <div className="p-8 border-b border-white/5 relative z-10 flex items-center justify-between">
                            <div>
                              <h5 className="font-black text-lg tracking-tight">أداة النشر اليدوي المتقدمة</h5>
                              <p className="text-xs text-slate-400 font-medium">اختر محتوى معيناً لنشره فوراً على حسابك المرتبط.</p>
                            </div>
                            <button 
                              onClick={() => {
                                if (tiktokSyncStatus !== 'connected') {
                                  alert('يرجى ربط حساب تيك توك أولاً');
                                  return;
                                }
                                alert('جاري محاكاة مزامنة شاملة لجميع المحتويات الحالية مع تيك توك...');
                                saveLog({ type: 'مزامنة شاملة', title: 'تحديث كامل للمحتوى', status: 'success' });
                              }}
                              className="px-6 py-3 bg-white text-black text-xs font-black rounded-xl hover:bg-primary transition-all flex items-center gap-2 shadow-xl shadow-white/5"
                            >
                              <RefreshCw size={14} className="animate-spin-slow" />
                              مزامنة شاملة للموقع
                            </button>
                          </div>

                          <div className="p-8 relative z-10 space-y-6">
                            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl w-fit">
                              {['أخبار', 'تسريبات', 'فعاليات'].map((tab) => (
                                <button
                                  key={tab}
                                  className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(news.length > 0 ? news.slice(0, 4) : [
                                { title: 'تسريبات سكنات الموسم القادم', category: 'تسريبات', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop' },
                                { title: 'تحديث خريطة إرانغل الجديد', category: 'أخبار', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop' },
                                { title: 'فعالية رقصات الكوميكس', category: 'فعاليات', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop' },
                                { title: 'نتائج بطولة المحترفين العربية', category: 'أخبار', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&h=100&fit=crop' }
                              ]).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-white/5 hover:border-[#ff0050]/30 transition-all group">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden border border-white/10 group-hover:border-[#ff0050]/50 transition-all">
                                      <img src={(item as any).image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <div className="max-w-[200px]">
                                      <p className="text-[9px] font-black text-[#ff0050] uppercase tracking-widest mb-0.5">{(item as any).category || 'تحديث'}</p>
                                      <h6 className="text-[11px] font-bold truncate group-hover:text-white transition-colors">{item.title}</h6>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleManualSync(item)}
                                    className="p-3 bg-white/5 hover:bg-[#ff0050] text-[#ff0050] hover:text-white rounded-xl transition-all border border-white/10 group-hover:shadow-lg group-hover:shadow-[#ff0050]/20"
                                    title="تحويل لمقطع فيديو ونشره"
                                  >
                                    <Video size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity Logs */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          <div className="lg:col-span-8 space-y-4">
                            <h5 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <Activity size={18} className="text-primary" />
                              سجل النشاطات والمزامنة
                            </h5>
                            <div className="pro-card bg-bg-card/30 border-white/5 overflow-hidden">
                              <table className="w-full text-right">
                                <thead>
                                  <tr className="border-b border-white/5 bg-white/2">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">النوع</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">العنوان</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">الوقت</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-center">الحالة</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {syncLogs.length > 0 ? syncLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/2 transition-colors">
                                      <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-slate-400">{log.type}</span>
                                      </td>
                                      <td className="px-6 py-4 font-bold text-xs">{log.title}</td>
                                      <td className="px-6 py-4 text-[10px] text-slate-500">{log.time}</td>
                                      <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                          {log.status === 'success' ? (
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                              <CheckCircle size={14} />
                                            </div>
                                          ) : (
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                                              <XCircle size={14} />
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )) : (
                                    <tr>
                                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-xs font-bold">لا توجد نشاطات مسجلة بعد</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="lg:col-span-4 space-y-6">
                            <h5 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <Target size={18} className="text-primary" />
                              أدوات متقدمة
                            </h5>
                            <div className="space-y-4">
                               <button className="w-full pro-card p-6 border-white/5 hover:border-primary/30 transition-all text-right group">
                                  <Video className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                  <h6 className="font-bold text-sm mb-1">إدارة قوالب الفيديو</h6>
                                  <p className="text-[10px] text-slate-500">تخصيص القوالب التلقائية للأخبار المسربة.</p>
                               </button>
                               <button className="w-full pro-card p-6 border-white/5 hover:border-pink-500/30 transition-all text-right group">
                                  <Radio className="text-pink-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                  <h6 className="font-bold text-sm mb-1">ربط البث المباشر</h6>
                                  <p className="text-[10px] text-slate-500">عرض بث تيك توك في الصفحة الرئيسية.</p>
                               </button>
                               <button className="w-full pro-card p-6 border-white/5 hover:border-green-500/30 transition-all text-right group">
                                  <TrendingUp className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                  <h6 className="font-bold text-sm mb-1">التقرير التحليلي</h6>
                                  <p className="text-[10px] text-slate-500">إحصائيات المتابعة والمشاهدات اليومية.</p>
                               </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

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

                    {adminSubTab === 'giveaways' && (
                      <motion.div
                        key="giveaways"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="pro-card p-8 border-primary/20 bg-primary/5 relative overflow-hidden">
                          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
                          <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">السحب التلقائي الذكي</h3>
                                <p className="text-slate-400 text-sm font-bold">نظام اختيار الفائزين العشوائي والموثق</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => {
                                    setParticipants([
                                      { user: 'SULTAN_ZONE', mission: 'تسجيل دخول يومي', status: 'confirmed', date: 'الآن' },
                                      { user: 'LEGEND_99', mission: 'مشاركة الموقع', status: 'confirmed', date: 'الآن' },
                                      { user: 'ERANGEL_KING', mission: 'تقييم لقطات', status: 'confirmed', date: 'الآن' },
                                      { user: 'PUBG_PRO_AR', mission: 'مهمة أسبوعية', status: 'confirmed', date: 'الآن' },
                                      { user: 'GHOST_PLAYER', mission: 'تحدي يومي', status: 'confirmed', date: 'الآن' },
                                      { user: 'M4_MASTER', mission: 'قنص 10 أعداء', status: 'confirmed', date: 'الآن' },
                                      { user: 'VIKTOR_PRO', mission: 'تحدي الشخصيات', status: 'confirmed', date: 'الآن' },
                                    ]);
                                    alert('تم تجهيز 7 متسابقين مؤكدين للتجربة!');
                                  }}
                                  className="px-6 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-2"
                                >
                                  <RefreshCw size={20} />
                                  تجهيز بيانات التجربة
                                </button>
                                <button 
                                  onClick={startDrawingProcess}
                                  className="px-10 py-5 bg-primary text-black font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-3 animate-pulse"
                                >
                                  <Gift size={24} />
                                  تشغيل السحب فورا
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="pro-card p-6 border-white/5 bg-bg-card/50">
                            <h5 className="font-bold text-sm mb-4">إحصائيات المشاركة</h5>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">إجمالي المشاركين</span>
                                <span className="font-black">1,248</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">المشاركين النشطين اليوم</span>
                                <span className="font-black text-primary">+84</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="w-[65%] h-full bg-primary" />
                              </div>
                            </div>
                          </div>

                          <div className="pro-card p-6 border-white/5 bg-bg-card/50">
                            <h5 className="font-bold text-sm mb-4">السحوبات النشطة</h5>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Gift size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">قيد الانتظار</p>
                                <p className="text-xs font-black">رويال باس + 660 UC</p>
                              </div>
                            </div>
                          </div>

                          <div className="pro-card p-6 border-white/5 bg-bg-card/50">
                            <h5 className="font-bold text-sm mb-4">آخر الفائزين</h5>
                            <div className="flex -space-x-2 space-x-reverse">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-dark bg-white/10 overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="" />
                                </div>
                              ))}
                              <div className="w-8 h-8 rounded-full border-2 border-bg-dark bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
                            </div>
                          </div>
                        </div>

                        {/* Participants Table */}
                        <div className="pro-card overflow-hidden border-white/5 bg-bg-card/30">
                          <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div>
                              <h5 className="font-black text-lg">طلبات المشاركة الجديدة</h5>
                              <p className="text-xs text-slate-400">راجع وأكد مشاركة اللاعبين في السحوبات النشطة</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black transition-all">تصدير القائمة</button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-right text-xs">
                              <thead className="bg-white/5 text-slate-400">
                                <tr>
                                  <th className="px-6 py-4 font-black uppercase tracking-widest">اللاعب</th>
                                  <th className="px-6 py-4 font-black uppercase tracking-widest">المهمة</th>
                                  <th className="px-6 py-4 font-black uppercase tracking-widest">الحالة</th>
                                  <th className="px-6 py-4 font-black uppercase tracking-widest">التاريخ</th>
                                  <th className="px-6 py-4 font-black uppercase tracking-widest">الإجراءات</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {participants.map((row, i) => (
                                  <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{row.user[0]}</div>
                                        <span className="font-bold">{row.user}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{row.mission}</td>
                                    <td className="px-6 py-4">
                                      {row.status === 'confirmed' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
                                          <CheckCircle2 size={14} /> مؤكد
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black">
                                          <Clock size={14} /> قيد المراجعة
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{row.date}</td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        {row.status === 'pending' && (
                                          <button 
                                            onClick={() => handleConfirmParticipant(i)}
                                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition-all"
                                            title="تأكيد المشاركة"
                                          >
                                            <Check size={16} />
                                          </button>
                                        )}
                                        <button 
                                          onClick={() => handleRemoveParticipant(i)}
                                          className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all"
                                          title="استبعاد"
                                        >
                                          <X size={16} />
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

                    {adminSubTab === 'players' && (
                      <motion.div
                        key="players"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        <button 
                          onClick={() => onNavigate('home')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Video size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">اللقطات</h4>
                          <p className="text-xs text-slate-500 mb-6">{clips.length} مقطع مسجل</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة اللقطات</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('sensitivity')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Target size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">الحساسية</h4>
                          <p className="text-xs text-slate-500 mb-6">إعدادات الأجهزة واللاعبين</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة الحساسية</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('calculator')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <BarChart3 size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">حاسبة التقييم</h4>
                          <p className="text-xs text-slate-500 mb-6">تخصيص معادلة النقاط</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة المعادلة</div>
                        </button>
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
                          onClick={() => onNavigate('characters?tab=weapons')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Crosshair size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">الأسلحة</h4>
                          <p className="text-xs text-slate-500 mb-6">{weapons.length} سلاح متاح</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة الأسلحة</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('characters?tab=attachments')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Settings2 size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">القطع والمرفقات</h4>
                          <p className="text-xs text-slate-500 mb-6">{attachments.length} قطعة مسجلة</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة القطع</div>
                        </button>

                        <button 
                          onClick={() => onNavigate('characters')}
                          className="pro-card p-8 border-white/5 bg-bg-card/50 flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <Users size={32} />
                          </div>
                          <h4 className="text-xl font-black mb-2">الشخصيات</h4>
                          <p className="text-xs text-slate-500 mb-6">{characters.length} شخصية مضافة</p>
                          <div className="w-full py-3 bg-white/5 group-hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">إدارة الشخصيات</div>
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
                            <Settings size={22} className="text-primary" /> إعدادات عرض الشريط المباشر
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">سرعة الشريط (عدد الثواني للدورة)</label>
                              <div className="flex items-center gap-4">
                                <input 
                                  type="range" 
                                  min="10" 
                                  max="120" 
                                  step="5"
                                  value={competitionSettings.find(s => s.id === 'global')?.adsTickerSpeed || 45}
                                  onChange={(e) => onUpdateCompetitionSettings('global', { adsTickerSpeed: parseInt(e.target.value) }, false)}
                                  className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none accent-primary"
                                />
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg font-black text-xs">
                                  {competitionSettings.find(s => s.id === 'global')?.adsTickerSpeed || 45}s
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold tracking-tight">كلما قل العدد زادت السرعة.</p>
                            </div>

                            <div className="space-y-4">
                              <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">نمط ظهور الانتقال</label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: 'marquee', label: 'شريط متحرك (Marquee)', icon: <RefreshCw size={14} /> },
                                  { id: 'fade', label: 'تلاشي تدريجي (Fade)', icon: <Zap size={14} /> },
                                  { id: 'slide', label: 'انزلاق جانبي (Slide)', icon: <ChevronRight size={14} /> },
                                  { id: 'bounce', label: 'ظروف حركية (Bounce)', icon: <Activity size={14} /> }
                                ].map((style) => (
                                  <button
                                    key={style.id}
                                    onClick={() => onUpdateCompetitionSettings('global', { adsTickerStyle: style.id }, false)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black transition-all border ${
                                      (competitionSettings.find(s => s.id === 'global')?.adsTickerStyle || 'marquee') === style.id
                                        ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                                        : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                                    }`}
                                  >
                                    {style.icon}
                                    {style.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

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
                                      try {
                                        const { deleteDoc, doc } = await import('firebase/firestore');
                                        const { db } = await import('../firebase');
                                        await deleteDoc(doc(db, "ads", ad.id));
                                        alert("تم الحذف بنجاح");
                                      } catch (err) {
                                        alert("فشل الحذف");
                                      }
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
