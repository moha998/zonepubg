import React, {
  useState,
  useEffect,
  Component,
  ErrorInfo,
  ReactNode,
  useRef,
} from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

function CircularScore({ value, label, icon: Icon, isGolden }: { value: number, label: string, icon: any, isGolden?: boolean }) {
  return (
    <div className={`p-6 bg-black/40 border ${isGolden ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-white/10'} rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
      {isGolden && <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />}
      <div className="relative w-28 h-28 mb-4">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            className={isGolden ? "text-yellow-400" : "text-primary"}
            initial={{ strokeDasharray: "0 251.2" }}
            whileInView={{ strokeDasharray: `${(value / 100) * 251.2} 251.2` }}
            transition={{ duration: 2, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${isGolden ? "text-yellow-400" : "text-white"}`}>
            <AnimatedNumber value={value} />%
          </span>
        </div>
      </div>
      <div className={`flex items-center gap-2 ${isGolden ? "text-yellow-500" : "text-slate-400"}`}>
        <Icon size={16} />
        <span className="text-sm font-bold">{label}</span>
      </div>
    </div>
  );
}

import {
  Search,
  ChevronDown,
  Smartphone,
  Tablet,
  Zap,
  Shield,
  Crosshair,
  Eye,
  EyeOff,
  Settings2,
  Newspaper,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
  Copy,
  Users,
  Trophy,
  Megaphone,
  Tag,
  Gift,
  Star,
  Plus,
  Lock,
  User as UserIcon,
  Bell,
  BarChart3,
  Timer,
  CheckCircle2,
  Vote,
  Video,
  Upload,
  Calendar,
  Play,
  Trash2,
  UserMinus,
  LogIn,
  LogOut,
  Pencil,
  Sparkles,
  MessageSquare,
  MessageSquareOff,
  Send,
  X,
  Check,
  ArrowLeftRight,
  Flame,
  Wrench,
  Activity,
  Target,
  Sword,
  LayoutDashboard,
  Sun,
  Moon,
  Scale,
  Info,
  Settings,
  Save,
  PowerOff,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Menu as MenuIcon,
  Home,
  Compass,
  TrendingUp,
  Package,
  Radio,
  Globe,
  Monitor,
  Bot,
  Lightbulb,
  Share2,
  Youtube,
  Twitter,
  Instagram,
  Facebook
} from "lucide-react";
import {
  db,
  auth,
  loginWithGoogle,
  handleGoogleRedirectResult,
  logout,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  handleFirestoreError,
  OperationType,
  User,
  serverTimestamp,
  increment,
  checkFirestoreConnection,
} from "./firebase";
import { useGlobalContext, GlobalProvider } from "./context/GlobalContext";
import Markdown from "react-markdown";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

const Chatbot = lazy(() => import("./components/Chatbot"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ConquerorCalculator = lazy(() => import("./components/ConquerorCalculator"));
import NewsPage from "./pages/NewsPage";
import CharactersPage from "./pages/CharactersPage";
import ComparePage from "./pages/ComparePage";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import LoadoutsPage from "./pages/LoadoutsPage";
import SensitivityPage from "./pages/SensitivityPage";
import RatePage from "./pages/RatePage";
import GameEventsPage from "./pages/GameEventsPage";
import GiveawaysPage from "./pages/GiveawaysPage";
import AdsPage from "./pages/AdsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

import OptimizedImage from "./components/OptimizedImage";
import AuthModal from "./components/AuthModal";
import ContentEditorModal from "./components/ContentEditorModal";
import * as geminiService from "./services/geminiService";
import {
  Weapon,
  Device,
  Attachment,
  SensitivitySettings,
  NewsItem,
  Ranking,
  Event,
  Giveaway,
  UserProfile,
  Ad,
  NewsComment,
  GiveawayEntry,
  GiveawayWinner,
  Clip,
  SensitivityRating,
  WeaponRating,
  CompetitionSettings,
  Character,
  Poll,
  SiteStats,
} from "./types";
import {
  WEAPONS,
  DEVICES,
  PRO_PLAYERS,
  ATTACHMENTS,
  CHARACTERS,
  POLLS,
  getWeaponSmartAnalysis,
} from "./constants";

const ADMIN_EMAIL = "eng.moha990@gmail.com";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 text-center">
          <div className="pro-card p-8 max-w-md">
            <Shield className="text-red-500 mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-4 text-text-main">
              عذراً، حدث خطأ ما
            </h1>
            <p className="text-text-muted mb-6">
              واجه التطبيق خطأ غير متوقع. يرجى محاولة إعادة تحميل الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-black px-6 py-3 rounded-xl font-bold"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Reusable Image Component with Optimization
const GameImage = ({
  src,
  alt,
  className,
  aspectRatio,
  objectFit = "contain",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      aspectRatio={aspectRatio}
      objectFit={objectFit}
    />
  );
};

const PageWrapper = ({ children, title, subtitle, hideHeader }: { children: ReactNode, title?: string, subtitle?: string, hideHeader?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      {!hideHeader && (title || subtitle) && (
        <div className="space-y-6 mb-12 text-right">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black text-primary uppercase tracking-widest shadow-inner mb-4"
          >
            <Sparkles size={14} className="animate-pulse" />
            تصفح المحتوى
          </motion.div>
          {title && (
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-black font-display tracking-tight text-white leading-tight"
            >
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 font-medium text-lg md:text-xl border-r-2 border-primary/40 pr-6 inline-block max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
type ComparisonAdvice = {
  closeRange: string;
  longRange: string;
  tabletAdvice: string;
  mobileAdvice: string;
  source: string;
  updatedAt: string;
  proTip?: string;
};

function getWeaponValue(
  weapon: any,
  keys: string[],
  fallback = 0
): number {
  for (const key of keys) {
    const value = weapon?.[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return fallback;
}

function getWeaponLabel(weapon: any, fallback: string) {
  return weapon?.nameAr || weapon?.nameEn || weapon?.name || fallback;
}

// ===================================================================
// جدول بيانات الأسلحة — يُبنى ديناميكياً من WEAPONS في constants.ts
// يضمن التزامن التلقائي مع أي تحديث في بيانات الموقع
// ===================================================================
function buildWeaponDB(
  weapons: Array<{ id: string; damage: number; recoil: number; speed: number; range: number; type: string }>
): Record<string, { damage: number; recoil: number; speed: number; range: number; type: string }> {
  const db: Record<string, { damage: number; recoil: number; speed: number; range: number; type: string }> = {};
  for (const w of weapons) {
    db[w.id.toLowerCase()] = {
      damage: w.damage,
      recoil: w.recoil,
      speed:  w.speed,
      range:  w.range,
      type:   w.type,
    };
  }
  return db;
}
// WEAPON_DB يُبنى من WEAPONS مباشرة — أي تعديل في constants.ts ينعكس هنا تلقائياً
const WEAPON_DB = buildWeaponDB(WEAPONS);

export default function App() {
  return (
    <HelmetProvider>
      <GlobalProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </GlobalProvider>
    </HelmetProvider>
  );
}

const getWeaponProTip = (weapon: Weapon): string => {
  if (!weapon) return "";
  
  if (weapon.type === "AR") {
    return `نصيحة الخبراء: يُفضل بيك (Peek) سريع واستخدام دمج الجيروسكوب لتقليل الارتداد الأفقي للـ ${weapon.nameEn}.`;
  } else if (weapon.type === "Sniper") {
    return `نصيحة الخبراء: سرعة رصاصة الـ ${weapon.nameEn} تتطلب منك التصويب قليلاً أعلى الهدف (Bullet Drop) في المسافات التي تتجاوز 250 متراً.`;
  } else if (weapon.type === "SMG") {
    return `نصيحة الخبراء: الـ ${weapon.nameEn} مدمر في الالتحامات (Hip-fire) فلا تضيع الوقت بفتح السكوب داخل الغرف.`;
  } else if (weapon.type === "Shotgun") {
    return `نصيحة الخبراء: حافظ على مسافة مترين إلى ثلاثة أمتار واضرب في منتصف الصدر لضمان دخول كل شظايا ${weapon.nameEn} في الخصم.`;
  } else if (weapon.type === "LMG") {
    return `نصيحة الخبراء: الانبطاح (Prone) أو الجلوس (Crouch) يقلل ارتداد ${weapon.nameEn} بنسبة تصل لـ 50%، مما يجعله مثالياً لتفجير السيارات.`;
  } else if (weapon.type === "DMR") {
    return `نصيحة الخبراء: اضبط فترة زمنية قصيرة جداً (نصف ثانية) بين الطقات بـ ${weapon.nameEn} ليتعافى الارتداد تلقائياً بدلاً من الإطلاق السريع العشوائي.`;
  }
  
  return `نصيحة الخبراء: تدرب في ساحة التجمع (Cheer Park) لمعرفة سلوك الارتداد الخاص بـ ${weapon.nameEn} قبل استخدامه في التقييم.`;
};

const CountdownTimer = ({
  endDate,
  onEnd,
}: {
  endDate: string;
  onEnd?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        if (onEnd) onEnd();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onEnd]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4 justify-center items-center font-mono">
      {[
        { label: "يوم", value: timeLeft.days },
        { label: "ساعة", value: timeLeft.hours },
        { label: "دقيقة", value: timeLeft.minutes },
        { label: "ثانية", value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary font-black text-xl shadow-lg shadow-primary/5">
            {item.value.toString().padStart(2, "0")}
          </div>
          <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const TournamentFlashBanner = ({ settings }: { settings: CompetitionSettings[] }) => {
  const activeTournaments = settings.filter(s => s.type === 'tournament' && s.isActive);
  
  if (activeTournaments.length === 0) return null;

  return (
    <div className="space-y-6">
      {activeTournaments.map((tournament) => (
        <motion.div
          key={tournament.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 border border-primary/30 p-1 group"
        >
          {/* Animated Flash Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <div className="relative bg-bg-dark/80 backdrop-blur-xl rounded-[22px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(242,169,0,0.4)] animate-pulse">
                  <Trophy size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <Radio size={12} className="text-white" />
                </div>
              </div>
              
              <div className="text-right md:text-right">
                <h3 className="text-2xl md:text-4xl font-black gold-shimmer mb-2">
                  {tournament.id === 'daily-tournament' ? 'البطولة اليومية الكبرى' : 'بطولة ZONEPUBG الخاصة'}
                </h3>
                <div className="flex items-center gap-3 text-slate-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span>البطولة نشطة الآن - سارع بالتسجيل</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">ينتهي التسجيل خلال</span>
              <CountdownTimer endDate={tournament.endDate} />
              <button className="mt-2 btn-gold px-8 py-3 rounded-xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                سجل الآن مجاناً
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const SiteStatsSection = ({ stats }: { stats: SiteStats | null }) => {
  if (!stats) return null;

  const items = [
    { label: 'الزيارات', value: stats.visitors, icon: <Eye size={14} />, color: 'text-blue-500' },
    { label: 'المشاركات', value: stats.totalParticipations, icon: <Zap size={14} />, color: 'text-yellow-500' },
    { label: 'النشطين', value: Math.floor(stats.visitors * 0.4), icon: <Users size={14} />, color: 'text-green-500' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className={item.color}>{item.icon}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}:</span>
          <span className="text-xs font-black text-white">{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const OfficialGlobalTournaments = ({ isHidden }: { isHidden: boolean }) => {
  const tournaments = [
    { id: 'pmgc', name: 'PMGC 2026', date: '2026-11-15T00:00:00Z', icon: <Trophy size={20} />, label: 'البطولة العالمية' },
    { id: 'pmwi', name: 'PMWI Riyadh', date: '2026-07-20T00:00:00Z', icon: <Globe size={20} />, label: 'الدعوة العالمية' },
    { id: 'pmsl', name: 'PMSL EMEA', date: '2026-05-25T00:00:00Z', icon: <Zap size={20} />, label: 'الدوري الإقليمي' },
  ];

  if (isHidden) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(242,169,0,0.6)]" />
          <h2 className="text-xl md:text-2xl font-black tracking-tight">البطولات الرسمية العالمية</h2>
        </div>
        <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Official Global Events</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 px-4 md:px-0">
        {tournaments.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl bg-bg-card border border-white/10 p-6 group shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            {/* Flash Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-black transition-all duration-500 transform group-hover:rotate-6">
                {t.icon}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-black text-lg text-white group-hover:text-primary transition-colors">{t.name}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{t.label}</p>
              </div>

              <div className="w-full space-y-3 pt-4 border-t border-white/5">
                <div className="text-[10px] text-primary font-black uppercase tracking-widest">يبدأ العد التنازلي</div>
                <div className="text-lg font-mono text-white bg-white/5 py-3 rounded-xl border border-white/10 shadow-inner">
                  <CountdownTimer endDate={t.date} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-bg-dark z-[200] flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-24 h-24 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="text-primary animate-pulse" size={32} />
      </div>
    </div>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 text-center"
    >
      <h2 className="text-2xl font-black gold-shimmer mb-2">جاري التحميل...</h2>
      <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">تجهيز ساحة المعركة</p>
    </motion.div>
  </div>
);

const InlineSpinner = ({ message = "جاري التحميل..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="text-primary animate-pulse" size={16} />
      </div>
    </div>
    <p className="text-slate-500 text-sm font-bold">{message}</p>
  </div>
);

function AppContent() {
  const { 
    user, 
    userProfile, 
    setUserProfile,
    isAdmin: contextIsAdmin, 
    isAuthReady,
    isDataLoading,
    showNotification: globalShowNotification, 
    notification: globalNotification 
  } = useGlobalContext();

  const isAdmin = contextIsAdmin || user?.email === ADMIN_EMAIL;

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('zone-theme') as 'dark' | 'light') || 'dark';
  });
  const [selectedDevice, setSelectedDevice] = useState<Device>(DEVICES[0]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isRefreshingRankings, setIsRefreshingRankings] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.substring(1) || "home";

  // Compatibility wrapper for the old showNotification calls in App.tsx
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    globalShowNotification(message, type === 'info' ? 'success' : type as 'success' | 'error');
  };
  
  const setActiveTab = (tab: string, search?: string) => {
    const path = tab === "home" ? "/" : `/${tab}`;
    navigate(search ? `${path}${search}` : path);
  };

  

  useEffect(() => {
    if (activeTab === "home") {
      document.body.classList.add("is-home");
    } else {
      document.body.classList.remove("is-home");
    }
  }, [activeTab]);

  const [sensitivityCategory, setSensitivityCategory] = useState<
    "devices" | "players"
  >("devices");

  const [featuresCategory, setFeaturesCategory] = useState<
    "characters" | "attachments" | "weapons"
  >("characters");

  const [newsFilter, setNewsFilter] = useState<NewsItem["category"] | "all">(
    "all"
  );

  const [eventsSubTab, setEventsSubTab] = useState<"list" | "clips">("list");
  const [copied, setCopied] = useState(false);

  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [dbDevices, setDbDevices] = useState<Device[]>([]);
  const [dbPlayers, setDbPlayers] = useState<Device[]>([]);
  const [dbAttachments, setDbAttachments] = useState<Attachment[]>([]);
  const [dbWeapons, setDbWeapons] = useState<Weapon[]>([]);
  const [dbCharacters, setDbCharacters] = useState<Character[]>([]);

  const [dbImages, setDbImages] = useState<
    { id: string; url: string; name: string }[]
  >([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [weaponRatings, setWeaponRatings] = useState<WeaponRating[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const [selectedWeaponToRate, setSelectedWeaponToRate] =
    useState<Weapon | null>(null);

  const [weaponRatingValue, setWeaponRatingValue] = useState(5);
  const [weaponRatingComment, setWeaponRatingComment] = useState("");
  const [isSubmittingWeaponRating, setIsSubmittingWeaponRating] =
    useState(false);

  const [templates, setTemplates] = useState<any[]>([]);
  const [smartDeviceSearch, setSmartDeviceSearch] = useState("");
  const [aiSensitivityResponse, setAiSensitivityResponse] = useState<
    string | null
  >(null);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAddGiveawayModal, setShowAddGiveawayModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [showAddWeaponModal, setShowAddWeaponModal] = useState(false);

  const [newWeapon, setNewWeapon] = useState<Partial<Weapon>>({
    nameEn: "",
    nameAr: "",
    type: "AR",
    damage: 40,
    recoil: 40,
    speed: 40,
    range: 40,
    image: "",
  });

  const [isEditingWeapon, setIsEditingWeapon] = useState<string | null>(null);
  const [isAddingContent, setIsAddingContent] = useState<'weapon' | 'attachment' | 'character' | 'player' | null>(null);
  const [editingContentData, setEditingContentData] = useState<any>(null);
  const [editWeaponImage, setEditWeaponImage] = useState("");
  const [editWeaponNameAr, setEditWeaponNameAr] = useState("");
  const [editWeaponNameEn, setEditWeaponNameEn] = useState("");

  const [isEditingAttachment, setIsEditingAttachment] = useState<string | null>(
    null
  );
  const [editAttachmentImage, setEditAttachmentImage] = useState("");
  const [isEditingCharacter, setIsEditingCharacter] = useState<string | null>(
    null
  );
  const [editCharacterImage, setEditCharacterImage] = useState("");
  const [isEditingProPlayer, setIsEditingProPlayer] = useState<string | null>(
    null
  );
  const [editProPlayerImage, setEditProPlayerImage] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    CHARACTERS[0].id
  );

  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string>(
    ATTACHMENTS[0].id
  );

  const [selectedWeaponId, setSelectedWeaponId] = useState<string>("m416");
  const [isWeaponDropdownOpen, setIsWeaponDropdownOpen] = useState(false);

  const [selectedLoadoutWeaponId, setSelectedLoadoutWeaponId] =
    useState<string>(
      WEAPONS.find((w) => w.bestAttachments)?.id || WEAPONS[0].id
    );

  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isFeaturesCategoryDropdownOpen, setIsFeaturesCategoryDropdownOpen] = useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isCharacterDropdownOpen, setIsCharacterDropdownOpen] = useState(false);
  const [isAttachmentDropdownOpen, setIsAttachmentDropdownOpen] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showRankingTicker, setShowRankingTicker] = useState(true);

  // Visibility Timers
  useEffect(() => {
    checkFirestoreConnection();
    let adTimeoutId: ReturnType<typeof setTimeout>;
    let rankingTimeoutId: ReturnType<typeof setTimeout>;

    const runAdTimer = () => {
      setShowAdBanner(true);
      adTimeoutId = setTimeout(() => {
        setShowAdBanner(false);
        setCurrentAdIndex((prev) => prev + 1);
        adTimeoutId = setTimeout(runAdTimer, 5000);
      }, 20000);
    };

    const runRankingTimer = () => {
      setShowRankingTicker(true);
      rankingTimeoutId = setTimeout(() => {
        setShowRankingTicker(false);
        rankingTimeoutId = setTimeout(runRankingTimer, 5000);
      }, 30000);
    };

    runAdTimer();
    runRankingTimer();

    return () => {
      clearTimeout(adTimeoutId);
      clearTimeout(rankingTimeoutId);
    };
  }, []);

  // Auth & Profile Logic moved to GlobalContext.tsx for consistency.
  // App-specific Redirect handling remains:
  useEffect(() => {
    handleGoogleRedirectResult()
      .then((result) => {
        if (result?.user) {
          const displayName = result.user.displayName || "مستخدم Google";
          showNotification(`مرحباً ${displayName}، تم تسجيل الدخول بنجاح`, "success");
          setIsAuthModalOpen(false);
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
      });
  }, []);

  // Real-time Listeners
  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, "weapons"), (snap) => {
        setDbWeapons(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Weapon));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "weapons")),

      onSnapshot(collection(db, "attachments"), (snap) => {
        setDbAttachments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Attachment));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "attachments")),

      onSnapshot(collection(db, "characters"), (snap) => {
        setDbCharacters(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Character));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "characters")),

      onSnapshot(collection(db, "pro_players"), (snap) => {
        setDbPlayers(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Device));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "pro_players")),

      onSnapshot(collection(db, "devices"), (snap) => {
        setDbDevices(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Device));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "devices")),

      onSnapshot(collection(db, "giveaways"), (snap) => {
        setGiveaways(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Giveaway));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "giveaways")),

      onSnapshot(collection(db, "events"), (snap) => {
        setEvents(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Event));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "events")),

      onSnapshot(collection(db, "ads"), (snap) => {
        setAds(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Ad));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "ads")),

      onSnapshot(collection(db, "clips"), (snap) => {
        setClips(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Clip));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "clips")),

      onSnapshot(collection(db, "rankings"), (snap) => {
        setRankings(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Ranking));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "rankings")),

      onSnapshot(collection(db, "competitionSettings"), (snap) => {
        setCompetitionSettings(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as CompetitionSettings));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "competitionSettings")),

      onSnapshot(collection(db, "weaponRatings"), (snap) => {
        setWeaponRatings(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WeaponRating));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "weaponRatings")),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const [newDeviceData, setNewDeviceData] = useState<Partial<Device>>({
    name: "",
    brand: "Apple",
    code: "",
    screenSize: "",
    useGyroscope: true,
    playStyle: "Rusher",
    settings: {
      camera: {
        noScope: 100,
        redDot: 50,
        scope2x: 30,
        scope3x: 22,
        scope4x: 14,
        scope6x: 12,
        scope8x: 10,
      },
      ads: {
        noScope: 100,
        redDot: 50,
        scope2x: 30,
        scope3x: 22,
        scope4x: 14,
        scope6x: 12,
        scope8x: 10,
      },
      gyroscope: {
        noScope: 300,
        redDot: 300,
        scope2x: 300,
        scope3x: 250,
        scope4x: 210,
        scope6x: 80,
        scope8x: 40,
      },
    },
  });
  const [newAd, setNewAd] = useState({
    title: "",
    url: "",
    icon: "Megaphone",
    description: "",
  });
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(
    WEAPONS[0]
  );
  const [giveawayEntries, setGiveawayEntries] = useState<GiveawayEntry[]>([]);
  const [giveawayWinners, setGiveawayWinners] = useState<GiveawayWinner[]>([]);
  const [giveawayPlayerName, setGiveawayPlayerName] = useState("");
  const [giveawayPlayerId, setGiveawayPlayerId] = useState("");
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [competitionSettings, setCompetitionSettings] = useState<
    CompetitionSettings[]
  >([]);
  const [selectedSettingId, setSelectedSettingId] =
    useState<string>("royal-pass");
  const [settingStartDate, setSettingStartDate] = useState("");
  const [settingEndDate, setSettingEndDate] = useState("");
  const [isAllEventsHidden, setIsAllEventsHidden] = useState(false);
  const [isTournamentsHidden, setIsTournamentsHidden] = useState(false);
  const [isLogoHidden, setIsLogoHidden] = useState(false);
  const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  
  useEffect(() => {
    const setting = competitionSettings.find((s) => s.id === selectedSettingId);
    if (setting) {
      setSettingStartDate(setting.startDate || "");
      setSettingEndDate(setting.endDate || "");
      setIsAllEventsHidden(setting.isAllEventsHidden || false);
      setIsTournamentsHidden(setting.isTournamentsHidden || false);
      setIsLogoHidden(setting.isLogoHidden || false);
      setIsCommentsEnabled(setting.isCommentsEnabled !== false); // Default to true
    } else {
      setSettingStartDate("");
      setSettingEndDate("");
      setIsAllEventsHidden(false);
      setIsTournamentsHidden(false);
      setIsLogoHidden(false);
      setIsCommentsEnabled(true);
    }
  }, [selectedSettingId, competitionSettings]);

  // Site Stats Listener
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const fetchStats = async () => {
      try {
        const snap = await getDoc(doc(db, "siteStats", "global"));
        if (snap.exists()) {
          setSiteStats(snap.data() as SiteStats);
        } else {
          // Initialize stats if not exists
          await setDoc(doc(db, "siteStats", "global"), {
            visitors: 0,
            totalParticipations: 0,
            updatedAt: serverTimestamp()
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('offline') && retryCount < maxRetries) {
          retryCount++;
          console.warn(`Firestore offline, retrying stats fetch... (${retryCount}/${maxRetries})`);
          setTimeout(fetchStats, 2000 * retryCount);
        } else {
          handleFirestoreError(error, OperationType.GET, "siteStats/global");
        }
      }
    };
    fetchStats();
  }, []);

  // Visitor Tracking
  useEffect(() => {
    const trackVisitor = async () => {
      const hasVisited = sessionStorage.getItem('hasVisited');
      if (!hasVisited) {
        try {
          const statsRef = doc(db, "siteStats", "global");
          await updateDoc(statsRef, {
            visitors: increment(1),
            updatedAt: serverTimestamp()
          });
          sessionStorage.setItem('hasVisited', 'true');
        } catch (error) {
          console.error("Error tracking visitor:", error);
        }
      }
    };
    trackVisitor();
  }, []);
  
  const [authTab, setAuthTab] = useState<"login" | "register" | "forgot-password">("login");
  const [isSubmittingClip, setIsSubmittingClip] = useState(false);
  const [newClipTitle, setNewClipTitle] = useState("");
  const [newClipUrl, setNewClipUrl] = useState("");
  const [selectedClipFile, setSelectedClipFile] = useState<File | null>(null);
  const [sensitivityRatings, setSensitivityRatings] = useState<
    SensitivityRating[]
  >([]);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  // Theme Synchronization
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.remove("light");
      localStorage.setItem("zone-theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("zone-theme", "light");
    }
  }, [theme]);

  const sendNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        dir: "rtl",
      });
    }
  };

  const prevNewsRef = useRef<NewsItem[]>([]);
  const dbDevicesRef = useRef<Device[]>([]);
  const dbPlayersRef = useRef<Device[]>([]);

  useEffect(() => {
    dbDevicesRef.current = dbDevices;
  }, [dbDevices]);

  useEffect(() => {
    dbPlayersRef.current = dbPlayers;
  }, [dbPlayers]);

  useEffect(() => {
    if (news.length > 0 && prevNewsRef.current.length > 0) {
      const newLeaks = news.filter(
        (item) =>
          item.category === "leaks" &&
          !prevNewsRef.current.some((prev) => prev.id === item.id)
      );
      if (newLeaks.length > 0) {
        newLeaks.forEach((leak) => {
          sendNotification("🔥 تسريب جديد للموسم القادم!", leak.title);
        });
      }
    }
    prevNewsRef.current = news;
  }, [news]);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const handleAddDevice = async () => {
    if (!isAdmin) return;
    try {
      const collectionName =
        sensitivityCategory === "players" ? "players" : "devices";
      const finalData = {
        ...newDeviceData,
        brand:
          sensitivityCategory === "players"
            ? "Pro Player"
            : newDeviceData.brand,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      await setDoc(doc(collection(db, collectionName)), finalData);
      setSelectedDevice(finalData as Device);
      showNotification(
        sensitivityCategory === "players"
          ? "تمت إضافة اللاعب بنجاح"
          : "تمت إضافة الجهاز بنجاح",
        "success"
      );
      setShowAddDeviceModal(false);
      // Reset form
      setNewDeviceData({
        name: "",
        brand: "Apple",
        code: "",
        screenSize: "",
        useGyroscope: true,
        playStyle: "Rusher",
        settings: {
          camera: {
            noScope: 100,
            redDot: 50,
            scope2x: 30,
            scope3x: 22,
            scope4x: 14,
            scope6x: 12,
            scope8x: 10,
          },
          ads: {
            noScope: 100,
            redDot: 50,
            scope2x: 30,
            scope3x: 22,
            scope4x: 14,
            scope6x: 12,
            scope8x: 10,
          },
          gyroscope: {
            noScope: 300,
            redDot: 300,
            scope2x: 300,
            scope3x: 250,
            scope4x: 210,
            scope6x: 80,
            scope8x: 40,
          },
        },
      });
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.CREATE,
        sensitivityCategory === "players" ? "players" : "devices"
      );
    }
  };

  const handleSubmitGiveawayEntry = async () => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول للمشاركة في السحب", "info");
      setIsAuthModalOpen(true);
      return;
    }
    if (!giveawayPlayerName || !giveawayPlayerId) {
      showNotification("يرجى إدخال اسمك ومعرف اللاعب (ID)", "error");
      return;
    }
    setIsSubmittingEntry(true);
    try {
      const entry: Omit<GiveawayEntry, "id"> = {
        giveawayId: giveaways[0]?.id || "default",
        userId: user.uid,
        playerName: giveawayPlayerName,
        playerId: giveawayPlayerId,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(collection(db, "giveawayEntries")), entry);
      
      // Update total participations
      try {
        await updateDoc(doc(db, "siteStats", "global"), {
          totalParticipations: increment(1),
          updatedAt: serverTimestamp()
        });
      } catch (statsErr) {
        console.error("Error updating stats:", statsErr);
      }

      showNotification("تم تسجيل مشاركتك بنجاح!", "success");
      setGiveawayPlayerName("");
      setGiveawayPlayerId("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "giveawayEntries");
    } finally {
      setIsSubmittingEntry(false);
    }
  };

  const [newGiveaway, setNewGiveaway] = useState({
    title: "",
    prize: "",
    image: "",
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    status: "upcoming" as Event["status"],
    type: "standard",
  });
  const [newTemplate, setNewTemplate] = useState({
    label: "",
    desc: "",
    icon: "Zap",
    type: "giveaway" as "giveaway" | "event",
  });
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const videoUploadRef = useRef<HTMLDivElement>(null);

  const handleToggleVisibility = async (collectionName: string, id: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, collectionName, id), {
        isHidden: !currentStatus
      });
      showNotification("تم تحديث حالة الظهور", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  };

  // Filtered Content
  const filteredEvents = isAdmin ? events : events.filter(e => !e.isHidden);
  const filteredGiveaways = isAdmin ? giveaways : giveaways.filter(g => !g.isHidden);
  const filteredWeapons = isAdmin ? dbWeapons : dbWeapons.filter(w => !w.isHidden);
  const filteredAttachments = isAdmin ? dbAttachments : dbAttachments.filter(a => !a.isHidden);
  const filteredCharacters = isAdmin ? dbCharacters : dbCharacters.filter(c => !c.isHidden);
  const filteredDevices = isAdmin ? dbDevices : dbDevices.filter(d => !d.isHidden);
  const filteredPlayers = isAdmin ? dbPlayers : dbPlayers.filter(p => !p.isHidden);
  const filteredAds = isAdmin ? ads : ads.filter(a => !a.isHidden);
  const filteredClips = isAdmin ? clips : clips.filter(c => !c.isHidden);
  const filteredRankings = isAdmin ? rankings : rankings.filter(r => !r.isHidden);
  const filteredNews = isAdmin ? news : news.filter(n => !n.isHidden);

  // Fetch all users for admin
  useEffect(() => {
    if (activeTab === "dashboard" && isAdmin) {
      setLoadingUsers(true);
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as UserProfile[];
        setAllUsers(usersData);
        setLoadingUsers(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "users");
        setLoadingUsers(false);
      });
      return () => unsubscribe();
    }
  }, [activeTab, isAdmin]);

  // Admin-only listeners
  useEffect(() => {
    if (!isAdmin) {
      setDbImages([]);
      return;
    }

    const fetchImages = async () => {
      try {
        const snap = await getDocs(collection(db, "imageLibrary"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as { id: string; url: string; name: string }[];
        setDbImages(data);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "imageLibrary");
      }
    };

    fetchImages();
  }, [isAdmin]);


  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const q = query(collection(db, "news"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const _news: NewsItem[] = [];
      querySnapshot.forEach((doc) => {
        _news.push({ id: doc.id, ...doc.data() } as NewsItem);
      });
      setNews(_news);
    } catch (error) {
      console.error("Error loading news", error);
    } finally {
      setLoadingNews(false);
    }
  };

  const deleteItem = async (col: string, id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("تأكيد الحذف؟")) return;
    try {
      await deleteDoc(doc(db, col, id));
      showNotification("تم الحذف بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${col}/${id}`);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isCompetitionActive = (id: string) => {
    const setting = competitionSettings.find((s) => s.id === id);
    if (!setting) return true;
    if (!setting.isActive) return false;

    const start = setting.startDate ? new Date(setting.startDate) : null;
    const end = setting.endDate ? new Date(setting.endDate) : null;

    if (start && currentTime < start) return false;
    if (end && currentTime > end) return false;

    return true;
  };

  const handleUpdateCompetitionSettings = async (id?: string, data?: any, immediateStop = false) => {
    if (!isAdmin) return;
    setIsUpdatingSettings(true);
    const targetId = id || selectedSettingId;
    const finalData = data || {
      startDate: settingStartDate,
      endDate: settingEndDate,
      isActive: !immediateStop,
      isAllEventsHidden: isAllEventsHidden,
      isTournamentsHidden: isTournamentsHidden,
      isLogoHidden: isLogoHidden,
    };
    if (immediateStop) finalData.isActive = false;

    try {
      const settingRef = doc(db, "competitionSettings", targetId);
      const snap = await getDoc(settingRef);
      if (snap.exists()) {
        await updateDoc(settingRef, finalData);
      } else {
        await setDoc(settingRef, {
          id: targetId,
          type: "tournament",
          ...finalData,
          updatedAt: serverTimestamp(),
        });
      }
      showNotification("تم تحديث الإعدادات بنجاح", "success");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `competitionSettings/${targetId}`
      );
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  useEffect(() => {
    const current = competitionSettings.find((s) => s.id === selectedSettingId);
    if (current) {
      setSettingStartDate(current.startDate || "");
      setSettingEndDate(current.endDate || "");
      setIsAllEventsHidden(current.isAllEventsHidden || false);
    }
  }, [selectedSettingId, competitionSettings]);



  const handleSmartSensitivitySearch = async () => {
    if (!smartDeviceSearch.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiSensitivityResponse(null);
    try {
      const { getGenAI } = await import("./lib/gemini");
      const ai = getGenAI();
      if (!ai) {
        setAiSensitivityResponse("عذراً، خدمة الذكاء الاصطناعي غير متوفرة حالياً لعدم وجود مفتاح API. يرجى التواصل مع الإدارة.");
        setIsAiLoading(false);
        return;
      }
      const weaponContext = selectedWeapon
        ? `للسلاح: ${selectedWeapon.nameAr} (${selectedWeapon.nameEn})`
        : "";
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          role: "user",
          parts: [{
            text: `أعطني أفضل أرقام حساسية (Sensitivity) للعبة ببجي موبايل لجهاز: ${smartDeviceSearch} ${weaponContext}. 
            يجب أن تشمل النصيحة:
            1. حساسية الكاميرا (Camera Sensitivity).
            2. حساسية الـ ADS.
            3. حساسية الجيروسكوب (Gyroscope) إذا كان مدعوماً.
            4. نصيحة عامة لهذا الجهاز وهذا السلاح تحديداً.
            اجعل الإجابة منظمة جداً وباللغة العربية.`
          }]
        }],
        config: {
          systemInstruction:
            "أنت خبير تقني في إعدادات لعبة ببجي موبايل. تقدم نصائح دقيقة بناءً على مواصفات الأجهزة وقوة المعالج ومعدل التحديث (FPS) وخصائص الأسلحة.",
        }
      });
      setAiSensitivityResponse(
        response.text ||
          "لم نتمكن من العثور على إعدادات دقيقة لهذا الجهاز حالياً."
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("API Key must be set")) {
        setAiSensitivityResponse("عذراً، خدمة الذكاء الاصطناعي غير متوفرة حالياً لعدم وجود مفتاح API.");
        return;
      }
      console.error("AI Sensitivity Error:", error);
      showNotification(
        "حدث خطأ أثناء جلب البيانات من الذكاء الاصطناعي",
        "error"
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "attachment" | "weapon" | "newWeapon" | "character" | "proPlayer" | "content" = "attachment"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "content") {
          setEditingContentData((prev: any) => ({ ...prev, image: reader.result as string }));
        } else if (type === "attachment") {
          setEditAttachmentImage(reader.result as string);
        } else if (type === "weapon") {
          setEditWeaponImage(reader.result as string);
        } else if (type === "newWeapon") {
          setNewWeapon((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        } else if (type === "character") {
          setEditCharacterImage(reader.result as string);
        } else if (type === "proPlayer") {
          setEditProPlayerImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const seedAttachments = async () => {
    if (!isAdmin) return;
    try {
      for (const att of ATTACHMENTS) {
        await setDoc(doc(db, "attachments", att.id), att);
      }
      showNotification("تم رفع المرفقات بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "attachments");
    }
  };

  const handleAddAd = async () => {
    if (!isAdmin) return;
    try {
      const ad: Omit<Ad, "id"> = {
        ...newAd,
        createdAt: new Date().toISOString(),
        authorId: user?.uid || "",
      };
      await setDoc(doc(collection(db, "ads")), ad);
      showNotification("تمت إضافة الإعلان بنجاح", "success");
      setNewAd({ title: "", url: "", icon: "Megaphone", description: "" });
      setShowAddAdModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "ads");
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "ads", id));
      showNotification("تم حذف الإعلان", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `ads/${id}`);
    }
  };

  useEffect(() => {
    setComments([]);
  }, [selectedNewsId]);

  const handleAddComment = async (newsId: string) => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول للتعليق", "info");
      setIsAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const comment: Omit<NewsComment, "id"> = {
        newsId,
        userId: user.uid,
        userName: userProfile?.displayName || "لاعب ببجي",
        userPhoto: userProfile?.photoURL || "",
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(collection(db, "comments")), comment);
      
      // Update total participations
      try {
        await updateDoc(doc(db, "siteStats", "global"), {
          totalParticipations: increment(1),
          updatedAt: serverTimestamp()
        });
      } catch (statsErr) {
        console.error("Error updating stats:", statsErr);
      }

      setNewComment("");
      showNotification("تمت إضافة تعليقك", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "comments");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "comments", commentId));
      showNotification("تم حذف التعليق", "success");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `comments/${commentId}`
      );
    }
  };

  const handleAddWeapon = async () => {
    if (!isAdmin) return;
    try {
      await setDoc(doc(collection(db, "weapons")), newWeapon);
      showNotification("تمت إضافة السلاح بنجاح", "success");
      setShowAddWeaponModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "weapons");
    }
  };

  const handleSaveContent = async () => {
    if (!isAdmin || !editingContentData) return;
    setIsUpdatingSettings(true);
    try {
      const contentType = isAddingContent || 
        (isEditingWeapon ? 'weapon' : null) || 
        (isEditingAttachment ? 'attachment' : null) || 
        (isEditingCharacter ? 'character' : null) || 
        (isEditingProPlayer ? 'player' : null);

      const collectionName = 
        contentType === 'weapon' ? 'weapons' :
        contentType === 'attachment' ? 'attachments' :
        contentType === 'character' ? 'characters' :
        contentType === 'player' ? 'pro_players' : '';
      
      if (!collectionName) return;

      const editingId = isEditingWeapon || isEditingAttachment || isEditingCharacter || isEditingProPlayer;

      if (editingId) {
        await setDoc(doc(db, collectionName, editingId), editingContentData, { merge: true });
        showNotification("تم تحديث البيانات بنجاح", "success");
      } else {
        await addDoc(collection(db, collectionName), {
          ...editingContentData,
          createdAt: serverTimestamp()
        });
        showNotification("تم إضافة المحتوى بنجاح", "success");
      }
      setIsEditingWeapon(null);
      setIsEditingAttachment(null);
      setIsEditingCharacter(null);
      setIsEditingProPlayer(null);
      setIsAddingContent(null);
      setEditingContentData(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "content");
      showNotification("فشل حفظ البيانات", "error");
    } finally {
      setIsUpdatingSettings(false);
    }
  };



  const getIcon = (iconName: string, size = 24, className = "") => {
    switch (iconName) {
      case "Megaphone":
        return <Megaphone size={size} className={className} />;
      case "ExternalLink":
        return <ExternalLink size={size} className={className} />;
      case "Tag":
        return <Tag size={size} className={className} />;
      case "Gift":
        return <Gift size={size} className={className} />;
      case "Star":
        return <Star size={size} className={className} />;
      case "Bell":
        return <Bell size={size} className={className} />;
      case "Zap":
        return <Zap size={size} className={className} />;
      case "Smartphone":
        return <Smartphone size={size} className={className} />;
      case "Crosshair":
        return <Crosshair size={size} className={className} />;
      case "Plus":
        return <Plus size={size} className={className} />;
      case "Trash2":
        return <Trash2 size={size} className={className} />;
      case "Pencil":
        return <Pencil size={size} className={className} />;
      case "LogIn":
        return <LogIn size={size} className={className} />;
      case "LogOut":
        return <LogOut size={size} className={className} />;
      case "UserMinus":
        return <UserMinus size={size} className={className} />;
      case "Calendar":
        return <Calendar size={size} className={className} />;
      case "Play":
        return <Play size={size} className={className} />;
      case "Upload":
        return <Upload size={size} className={className} />;
      case "Video":
        return <Video size={size} className={className} />;
      case "Vote":
        return <Vote size={size} className={className} />;
      default:
        return <Zap size={size} className={className} />;
    }
  };

  useEffect(() => {
    // Component mount
  }, []);

  useEffect(() => {
    // No defaults to add in frontend-only mode
  }, []);

  const currentWeaponsRaw = [...WEAPONS.filter(w => !dbWeapons.find(dbw => dbw.id === w.id)), ...dbWeapons];
  const currentAttachmentsRaw = [...ATTACHMENTS.filter(a => !dbAttachments.find(dba => dba.id === a.id)), ...dbAttachments];
  const currentCharactersRaw = [...CHARACTERS.filter(c => !dbCharacters.find(dbc => dbc.id === c.id)), ...dbCharacters];
  const currentProPlayersRaw = [...PRO_PLAYERS.filter(p => !dbPlayers.find(dbp => dbp.id === p.id)), ...dbPlayers.filter(p => p.brand === 'Pro Player')];

  const currentWeapons = isAdmin ? currentWeaponsRaw : currentWeaponsRaw.filter(w => !w.isHidden);
  const currentAttachments = isAdmin ? currentAttachmentsRaw : currentAttachmentsRaw.filter(a => !a.isHidden);
  const currentCharacters = isAdmin ? currentCharactersRaw : currentCharactersRaw.filter(c => !c.isHidden);
  const currentProPlayers = isAdmin ? currentProPlayersRaw : currentProPlayersRaw.filter(p => !p.isHidden);

  const groupedWeapons = currentWeapons.reduce((acc, weapon) => {
    const type = weapon.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(weapon);
    return acc;
  }, {} as Record<string, Weapon[]>);

  const categoryNames: Record<string, string> = {
    AR: "بنادق هجومية (Assault Rifles)",
    Sniper: "قناصات (Sniper Rifles)",
    DMR: "بنادق الرماية (DMR)",
    SMG: "أسلحة رشاشة (SMG)",
    LMG: "رشاشات خفيفة (LMG)",
    Shotgun: "بنادق الصيد (Shotguns)",
    Other: "أخرى",
  };
  const groupedAttachments = currentAttachments.reduce((acc, attachment) => {
    const type = attachment.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(attachment);
    return acc;
  }, {} as Record<string, Attachment[]>);

  const attachmentCategoryNames: Record<string, string> = {
    Muzzle: "فوهات (Muzzle)",
    Grip: "مقابض (Grip)",
    Magazine: "مخازن (Magazine)",
    Stock: "مساند (Stock)",
    Scope: "مناظير (Scope)",
    Other: "أخرى",
  };

  const loadoutWeapons = currentWeapons.filter((w) => w.bestAttachments);
  const groupedLoadoutWeapons = loadoutWeapons.reduce((acc, weapon) => {
    const type = weapon.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(weapon);
    return acc;
  }, {} as Record<string, Weapon[]>);


  const currentDevices = React.useMemo(() => {
    const combined = [...DEVICES, ...dbDevices];
    const unique = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );
    return unique;
  }, [dbDevices]);

  const currentPlayers = React.useMemo(() => {
    const combined = [...PRO_PLAYERS, ...dbPlayers];
    const unique = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );
    return unique;
  }, [dbPlayers]);

  const currentList =
    sensitivityCategory === "devices" ? currentDevices : currentPlayers;

  // Update selected device if it changes in DB
  useEffect(() => {
    const updated = currentList.find((d) => d.id === selectedDevice.id);
    if (updated && (updated.code !== selectedDevice.code || updated.name !== selectedDevice.name)) {
      setSelectedDevice(updated);
    }
  }, [currentList, selectedDevice.id]);

  const handleUpdateDevice = async (field: "name" | "code", value: string) => {
    if (!isAdmin) return;
    try {
      await setDoc(
        doc(db, "devices", selectedDevice.id),
        {
          [field]: value,
        },
        { merge: true }
      );
      showNotification("تم التحديث بنجاح", "success");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `devices/${selectedDevice.id}`
      );
    }
  };

  const handleUpdateSetting = async (
    category: "camera" | "ads" | "gyroscope",
    field: keyof SensitivitySettings,
    value: number
  ) => {
    if (!user || !userProfile) {
      showNotification("يرجى تسجيل الدخول لحفظ إعداداتك", "info");
      setIsAuthModalOpen(true);
      return;
    }

    const updatedProfile = { ...userProfile };
    updatedProfile.settings[category][field] = value;
    setUserProfile(updatedProfile);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`settings.${category}.${field}`]: value,
      });
      showNotification("تم حفظ التغييرات تلقائياً", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleLoginSuccess = (userData: { name: string; email?: string }) => {
    setIsAuthModalOpen(false);
    
    // إذا لم يكن هناك مستخدم من فيربيز، ننشئ مستخدم محلي لتحديث الواجهة
    if (!user) {
      const mockUser = {
        uid: "local-" + Date.now(),
        displayName: userData.name,
        email: userData.email || (userData.name.includes("@") ? userData.name : ""),
        photoURL: null,
      };
      
      // We don't use localUser anymore, we rely on GlobalContext
      // But we can trigger a notification
    }
    
    showNotification(`مرحباً ${userData.name}، تم تسجيل الدخول بنجاح`, "success");
  };

  const handleLogin = () => {
    setAuthTab("login");
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification("تم تسجيل الخروج", "info");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSyncData = async (type: 'weapons' | 'attachments' | 'characters' | 'players' | 'news' | 'rankings', silent = false) => {
    if (!isAdmin) return;
    if (!silent) showNotification(`جاري مزامنة ${type}...`, 'info');
    try {
       const gemini = geminiService;
       if (type === 'news') {
         const newsData = await gemini.fetchPubgNews();
         for (const item of newsData) {
           await setDoc(doc(db, "news", item.id), item);
         }
         
         // TikTok Auto-Sync Check
         const tiktokSyncEnabled = localStorage.getItem('tiktok_sync_news') === 'true';
         if (tiktokSyncEnabled && newsData.length > 0) {
           setTimeout(() => {
             showNotification(`تم اكتشاف ${newsData.length} أخبار جديدة. جاري مزامنتها مع حساب تيك توك المرتبط...`, 'success');
             console.log('TikTok Sync Triggered for:', newsData.map(n => n.title));
           }, 1000);
         }
       } else if (type === 'rankings') {
         const rankingsData = await gemini.fetchPubgRankings();
         for (const player of rankingsData) {
           await setDoc(doc(db, "rankings", player.rank.toString()), {
             ...player,
             id: player.id || player.rank.toString(),
             updatedAt: new Date().toISOString()
           });
         }
       } else {
         if (!silent) showNotification(`مزامنة ${type} قيد التطوير`, 'info');
         return;
       }
       if (!silent) showNotification(`تمت مزامنة ${type} بنجاح`, 'success');
    } catch (error) {
       console.error(`Sync error for ${type}:`, error);
       if (!silent) showNotification(`فشل مزامنة ${type}`, 'error');
    }
  };

  // Automatic stale data sync every hour
  useEffect(() => {
    if (!isAdmin) return;

    const checkAndSync = () => {
      if (rankings.length > 0) {
        const lastUpdate = rankings[0].updatedAt;
        if (lastUpdate) {
          const lastDate = new Date(lastUpdate).getTime();
          const now = new Date().getTime();
          const hoursPassed = (now - lastDate) / (1000 * 60 * 60);
          
          // If older than 1 hour, sync silently in background
          if (hoursPassed >= 1) {
            handleSyncData('rankings', true);
            handleSyncData('news', true);
          }
        } else {
          handleSyncData('rankings', true);
          handleSyncData('news', true);
        }
      } else {
        handleSyncData('rankings', true);
        handleSyncData('news', true);
      }
    };

    // Check on mount
    checkAndSync();

    // Set up interval to check every 15 minutes if it needs sync
    const interval = setInterval(checkAndSync, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAdmin, rankings.length]);

  const handleNavigate = (tab: any) => {
    if (tab.startsWith('add-')) {
      const type = tab.replace('add-', '') as any;
      setIsAddingContent(type === 'players' ? 'player' : type);
      setEditingContentData({});
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleLogo = async () => {
    const globalSetting = competitionSettings.find(s => s.id === 'global');
    const newValue = !(globalSetting?.isLogoHidden || false);
    
    if (isAdmin) {
      try {
        const settingRef = doc(db, "competitionSettings", "global");
        const snap = await getDoc(settingRef);
        if (snap.exists()) {
          await updateDoc(settingRef, { isLogoHidden: newValue });
        } else {
          await setDoc(settingRef, {
            id: "global",
            type: "tournament",
            isLogoHidden: newValue,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error updating logo visibility:", error);
      }
    }
  };

  const handleToggleTournaments = async () => {
    const globalSetting = competitionSettings.find(s => s.id === 'global');
    const newValue = !(globalSetting?.isTournamentsHidden || false);
    
    if (isAdmin) {
      try {
        const settingRef = doc(db, "competitionSettings", "global");
        const snap = await getDoc(settingRef);
        if (snap.exists()) {
          await updateDoc(settingRef, { isTournamentsHidden: newValue });
        } else {
          await setDoc(settingRef, {
            id: "global",
            type: "tournament",
            isTournamentsHidden: newValue,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error updating tournament visibility:", error);
      }
    }
  };

  const handleToggleComments = async () => {
    const globalSetting = competitionSettings.find(s => s.id === 'global');
    const newValue = !(globalSetting?.isCommentsEnabled !== false);
    
    if (isAdmin) {
      try {
        const settingRef = doc(db, "competitionSettings", "global");
        const snap = await getDoc(settingRef);
        if (snap.exists()) {
          await updateDoc(settingRef, { isCommentsEnabled: newValue });
        } else {
          await setDoc(settingRef, {
            id: "global",
            type: "tournament",
            isCommentsEnabled: newValue,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error updating comments visibility:", error);
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === ADMIN_EMAIL) {
      handleLogin();
      setShowAdminLogin(false);
    } else {
      showNotification("هذا البريد غير مصرح له بالدخول كمسؤول.", "error");
    }
  };

  const addGiveaway = async () => {
    if (!isAdmin) return;
    const newGiveaway: Omit<Giveaway, "id"> = {
      title: "سحب على 660 شدة",
      prize: "660 UC",
      image: "https://picsum.photos/seed/pubg/800/400",
      endDate: "2024-05-01",
      participants: 0,
      status: "active",
      authorEmail: user?.email || "",
    };
    try {
      await setDoc(doc(collection(db, "giveaways")), newGiveaway);
      showNotification("تمت إضافة السحب بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "giveaways");
    }
  };

  const addEvent = async () => {
    if (!isAdmin) return;
    const newEvent: Omit<Event, "id"> = {
      title: "بطولة ZONEPUBG الكبرى",
      description:
        "انضم إلينا في أكبر بطولة لهذا الشهر مع جوائز قيمة تصل إلى 10,000 شدة!",
      date: new Date().toISOString(),
      status: "upcoming",
      isHidden: false,
      authorEmail: user?.email || "",
      createdAt: new Date().toISOString(),
      authorId: user?.uid || "",
    };
    try {
      await setDoc(doc(collection(db, "events")), newEvent);
      showNotification("تمت إضافة الفعالية بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "events");
    }
  };

  const addTemplate = async () => {
    if (!isAdmin) return;
    showNotification("ميزة القوالب ستتوفر قريباً", "info");
  };

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      Zap,
      Shield,
      Gift,
      Star,
      Trophy,
      Users,
      Play,
      Calendar,
      Video,
      Bell,
      BarChart3,
      Vote,
      CheckCircle2,
      Smartphone,
      Tablet,
      Crosshair,
      Eye,
      Settings2,
      Newspaper,
      Megaphone,
      Tag,
      Lock,
      UserIcon,
    };
    const Icon = icons[iconName] || Zap;
    return <Icon size={24} />;
  };

  const sanitizeUrl = (url: string | undefined | null) => {
    const OFFICIAL_SITE = "https://www.pubgmobile.com";
    const FALLBACK = OFFICIAL_SITE;
    
    if (!url || typeof url !== "string" || url.trim() === "" || url === "#" || url.trim() === "undefined" || url.trim() === "null") {
      return FALLBACK;
    }
    
    let trimmedUrl = url.trim();
    
    // Handle relative paths
    if (trimmedUrl.startsWith("/")) {
      return `${OFFICIAL_SITE}${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith("http")) return trimmedUrl;
    if (trimmedUrl.startsWith("//")) return `https:${trimmedUrl}`;
    
    // If it looks like a domain name
    if (trimmedUrl.includes(".")) {
      return `https://${trimmedUrl}`;
    }

    return FALLBACK;
  };

  const SubtleAdBanner = () => {
    if (ads.length === 0) return null;

    // Cycle through ads
    const ad = ads[currentAdIndex % ads.length];

    return (
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-bg-card via-primary/5 to-bg-card border border-white/5 relative overflow-hidden group mb-12 min-h-[100px] flex items-center">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
        <AnimatePresence mode="wait">
          {ad && (
            <motion.a
              key={ad.id}
              href={sanitizeUrl(ad.url)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4 cursor-pointer w-full pl-8"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all">
                {getIconComponent(ad.icon)}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-primary font-bold text-lg mb-1">{ad.title}</span>
                <span className="text-sm text-slate-400 line-clamp-1">{ad.description}</span>
              </div>
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const navLinks = [
    { id: "home", label: "الرئيسية", path: "/" },
    { id: "characters", label: "الشخصيات", path: "/characters" },
    { id: "weapons", label: "الأسلحة", path: "/characters?tab=weapons" },
    { id: "attachments", label: "قطع الأسلحة", path: "/characters?tab=attachments" },
    { id: "news", label: "التسريبات", path: "/news" },
    { id: "rate", label: "تحليل", path: "/rate", highlight: true },
    { id: "calculator", label: "حاسبة التقييم", path: "/calculator" },
    { id: "compare", label: "مقارنة", path: "/compare" },
    { id: "loadouts", label: "القطع", path: "/loadouts" },
    { id: "sensitivity", label: "الحساسية", path: "/sensitivity" },
    { id: "game-events", label: "فعاليات اللعبة", path: "/game-events" },
    { id: "events", label: "فعالياتنا", path: "/events" },
    { id: "giveaways", label: "السحوبات", path: "/giveaways" },
    { id: "ads", label: "مجتمعنا", path: "/ads" },
  ];

  if (!isAuthReady || isDataLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-main font-sans selection:bg-primary/30 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* 🌌 Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-900/10 blur-[150px] rounded-full" />
      </div>

      {competitionSettings.find(s => s.id === 'global')?.isBannerActive && (
        <a 
          href={sanitizeUrl(competitionSettings.find(s => s.id === 'global')?.bannerLink)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-[101] flex items-center justify-center gap-2 bg-primary text-black font-[800] text-sm py-2 px-4 shadow-lg hover:bg-primary-hover transition-colors overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
          <span className="relative z-10">{competitionSettings.find(s => s.id === 'global')?.bannerText || "إعلان الموقع"}</span>
        </a>
      )}

      <header className="sticky top-0 z-[100] bg-pubg-header border-b border-pubg-border h-[64px] flex items-center px-4 sm:px-8 lg:px-[72px]">
        <div className="max-w-[1360px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[44px]">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-1 cursor-pointer group"
            >
              <h1 className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-pubg-gold/20 rounded-xl flex items-center justify-center border border-pubg-gold/30 shadow-[0_0_15px_rgba(242,169,0,0.1)] group-hover:shadow-[0_0_20px_rgba(242,169,0,0.3)] transition-all">
                  <Shield className="text-pubg-gold" size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-[32px] flex items-center px-2 border-[2.5px] border-pubg-gold bg-pubg-gold/10 text-pubg-gold text-[18px] font-[900] tracking-tighter rounded-sm shadow-[0_0_15px_rgba(242,169,0,0.2)] group-hover:shadow-[0_0_25px_rgba(242,169,0,0.4)] transition-all">
                      PUBG
                    </div>
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-pubg-gold"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-pubg-gold"></div>
                  </div>
                  <span className="text-white text-[22px] font-[800] tracking-tight drop-shadow-md">ZONE</span>
                </div>
              </h1>
            </div>

            <nav className="hidden lg:flex items-center gap-[44px] text-[14px] text-pubg-muted font-bold h-full">
              {[
                { label: "الرئيسية", path: "/", highlight: true },
                { label: "الأخبار", path: "/news" },
                {
                  label: "مجتمعنا",
                  path: "#",
                  subItems: [
                    { label: "السحوبات", path: "/giveaways" },
                    { label: "الفعاليات", path: "/events" },
                  ]
                },
                {
                  label: "أدوات اللاعبين",
                  path: "#",
                  subItems: [
                    { label: "الحساسية", path: "/sensitivity" },
                    { label: "حاسبة التقييم", path: "/calculator" },
                    { label: "العتاد", path: "/loadouts" },
                    { label: "اللقطات", path: "/rate" },
                  ]
                },
                {
                  label: "خصائص ومزايا",
                  path: "#",
                  subItems: [
                    { label: "الشخصيات", path: "/characters" },
                    { label: "الأسلحة", path: "/compare" },
                    { label: "القطع", path: "/loadouts" },
                  ]
                },
                ...(isAdmin ? [{ label: "لوحة التحكم", path: "/dashboard" }] : [])
              ].map((link, idx) => {
                if (link.subItems) {
                  const isActive = link.subItems.some(sub => location.pathname === sub.path || (sub.path.includes('?') && location.search.includes(sub.path.split('?')[1])));
                  return (
                    <div key={idx} className="relative group flex items-center h-[68px]">
                      <button className={`relative flex items-center gap-1 transition-colors hover:text-white ${isActive ? "text-primary hover:text-primary" : ""}`}>
                        {link.label}
                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        {isActive && (
                          <span className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 w-[52px] h-[3px] bg-primary rounded-t-md"></span>
                        )}
                      </button>
                      <div className="absolute top-[68px] right-0 w-48 bg-[#111315] border border-white/10 rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col overflow-hidden">
                        {link.subItems.map((sub, sIdx) => {
                          const isSubActive = location.pathname === sub.path || (sub.path.includes('?') && location.search.includes(sub.path.split('?')[1]));
                          return (
                            <button
                              key={sIdx}
                              onClick={() => navigate(sub.path)}
                              className={`px-4 py-3 text-right text-sm transition-colors hover:bg-white/5 hover:text-white border-b border-white/5 last:border-0 ${isSubActive ? "text-primary bg-white/5" : "text-gray-400"}`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                const isActive = location.pathname === link.path || (link.path.includes('?') && location.search.includes(link.path.split('?')[1]));
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(link.path)}
                    className={`relative flex items-center h-[68px] transition-colors hover:text-white ${isActive ? "text-primary hover:text-primary" : ""}`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[52px] h-[3px] bg-primary rounded-t-md"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Search size={22} className="text-gray-400 cursor-pointer hover:text-white transition" />
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-gray-400 hover:text-white transition" title="تغيير المظهر">
              {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            
            {user ? (
              <div className="relative group h-[68px] flex items-center">
                <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-white/5 rounded-lg transition">
                  <img src={userProfile?.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || user.displayName || 'User')}&background=F5C400&color=000`} alt="Avatar" className="w-[34px] h-[34px] rounded-md object-cover" />
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-white text-sm font-bold">{userProfile?.displayName || user.displayName || "مستخدم"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center justify-center w-[104px] h-[42px] bg-primary text-black rounded-[8px] font-[700] text-[14px] hover:bg-primary-hover transition"
              >
                تسجيل الدخول
              </button>
            )}

            <button 
              className="lg:hidden text-gray-400 hover:text-white transition" 
              onClick={() => setShowMobileMenu(true)}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 sm:px-6 py-6 sm:py-12 mb-20 lg:mb-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={
              !isAuthReady ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={48} /></div>
              ) : !user ? (
                <motion.div key="login" className="pro-card p-12 text-center">
                  <h2 className="text-2xl font-black mb-4">تسجيل الدخول مطلوب</h2>
                  <button onClick={() => setIsAuthModalOpen(true)} className="btn-gold px-8 py-3 rounded-xl font-black">
                    تسجيل الدخول الآن
                  </button>
                </motion.div>
              ) : !userProfile ? (
                <div className="flex flex-col items-center justify-center p-12 gap-4">
                  <Loader2 className="animate-spin text-primary" size={48} />
                  <p className="text-slate-400 font-bold">جاري تحميل بيانات الملف الشخصي...</p>
                  <p className="text-xs text-slate-500">إذا استمر التحميل، قد يكون هناك مشكلة في الاتصال بقاعدة البيانات.</p>
                </div>
              ) : (
                <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                  <DashboardPage
                    userProfile={userProfile}
                    isAdmin={isAdmin}
                    siteStats={siteStats}
                    allUsers={allUsers}
                    clips={clips}
                    giveaways={giveaways}
                    events={events}
                    onLogout={logout}
                    onUpdateProfile={async (data) => {
                      if (userProfile) {
                        try {
                          await updateDoc(doc(db, "users", userProfile.uid), data);
                          showNotification("تم", "success");
                        } catch (e) {}
                      }
                    }}
                    onDeleteUser={(uid) => deleteItem("users", uid)}
                    onUpdateUserRole={(uid, role) => updateDoc(doc(db, "users", uid), { role })}
                    onNavigate={navigate}
                    isTournamentsHidden={competitionSettings.find(s => s.id === 'global')?.isTournamentsHidden || false}
                    onToggleTournaments={handleToggleTournaments}
                    isCommentsEnabled={competitionSettings.find(s => s.id === 'global')?.isCommentsEnabled !== false}
                    onToggleComments={handleToggleComments}
                    competitionSettings={competitionSettings}
                    onUpdateCompetitionSettings={async (id, data, stopNow) => {
                      setIsUpdatingSettings(true);
                      try {
                        const ref = doc(db, "competitionSettings", id);
                        if (stopNow) {
                          await updateDoc(ref, { status: 'stopped', updatedAt: serverTimestamp() });
                        } else {
                          await setDoc(ref, { id, ...data, status: 'active', updatedAt: serverTimestamp() }, { merge: true });
                        }
                        showNotification("تم", "success");
                      } catch (e) {
                      } finally {
                        setIsUpdatingSettings(false);
                      }
                    }}
                    isUpdatingSettings={isUpdatingSettings}
                    onSyncData={handleSyncData}
                    isLogoHidden={competitionSettings.find(s => s.id === 'global')?.isLogoHidden || false}
                    onToggleLogo={handleToggleLogo}
                    onToggleVisibility={handleToggleVisibility}
                    weapons={dbWeapons}
                    attachments={dbAttachments}
                    characters={dbCharacters}
                    players={dbPlayers}
                    news={news}
                    ads={ads}
                  />
                </Suspense>
              )
            } />

            <Route path="/" element={
                <HomePage
                  news={filteredNews}
                  loadingNews={loadingNews}
                  clips={filteredClips}
                  ads={filteredAds}
                  rankings={filteredRankings}
                  competitionSettings={competitionSettings}
                  isAdmin={isAdmin}
                  onSyncRankings={() => handleSyncData('rankings')}
                  setActiveTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
                  SubtleAdBanner={SubtleAdBanner}
                  TournamentFlashBanner={TournamentFlashBanner}
                  OfficialGlobalTournaments={() => {
                    const globalSetting = competitionSettings.find(s => s.id === 'global');
                    return <OfficialGlobalTournaments isHidden={globalSetting?.isTournamentsHidden || false} />;
                  }}
                  onToggleVisibility={handleToggleVisibility}
                  devices={currentDevices}
                  players={currentProPlayers}
                />
            } />

            <Route path="/sensitivity" element={
              <PageWrapper title="الحساسية الاحترافية" subtitle="أدق إعدادات الحساسية لأقوى الأجهزة واللاعبين المحترفين">
                <SensitivityPage
                  SubtleAdBanner={SubtleAdBanner}
                  isAdmin={isAdmin}
                  currentWeapons={currentWeapons}
                  handleCopy={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  copied={copied}
                  user={userProfile}
                  handleLogin={() => setIsAuthModalOpen(true)}
                  showNotification={showNotification}
                  onToggleVisibility={handleToggleVisibility}
                  sensitivityCategory={sensitivityCategory}
                  setSensitivityCategory={setSensitivityCategory}
                  currentDevices={isAdmin ? currentDevices : currentDevices.filter(d => !d.isHidden)}
                  currentPlayers={isAdmin ? currentPlayers : currentPlayers.filter(p => !p.isHidden)}
                  setSelectedDevice={setSelectedDevice}
                  selectedDevice={selectedDevice}
                />
              </PageWrapper>
            } />

            <Route path="/characters" element={
              <PageWrapper title="دليل الشخصيات" subtitle="اكتشف قدرات وميزات شخصيات ببجي موبايل وكيفية توظيفها في المعركة">
                <CharactersPage
                  currentCharacters={currentCharacters}
                  currentWeapons={currentWeapons}
                  currentAttachments={currentAttachments}
                  isAdmin={isAdmin}
                  deleteItem={deleteItem}
                  setEditingContentData={setEditingContentData}
                  setIsEditingCharacter={setIsEditingCharacter}
                  setIsEditingWeapon={setIsEditingWeapon}
                  setIsEditingAttachment={setIsEditingAttachment}
                  setIsAddingContent={setIsAddingContent}
                  groupedWeapons={groupedWeapons}
                  categoryNames={categoryNames}
                  attachmentTypes={{
                    muzzle: "فوهات (Muzzles)",
                    grip: "مقبض (Grips)",
                    magazine: "مخازن (Magazines)",
                    stock: "مساند (Stocks)",
                    scope: "مناظير (Scopes)"
                  }}
                  onToggleVisibility={handleToggleVisibility}
                />
              </PageWrapper>
            } />

            <Route path="/loadouts" element={
              <PageWrapper title="تجهيزات الأسلحة" subtitle="أفضل تركيبات الإضافات للوصول لأقصى أداء وثبات لكل سلاح">
                <LoadoutsPage
                  currentWeapons={currentWeapons}
                  currentAttachments={currentAttachments}
                  weaponRatings={weaponRatings}
                  categoryNames={categoryNames}
                  getWeaponProTip={getWeaponProTip}
                  setSelectedWeaponToRate={setSelectedWeaponToRate}
                  setIsRatingModalOpen={setIsRatingModalOpen}
                  SubtleAdBanner={SubtleAdBanner}
                />
              </PageWrapper>
            } />

            <Route path="/events" element={
              <PageWrapper title="البطولات والفعاليات" subtitle="شارك في أقوى المنافسات والبطولات واربح جوائز قيمة">
                <EventsPage
                  isAdmin={isAdmin}
                  user={userProfile as any}
                  userProfile={userProfile}
                  competitionSettings={competitionSettings}
                  clips={filteredClips}
                  comments={comments}
                  showNotification={showNotification}
                  onLogin={() => setIsAuthModalOpen(true)}
                  events={filteredEvents}
                  onToggleVisibility={handleToggleVisibility}
                  handleUpdateCompetitionSettings={handleUpdateCompetitionSettings}
                  isUpdatingSettings={isUpdatingSettings}
                  deleteItem={deleteItem}
                />
              </PageWrapper>
            } />

            <Route path="/rate" element={
              <PageWrapper title="تقييم اللقطات" subtitle="شارك لقطات مبارزاتك واحصل على تقييم من المجتمع والذكاء الاصطناعي">
                <RatePage
                  videoUrl={""}
                  setVideoUrl={() => {}}
                  isAnalyzing={false}
                  isAiTyping={false}
                  currentText={""}
                  currentType={""}
                  analysisStep={0}
                  handleAnalyzeVideo={() => {}}
                  aiRateLimited={false}
                  aiQuotaError={false}
                  clips={filteredClips}
                  searchQuery={""}
                  setSearchQuery={() => {}}
                  selectedCategory={"all"}
                  setSelectedCategory={() => {}}
                  isAdmin={isAdmin}
                  deleteItem={deleteItem}
                  user={userProfile}
                  handleLogin={() => setIsAuthModalOpen(true)}
                  onToggleVisibility={handleToggleVisibility}
                />
              </PageWrapper>
            } />

            <Route path="/game-events" element={
              <PageWrapper title="فعاليات اللعبة" subtitle="تابع آخر الفعاليات داخل ببجي موبايل وتأكد من عدم تفويت أي فرصة">
                <GameEventsPage
                  gameEvents={filteredEvents}
                  getTimeRemaining={() => {}}
                  isAdmin={isAdmin}
                  onToggleVisibility={handleToggleVisibility}
                />
              </PageWrapper>
            } />

            <Route path="/giveaways" element={
              <PageWrapper title="توزيعات الجوائز" subtitle="اشترك في السحوبات والمسابقات الأسبوعية لربح حزم شدات وشحن مجاني">
                <GiveawaysPage
                  activeGiveaway={filteredGiveaways[0]}
                  isJoiningGiveaway={isSubmittingEntry}
                  handleJoinGiveaway={handleSubmitGiveawayEntry}
                  hasJoinedGiveaway={giveawayEntries.some(e => e.userId === user?.uid)}
                  previousGiveaways={filteredGiveaways}
                  getGiveawayStatus={() => {}}
                  user={userProfile}
                  handleLogin={() => setIsAuthModalOpen(true)}
                  isAdmin={isAdmin}
                  isCompetitionActive={isCompetitionActive}
                  giveaways={filteredGiveaways}
                  showNotification={showNotification}
                  deleteItem={deleteItem}
                  addGiveaway={addGiveaway}
                  getIconComponent={getIconComponent}
                  templates={templates}
                  setShowAddTemplateModal={setShowAddTemplateModal}
                  onToggleVisibility={handleToggleVisibility}
                />
              </PageWrapper>
            } />

            <Route path="/compare" element={
              <PageWrapper title="مقارنة الأسلحة" subtitle="قارن بين خصائص الأسلحة لتعرف السلاح الأنسب لأسلوب لعبك والمواجهة القادمة">
                <ComparePage
                  currentWeapons={currentWeapons}
                  groupedWeapons={groupedWeapons}
                  categoryNames={categoryNames}
                  getWeaponSmartAnalysis={getWeaponSmartAnalysis}
                  SmartWeaponCard={() => null}
                  isAdmin={isAdmin}
                  setShowAddWeaponModal={() => {}}
                  SubtleAdBanner={SubtleAdBanner}
                />
              </PageWrapper>
            } />

            <Route path="/calculator" element={
              <PageWrapper title="حساب النقاط والكونكر" subtitle="احسب نقاطك المتوقعة للوصول لتقييم الغازي (Conqueror) بضغطة واحدة">
                <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                  <ConquerorCalculator SubtleAdBanner={SubtleAdBanner} />
                </Suspense>
              </PageWrapper>
            } />

            <Route path="/news" element={
              <PageWrapper title="آخر الأخبار" subtitle="ابقَ على اطلاع بأحدث التسريبات، التحديثات، وأخبار مجتمع ببجي موبايل">
                <NewsPage 
                  SubtleAdBanner={SubtleAdBanner} 
                  news={filteredNews} 
                  isAdmin={isAdmin} 
                  onDelete={(id) => deleteItem('news', id)} 
                  onToggleVisibility={handleToggleVisibility}
                  loading={loadingNews}
                />
              </PageWrapper>
            } />

            <Route path="/ads" element={
              <PageWrapper title="إعلانات وخدمات" subtitle="مركز العروض والخدمات المميزة المتاحة لأعضاء منصتنا">
                <AdsPage 
                  ads={filteredAds} 
                  getIcon={getIconComponent} 
                  isAdmin={isAdmin} 
                  onDelete={(id) => deleteItem('ads', id)} 
                  onToggleVisibility={handleToggleVisibility}
                />
              </PageWrapper>
            } />

            <Route path="/terms" element={
              <PageWrapper hideHeader>
                <TermsPage />
              </PageWrapper>
            } />

            <Route path="/privacy" element={
              <PageWrapper hideHeader>
                <PrivacyPage />
              </PageWrapper>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="mt-[28px] border-t border-white/10 bg-[#070707] lg:h-[120px] py-8 lg:py-0 px-[16px] md:px-[32px] lg:px-[72px] flex items-center shrink-0">
        <div className="max-w-[1360px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="flex flex-col lg:flex-row items-center gap-4 text-center lg:text-right">
                <h1 className="flex items-center gap-2 justify-center lg:justify-end cursor-pointer" onClick={() => navigate('/')}>
                  <div className="relative scale-90">
                    <div className="h-[28px] flex items-center px-1.5 border-[2.5px] border-pubg-gold bg-pubg-gold/10 text-pubg-gold text-[16px] font-[900] tracking-tighter rounded-sm uppercase">
                      ZONE
                    </div>
                  </div>
                  <span className="text-white text-[18px] font-[800]">PUBG</span>
                </h1>
                <p className="text-[#A1A1AA] text-[13px] mt-1 lg:mt-0 max-w-xs leading-relaxed">
                  منصة عربية متخصصة في أخبار وتحديثات ببجي موبايل، أكواد الحساسية، وإعدادات اللاعبين.
                </p>
             </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[13px] text-[#D4D4D8] font-[600]">
            <button onClick={() => navigate('/privacy')} className="hover:text-primary transition flex items-center gap-2">
              <Shield size={14} className="text-primary/70" />
              <span>Privacy Policy | سياسة الخصوصية</span>
            </button>
            <button onClick={() => navigate('/terms')} className="hover:text-primary transition flex items-center gap-2">
              <Scale size={14} className="text-primary/70" />
              <span>Terms of Service | شروط الاستخدام</span>
            </button>
            <a href="mailto:support@zonepubg.com" className="hover:text-primary transition flex items-center gap-2">
              <MessageSquare size={14} className="text-primary/70" />
              <span>Contact | تواصل معنا</span>
            </a>
            <button onClick={() => navigate('/dashboard')} className="hover:text-primary transition">من نحن</button>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4">
            <span className="text-[#D4D4D8] font-[700] text-[13px]">تابعنا على</span>
            <div className="flex gap-3">
               <a href="#" className="w-[36px] h-[36px] rounded-full border border-white/10 flex items-center justify-center text-[#D4D4D8] hover:text-primary hover:border-primary/50 transition"><Youtube size={18} /></a>
               <a href="#" className="w-[36px] h-[36px] rounded-full border border-white/10 flex items-center justify-center text-[#D4D4D8] hover:text-primary hover:border-primary/50 transition"><Twitter size={18} /></a>
               <a href="#" className="w-[36px] h-[36px] rounded-full border border-white/10 flex items-center justify-center text-[#D4D4D8] hover:text-primary hover:border-primary/50 transition"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showMobileMenu && (
          <div className="fixed inset-0 z-[1000] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-bg-dark border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pubg-gold/20 rounded-xl flex items-center justify-center border border-pubg-gold/30">
                    <Shield className="text-pubg-gold" size={24} />
                  </div>
                  <h1 className="flex items-center gap-2">
                    <div className="relative scale-90 origin-right">
                      <div className="h-[28px] flex items-center px-1.5 border-[2.5px] border-pubg-gold bg-pubg-gold/10 text-pubg-gold text-[16px] font-[900] tracking-tighter rounded-sm">
                        PUBG
                      </div>
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-pubg-gold"></div>
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-pubg-gold"></div>
                    </div>
                    <span className="text-white text-[18px] font-[800]">ZONE</span>
                  </h1>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6">
                <div className="flex flex-col gap-2">
                  <button onClick={() => { navigate("/"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Home size={20} />
                    <span>الرئيسية</span>
                  </button>
                  <button onClick={() => { navigate("/news"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/news' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Globe size={20} />
                    <span>الأخبار والتسريبات</span>
                  </button>

                  <div className="pt-4 pb-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">مجتمعنا</div>
                  <button onClick={() => { navigate("/giveaways"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/giveaways' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Gift size={20} />
                    <span>السحوبات</span>
                  </button>
                  <button onClick={() => { navigate("/events"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/events' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Calendar size={20} />
                    <span>الفعاليات</span>
                  </button>

                  <div className="pt-4 pb-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">أدوات اللاعبين</div>
                  <button onClick={() => { navigate("/sensitivity"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/sensitivity' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Target size={20} />
                    <span>الحساسية</span>
                  </button>
                  <button onClick={() => { navigate("/calculator"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/calculator' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <BarChart3 size={20} />
                    <span>حاسبة التقييم</span>
                  </button>
                  <button onClick={() => { navigate("/loadouts"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/loadouts' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Settings2 size={20} />
                    <span>العتاد</span>
                  </button>
                  <button onClick={() => { navigate("/rate"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/rate' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Video size={20} />
                    <span>اللقطات</span>
                  </button>

                  <div className="pt-4 pb-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">خصائص ومزايا</div>
                  <button onClick={() => { navigate("/characters"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/characters' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Users size={20} />
                    <span>الشخصيات</span>
                  </button>
                  <button onClick={() => { navigate("/compare"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/compare' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Sword size={20} />
                    <span>الأسلحة</span>
                  </button>
                  <button onClick={() => { navigate("/loadouts"); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all text-right ${location.pathname === '/loadouts' ? "bg-primary text-black" : "bg-white/5 text-slate-300 active:bg-white/10"}`}>
                    <Package size={20} />
                    <span>القطع</span>
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                {userProfile ? (
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                       {userProfile.photoURL ? (
                         <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
                       ) : (
                         <UserIcon size={24} className="text-primary" />
                       )}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-white font-black text-sm">{userProfile.displayName || "Gamer"}</span>
                      <span className="text-primary text-[10px] font-black uppercase tracking-widest">{userProfile.role}</span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full btn-gold py-4 rounded-2xl font-black uppercase tracking-widest"
                  >
                    تسجيل الدخول
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          showNotification={showNotification}
          onLoginSuccess={() => setIsAuthModalOpen(false)}
        />
      </Suspense>

      <ContentEditorModal
        isOpen={!!isAddingContent || !!isEditingWeapon || !!isEditingAttachment || !!isEditingCharacter || !!isEditingProPlayer}
        type={isAddingContent || (isEditingWeapon ? 'weapon' : isEditingAttachment ? 'attachment' : isEditingCharacter ? 'character' : isEditingProPlayer ? 'player' : null)}
        data={editingContentData || {}}
        setData={setEditingContentData}
        onSave={handleSaveContent}
        onClose={() => {
          setIsAddingContent(null);
          setIsEditingWeapon(null);
          setIsEditingAttachment(null);
          setIsEditingCharacter(null);
          setIsEditingProPlayer(null);
          setEditingContentData(null);
        }}
        isSaving={isUpdatingSettings}
      />

      <AnimatePresence>
        {globalNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl backdrop-blur-xl border ${
              globalNotification.type === "success"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : globalNotification.type === "error"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
            }`}
          >
            {globalNotification.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            {globalNotification.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

