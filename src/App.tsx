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
  ChevronDown,
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
  Info,
  Settings,
  Save,
  PowerOff,
  ShieldCheck,
  AlertTriangle,
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
  Facebook,
  AlertCircle
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
} from "./firebase";
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
const AuthModal = lazy(() => import("./components/AuthModal"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ConquerorCalculator = lazy(() => import("./components/ConquerorCalculator"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const CharactersPage = lazy(() => import("./pages/CharactersPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoadoutsPage = lazy(() => import("./pages/LoadoutsPage"));
const SensitivityPage = lazy(() => import("./pages/SensitivityPage"));
const RatePage = lazy(() => import("./pages/RatePage"));
const GameEventsPage = lazy(() => import("./pages/GameEventsPage"));
const GiveawaysPage = lazy(() => import("./pages/GiveawaysPage"));
const AdsPage = lazy(() => import("./pages/AdsPage"));

import OptimizedImage from "./components/OptimizedImage";
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
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
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
                  {tournament.id === 'daily-tournament' ? 'البطولة اليومية الكبرى' : 'بطولة ببجيكوم الخاصة'}
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
  const [selectedDevice, setSelectedDevice] = useState<Device>(DEVICES[0]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isRefreshingRankings, setIsRefreshingRankings] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.substring(1) || "home";

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const setActiveTab = (tab: string) => {
    navigate(tab === "home" ? "/" : `/${tab}`);
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

  // Firebase State
  const [user, setUser] = useState<User | null>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const activeUser = user || localUser;
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
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  // Auth & Profile Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      setLoadingFirebase(false);

      if (currentUser) {
        // التحقق من عدم استخدام نفس الإيميل لأكثر من مستخدم
        try {
          const emailQuery = query(
            collection(db, "users"),
            where("email", "==", currentUser.email),
            limit(2)
          );
          const emailSnap = await getDocs(emailQuery);
          const otherUser = emailSnap.docs.find(d => d.id !== currentUser.uid);

          if (otherUser) {
            showNotification("هذا البريد الإلكتروني مستخدم بالفعل بحساب آخر. يرجى استخدام حسابك الأصلي.", "error");
            await logout();
            return;
          }
        } catch (error) {
          console.error("Error checking email uniqueness:", error);
        }

        const profileRef = doc(db, "users", currentUser.uid);

        try {
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            const data = profileSnap.data() as UserProfile;
            
            // Check if user is banned
            if (data.isBanned || data.status === 'suspended') {
              showNotification("عذراً، تم حظر حسابك من قبل الإدارة.", "error");
              await logout();
              return;
            }

            // تحديث الرتبة تلقائياً إذا كان الإيميل هو إيميل الأدمن
            if (currentUser.email === ADMIN_EMAIL && data.role !== "admin") {
              await updateDoc(profileRef, { role: "admin" });
              data.role = "admin";
            }

            // تحديث وقت آخر دخول
            await updateDoc(profileRef, { lastLoginAt: new Date() });
            
            setUserProfile({ ...data, lastLoginAt: new Date() });
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "لاعب ببجي",
              role: currentUser.email === ADMIN_EMAIL ? "admin" : "user",
              createdAt: new Date(),
              lastLoginAt: new Date(),
              settings: {
                camera: {
                  noScope: 120,
                  redDot: 60,
                  scope2x: 36,
                  scope3x: 27,
                  scope4x: 17,
                  scope6x: 14,
                  scope8x: 12,
                },
                ads: {
                  noScope: 120,
                  redDot: 60,
                  scope2x: 36,
                  scope3x: 27,
                  scope4x: 17,
                  scope6x: 14,
                  scope8x: 12,
                },
                gyroscope: {
                  noScope: 300,
                  redDot: 300,
                  scope2x: 280,
                  scope3x: 220,
                  scope4x: 200,
                  scope6x: 160,
                  scope8x: 120,
                },
              },
            };

            await setDoc(profileRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(
            error,
            OperationType.GET,
            `users/${currentUser.uid}`
          );
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ معالجة نتيجة Google Redirect عند عودة المستخدم للصفحة
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
    const unsubEvents = onSnapshot(
      collection(db, "events"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "events")
    );

    const unsubGiveaways = onSnapshot(
      collection(db, "giveaways"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Giveaway[];
        setGiveaways(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "giveaways")
    );

    const unsubRankings = onSnapshot(
      query(collection(db, "rankings"), orderBy("rank", "asc")),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ranking[];
        setRankings(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "rankings")
    );

    // ✅ هذا اللي أضفناه
    const unsubSensitivityRatings = onSnapshot(
      collection(db, "sensitivityRatings"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SensitivityRating[];
        setSensitivityRatings(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "sensitivityRatings")
    );

    const unsubWeapons = onSnapshot(
      collection(db, "weapons"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Weapon[];
        setDbWeapons(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "weapons")
    );

    const unsubAttachments = onSnapshot(
      collection(db, "attachments"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Attachment[];
        setDbAttachments(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "attachments")
    );

    const unsubDevices = onSnapshot(
      collection(db, "devices"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Device[];
        setDbDevices(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "devices")
    );

    const unsubPlayers = onSnapshot(
      collection(db, "players"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Device[];
        setDbPlayers(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "players")
    );

    const unsubAds = onSnapshot(
      collection(db, "ads"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ad[];
        setAds(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "ads")
    );

    const unsubCharacters = onSnapshot(
      collection(db, "characters"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Character[];
        setDbCharacters(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "characters")
    );

    const unsubCompetitionSettings = onSnapshot(
      collection(db, "competitionSettings"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
        setCompetitionSettings(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "competitionSettings")
    );

    const unsubClips = onSnapshot(
      collection(db, "clips"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Clip[];
        setClips(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "clips")
    );

    const unsubComments = onSnapshot(
      collection(db, "comments"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NewsComment[];
        setComments(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "comments")
    );

    const unsubGiveawayEntries = onSnapshot(
      collection(db, "giveawayEntries"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GiveawayEntry[];
        setGiveawayEntries(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "giveawayEntries")
    );

    const unsubGiveawayWinners = onSnapshot(
      collection(db, "giveawayWinners"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GiveawayWinner[];
        setGiveawayWinners(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "giveawayWinners")
    );

    return () => {
      unsubEvents();
      unsubGiveaways();
      unsubRankings();
      unsubSensitivityRatings();
      unsubWeapons();
      unsubAttachments();
      unsubDevices();
      unsubPlayers();
      unsubAds();
      unsubCharacters();
      unsubCompetitionSettings();
      unsubClips();
      unsubComments();
      unsubGiveawayEntries();
      unsubGiveawayWinners();
    };
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
    const unsubStats = onSnapshot(doc(db, "siteStats", "global"), (snap) => {
      if (snap.exists()) {
        setSiteStats(snap.data() as SiteStats);
      } else {
        // Initialize stats if not exists
        setDoc(doc(db, "siteStats", "global"), {
          visitors: 0,
          totalParticipations: 0,
          updatedAt: serverTimestamp()
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "siteStats/global");
    });
    return () => unsubStats();
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });
  
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

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

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

  const isAdmin = activeUser?.email === ADMIN_EMAIL || userProfile?.role === "admin";

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

    const unsubImages = onSnapshot(
      collection(db, "imageLibrary"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as { id: string; url: string; name: string }[];
        setDbImages(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "imageLibrary")
    );

    return () => unsubImages();
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
        authorId: activeUser?.uid || "",
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
    setDbWeapons(WEAPONS);
  }, []);

  useEffect(() => {
    // No defaults to add in frontend-only mode
  }, []);

  const currentWeapons = [...WEAPONS.filter(w => !dbWeapons.find(dbw => dbw.id === w.id)), ...dbWeapons];
  const currentAttachments = [...ATTACHMENTS.filter(a => !dbAttachments.find(dba => dba.id === a.id)), ...dbAttachments];
  const currentCharacters = [...CHARACTERS.filter(c => !dbCharacters.find(dbc => dbc.id === c.id)), ...dbCharacters];
  const currentProPlayers = [...PRO_PLAYERS.filter(p => !dbPlayers.find(dbp => dbp.id === p.id)), ...dbPlayers.filter(p => p.brand === 'Pro Player')];

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
    if (updated && JSON.stringify(updated) !== JSON.stringify(selectedDevice)) {
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
      setLocalUser(mockUser);
      
      // إنشاء بروفايل محلي أيضاً
      const mockProfile: UserProfile = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        role: mockUser.email === ADMIN_EMAIL ? "admin" : "user",
        settings: {
          camera: { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
          ads: { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
          gyroscope: { noScope: 300, redDot: 300, scope2x: 280, scope3x: 220, scope4x: 200, scope6x: 160, scope8x: 120 }
        }
      };
      setUserProfile(mockProfile);
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
      setUser(null);
      setLocalUser(null);
      setUserProfile(null);
      showNotification("تم تسجيل الخروج", "info");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
      authorEmail: activeUser?.email || "",
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
      title: "بطولة ببجيكوم الكبرى",
      description:
        "انضم إلينا في أكبر بطولة لهذا الشهر مع جوائز قيمة تصل إلى 10,000 شدة!",
      date: new Date().toISOString(),
      status: "upcoming",
      isHidden: false,
      authorEmail: activeUser?.email || "",
      createdAt: new Date().toISOString(),
      authorId: activeUser?.uid || "",
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
              href={ad.url}
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
    { id: "events", label: "البطولات", path: "/events" },
    { id: "giveaways", label: "السحوبات", path: "/giveaways" },
    { id: "ads", label: "مجتمعنا", path: "/ads" },
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-text-main font-sans selection:bg-primary/30 selection:text-white flex flex-col">
      <header className="sticky top-0 z-[100] bg-bg-dark/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                <GameImage src="/logo.png" alt="ببجيكوم" className="w-full h-full" />
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl font-black tracking-tight gold-shimmer mb-0">
                  ببجيكوم
                </h1>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">
                  PUBGCOM<br/>PRO
                </span>
              </div>
            </div>

            <button className="hidden lg:flex w-10 h-10 rounded-xl bg-[#111] text-slate-300 hover:text-white border border-white/5 items-center justify-center hover:bg-white/5 transition-all outline-none">
              <Sun size={18} />
            </button>

            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className={`group/nav relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                  location.pathname === "/"
                    ? "text-primary bg-primary/5"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Home size={16} className={`transition-transform duration-300 ${location.pathname === "/" ? "" : "group-hover/nav:scale-110 group-hover/nav:text-primary"}`} />
                <span className="relative z-10 whitespace-nowrap">الرئيسية</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover/nav:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${location.pathname === "/" ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
              </button>
              
              <button
                onClick={() => navigate("/news")}
                className={`group/nav relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                  location.pathname === "/news"
                    ? "text-primary bg-primary/5"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Globe size={16} className={`transition-transform duration-300 ${location.pathname === "/news" ? "" : "group-hover/nav:scale-110 group-hover/nav:text-primary"}`} />
                <span className="relative z-10 whitespace-nowrap">الاخبار</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover/nav:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${location.pathname === "/news" ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
              </button>
              
              <button
                onClick={() => navigate("/events")}
                className={`group/nav relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                  location.pathname === "/events"
                    ? "text-primary bg-primary/5"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar size={16} className={`transition-transform duration-300 ${location.pathname === "/events" ? "" : "group-hover/nav:scale-110 group-hover/nav:text-primary"}`} />
                <span className="relative z-10 whitespace-nowrap">فعاليات اللعبة</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover/nav:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${location.pathname === "/events" ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
              </button>

              <div className="relative group">
                <button className={`group/nav relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                  ['/characters'].includes(location.pathname) ? 'text-primary bg-primary/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                  <Sparkles size={16} className={`transition-transform duration-300 ${['/characters'].includes(location.pathname) ? '' : 'group-hover/nav:scale-110 group-hover/nav:text-primary'}`} />
                  <span className="relative z-10 whitespace-nowrap">مميزات وخصائص</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover/nav:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${['/characters'].includes(location.pathname) ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
                </button>
                <div className="absolute top-full right-0 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_15px_rgba(212,175,55,0.1)] p-2 flex flex-col gap-1 overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#D4AF37]/5 before:to-transparent before:pointer-events-none">
                    {[
                      { tab: 'characters', label: 'الشخصيات', icon: Users },
                      { tab: 'weapons', label: 'الأسلحة', icon: Crosshair },
                      { tab: 'attachments', label: 'قطع الأسلحة', icon: Settings2 }
                    ].map((item) => {
                      const isActive = location.pathname === '/characters' && (new URLSearchParams(location.search).get('tab') === item.tab || (!new URLSearchParams(location.search).get('tab') && item.tab === 'characters'));
                      return (
                      <button 
                        key={item.tab}
                        onClick={() => navigate(`/characters?tab=${item.tab}`)} 
                        className={`group/item relative flex items-center gap-3 w-full px-3 py-3 text-right font-bold text-sm transition-all rounded-xl overflow-hidden
                          ${isActive ? 'text-primary' : 'text-slate-300 hover:text-white'}
                        `}
                      >
                        <div className={`p-2 rounded-lg transition-colors z-10 ${isActive ? 'bg-[#D4AF37]/20 text-primary' : 'bg-white/5 text-slate-400 group-hover/item:bg-[#D4AF37]/20 group-hover/item:text-primary'}`}>
                          <item.icon size={16} />
                        </div>
                        <span className="relative z-10">{item.label}</span>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${isActive ? 'w-full' : 'w-0 group-hover/item:w-full'}`} />
                      </button>
                    )})}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className={`group/nav relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                  ['/sensitivity', '/loadouts', '/compare', '/calculator', '/rate'].includes(location.pathname) ? 'text-primary bg-primary/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                  <Target size={14} className={`transition-transform duration-300 ${['/sensitivity', '/loadouts', '/compare', '/calculator', '/rate'].includes(location.pathname) ? '' : 'group-hover/nav:scale-110 group-hover/nav:text-primary'}`} />
                  <span className="relative z-10 whitespace-nowrap">أدوات اللاعبين</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover/nav:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${['/sensitivity', '/loadouts', '/compare', '/calculator', '/rate'].includes(location.pathname) ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
                </button>
                <div className="absolute top-full right-0 pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_15px_rgba(212,175,55,0.1)] p-2 flex flex-col gap-1 overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#D4AF37]/5 before:to-transparent before:pointer-events-none">
                    {[
                      { path: '/sensitivity', label: 'الحساسية', icon: Target },
                      { path: '/loadouts', label: 'القطع', icon: Wrench },
                      { path: '/compare', label: 'مقارنة', icon: ArrowLeftRight },
                      { path: '/calculator', label: 'حاسبة التقييم', icon: BarChart3 },
                      { path: '/rate', label: 'تحليل', icon: TrendingUp }
                    ].map((item) => (
                      <button 
                        key={item.path}
                        onClick={() => navigate(item.path)} 
                        className={`group/item relative flex items-center gap-3 w-full px-3 py-2.5 text-right font-bold text-[13px] transition-all rounded-xl overflow-hidden
                          ${location.pathname === item.path ? 'text-primary' : 'text-slate-300 hover:text-white'}
                        `}
                      >
                        <div className={`p-2 rounded-lg transition-colors z-10 ${location.pathname === item.path ? 'bg-[#D4AF37]/20 text-primary' : 'bg-white/5 text-slate-400 group-hover/item:bg-[#D4AF37]/20 group-hover/item:text-primary'}`}>
                          <item.icon size={16} />
                        </div>
                        <span className="relative z-10">{item.label}</span>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/item:w-full'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className={`group/nav relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                  ['/giveaways', '/ads'].includes(location.pathname) ? 'text-primary bg-primary/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                  <Users size={14} className={`transition-transform duration-300 ${['/giveaways', '/ads'].includes(location.pathname) ? '' : 'group-hover/nav:scale-110 group-hover/nav:text-primary'}`} />
                  <span className="relative z-10 whitespace-nowrap">مجتمعنا</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover/nav:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${['/giveaways', '/ads'].includes(location.pathname) ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
                </button>
                <div className="absolute top-full right-0 pt-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_15px_rgba(212,175,55,0.1)] p-2 flex flex-col gap-1 overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#D4AF37]/5 before:to-transparent before:pointer-events-none">
                    {[
                      { path: '/giveaways', label: 'السحوبات', icon: Gift },
                      { path: '/ads', label: 'مجتمعنا', icon: Megaphone }
                    ].map((item) => (
                      <button 
                        key={item.path}
                        onClick={() => navigate(item.path)} 
                        className={`group/item relative flex items-center gap-3 w-full px-3 py-3 text-right font-bold text-[13px] transition-all rounded-xl overflow-hidden
                          ${location.pathname === item.path ? 'text-primary' : 'text-slate-300 hover:text-white'}
                        `}
                      >
                        <div className={`p-2 rounded-lg transition-colors z-10 ${location.pathname === item.path ? 'bg-[#D4AF37]/20 text-primary' : 'bg-white/5 text-slate-400 group-hover/item:bg-[#D4AF37]/20 group-hover/item:text-primary'}`}>
                          <item.icon size={16} />
                        </div>
                        <span className="relative z-10">{item.label}</span>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <div className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-[#D4AF37] to-transparent transition-all duration-300 ease-out z-10 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/item:w-full'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
            
            <AnimatePresence>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors border ${
                  location.pathname === "/dashboard"
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-primary/50 text-primary hover:bg-primary/10"
                }`}
              >
                <span className="hidden sm:inline">لوحة التحكم</span>
                <Shield size={16} />
              </button>
            )}

            {userProfile ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-[#111] pr-4 pl-2 py-1.5 rounded-xl border border-white/5 shadow-sm">
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-bold text-white leading-tight font-sans" style={{ direction: 'ltr' }}>
                      {userProfile.displayName || "User"}
                    </span>
                    <span className="text-[10px] text-primary font-bold tracking-widest text-right">{userProfile.role === 'admin' ? 'ADMIN' : 'PLAYER'}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-black">
                    <UserIcon size={20} />
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-12 h-12 rounded-xl bg-[#111] text-slate-300 hover:text-white border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} className="transform rotate-180" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-12 h-12 rounded-xl bg-primary text-black hover:scale-105 transition-all border border-primary/20 shadow-[0_0_15px_rgba(242,169,0,0.3)] flex items-center justify-center font-bold"
              >
                <UserIcon size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="lg:hidden mt-4 pt-4 border-t border-white/5 mx-[-1rem] px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {navLinks.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-[12px] flex items-center gap-2 transition-all ${
                  (location.pathname + location.search === tab.path) || (location.pathname === tab.path && location.search === "") || (location.pathname === "/characters" && tab.path === "/characters" && location.search === "?tab=characters")
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(242,169,0,0.6)] scale-105"
                    : tab.highlight
                    ? "bg-primary/10 text-primary border border-primary/30 drop-shadow-[0_0_8px_rgba(242,169,0,0.5)]"
                    : "bg-white/5 text-slate-300 border border-transparent hover:border-white/10"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 sm:px-6 py-6 sm:py-12 mb-20 lg:mb-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={
              !userProfile ? (
                <motion.div key="login" className="pro-card p-12 text-center">
                  <h2 className="text-2xl font-black mb-4">تسجيل الدخول مطلوب</h2>
                  <button onClick={() => setIsAuthModalOpen(true)} className="btn-gold px-8 py-3 rounded-xl font-black">
                    تسجيل الدخول الآن
                  </button>
                </motion.div>
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
                    isTournamentsHidden={false}
                    onToggleTournaments={() => {}}
                    isCommentsEnabled={true}
                    onToggleComments={() => {}}
                    competitionSettings={[]}
                    onUpdateCompetitionSettings={async () => {}}
                    isUpdatingSettings={false}
                    onSyncData={async () => {}}
                    isLogoHidden={false}
                    onToggleLogo={() => {}}
                  />
                </Suspense>
              )
            } />

            <Route path="/" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <HomePage
                  news={news}
                  loadingNews={loadingNews}
                  clips={clips}
                  ads={ads}
                  rankings={rankings}
                  competitionSettings={competitionSettings}
                  isAdmin={isAdmin}
                  setActiveTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
                  SubtleAdBanner={SubtleAdBanner}
                  TournamentFlashBanner={() => null}
                  OfficialGlobalTournaments={() => null}
                />
              </Suspense>
            } />

            <Route path="/sensitivity" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <SensitivityPage
                  SubtleAdBanner={SubtleAdBanner}
                  isAdmin={isAdmin}
                  currentWeapons={dbWeapons}
                  handleCopy={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  copied={copied}
                  user={userProfile}
                  handleLogin={() => setIsAuthModalOpen(true)}
                  showNotification={showNotification}
                />
              </Suspense>
            } />

            <Route path="/characters" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <CharactersPage
                  currentCharacters={dbCharacters}
                  currentWeapons={dbWeapons}
                  currentAttachments={dbAttachments}
                  isAdmin={isAdmin}
                  deleteItem={deleteItem}
                  setEditingContentData={setEditingContentData}
                  setIsEditingCharacter={setIsEditingCharacter}
                  setIsEditingWeapon={setIsEditingWeapon}
                  setIsEditingAttachment={setIsEditingAttachment}
                  setIsAddingContent={setIsAddingContent}
                  groupedWeapons={{}}
                  categoryNames={{}}
                  attachmentTypes={{}}
                />
              </Suspense>
            } />

            <Route path="/loadouts" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <LoadoutsPage
                  currentWeapons={dbWeapons}
                  currentAttachments={dbAttachments}
                  weaponRatings={weaponRatings}
                  categoryNames={{}}
                  getWeaponProTip={getWeaponProTip}
                  setSelectedWeaponToRate={setSelectedWeaponToRate}
                  setIsRatingModalOpen={setIsRatingModalOpen}
                  SubtleAdBanner={SubtleAdBanner}
                />
              </Suspense>
            } />

            <Route path="/events" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <EventsPage
                  isAdmin={isAdmin}
                  user={userProfile as any}
                  userProfile={userProfile}
                  competitionSettings={[]}
                  clips={clips}
                  comments={[]}
                  handleUpdateCompetitionSettings={async () => {}}
                  isUpdatingSettings={false}
                  showNotification={showNotification}
                  onLogin={() => setIsAuthModalOpen(true)}
                />
              </Suspense>
            } />

            <Route path="/rate" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
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
                  clips={clips}
                  searchQuery={""}
                  setSearchQuery={() => {}}
                  selectedCategory={"all"}
                  setSelectedCategory={() => {}}
                  isAdmin={isAdmin}
                  deleteItem={deleteItem}
                  user={userProfile}
                  handleLogin={() => setIsAuthModalOpen(true)}
                />
              </Suspense>
            } />

            <Route path="/game-events" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <GameEventsPage
                  gameEvents={events}
                  getTimeRemaining={() => {}}
                />
              </Suspense>
            } />

            <Route path="/giveaways" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <GiveawaysPage
                  activeGiveaway={giveaways[0]}
                  isJoiningGiveaway={false}
                  handleJoinGiveaway={() => {}}
                  hasJoinedGiveaway={false}
                  previousGiveaways={giveaways}
                  getGiveawayStatus={() => {}}
                  user={userProfile}
                  handleLogin={() => setIsAuthModalOpen(true)}
                  isAdmin={isAdmin}
                  isCompetitionActive={isCompetitionActive}
                  giveaways={giveaways}
                  showNotification={showNotification}
                  deleteItem={deleteItem}
                  addGiveaway={addGiveaway}
                  getIconComponent={getIconComponent}
                  templates={templates}
                  setShowAddTemplateModal={setShowAddTemplateModal}
                />
              </Suspense>
            } />

            <Route path="/compare" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <ComparePage
                  currentWeapons={dbWeapons}
                  groupedWeapons={{}}
                  categoryNames={{}}
                  getWeaponSmartAnalysis={() => {}}
                  SmartWeaponCard={() => null}
                  isAdmin={isAdmin}
                  setShowAddWeaponModal={() => {}}
                  SubtleAdBanner={SubtleAdBanner}
                />
              </Suspense>
            } />

            <Route path="/calculator" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <ConquerorCalculator SubtleAdBanner={SubtleAdBanner} />
              </Suspense>
            } />

            <Route path="/news" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <NewsPage SubtleAdBanner={SubtleAdBanner} />
              </Suspense>
            } />

            <Route path="/ads" element={
              <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <AdsPage ads={ads} getIcon={getIconComponent} />
              </Suspense>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 px-6 bg-bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-80">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 overflow-hidden">
              <GameImage src="/logo.png" alt="ببجيكوم" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg gold-shimmer">ببجيكوم</span>
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          showNotification={showNotification}
          onLoginSuccess={() => setIsAuthModalOpen(false)}
        />
      </Suspense>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl backdrop-blur-xl border ${
              notification.type === "success"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : notification.type === "error"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

