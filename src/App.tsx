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
import { fetchLatestRankings } from "./services/rankingService";
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
const Chatbot = lazy(() => import("./components/Chatbot"));
const AuthModal = lazy(() => import("./components/AuthModal"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const ConquerorCalculator = lazy(() => import("./components/ConquerorCalculator"));
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

// دالة تحديد فئة السلاح بالعربية
function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    AR: "رشاش هجومي",
    SMG: "رشاش صغير",
    Sniper: "قنص",
    DMR: "رامية دقيقة",
    LMG: "رشاش ثقيل",
    Shotgun: "رمحة صيد",
  };
  return map[type] || type;
}

// دالة تحديد السيناريو المناسب لكل فئة
function getTypeScenario(type: string): { closeWeight: number; longWeight: number; note: string } {
  switch (type) {
    case "Shotgun": return { closeWeight: 1.0, longWeight: 0.0, note: "فعال حصرًا في المسافات القصيرة جداً" };
    case "SMG":     return { closeWeight: 0.9, longWeight: 0.1, note: "متخصص للمواجهات القريبة والمتوسطة" };
    case "Sniper":  return { closeWeight: 0.0, longWeight: 1.0, note: "متخصص للمواجهات البعيدة جداً" };
    case "DMR":     return { closeWeight: 0.3, longWeight: 0.7, note: "أفضل في المتوسطة إلى البعيدة" };
    case "LMG":     return { closeWeight: 0.5, longWeight: 0.5, note: "متوازن بين المسافات" };
    default:        return { closeWeight: 0.6, longWeight: 0.4, note: "متوازن لجميع المسافات" }; // AR
  }
}

function buildComparisonAdvice(
  weapon1: any,
  weapon2: any,
  distance: number
): ComparisonAdvice {
  if (!weapon1 || !weapon2) {
    return {
      closeRange: "اختر سلاحين لعرض تحليل المواجهات القريبة.",
      longRange: "اختر سلاحين لعرض تحليل المواجهات البعيدة.",
      tabletAdvice: "سيتم عرض نصائح التابلت بعد اختيار السلاحين.",
      mobileAdvice: "سيتم عرض نصائح الجوال بعد اختيار السلاحين.",
      source: "Local Weapon Data",
      updatedAt: new Date().toLocaleString("ar-SA"),
    };
  }

  const n1  = getWeaponLabel(weapon1, "السلاح 1");
  const n2  = getWeaponLabel(weapon2, "السلاح 2");
  const id1 = (weapon1?.id || "").toLowerCase();
  const id2 = (weapon2?.id || "").toLowerCase();

  // الأولوية لخصائص السلاح המباشرة
  const db1 = {
    damage: getWeaponValue(weapon1, ["damage"], 40),
    recoil: getWeaponValue(weapon1, ["recoil"], 50),
    speed:  getWeaponValue(weapon1, ["speed"],  50),
    range:  getWeaponValue(weapon1, ["range"],  50),
    type:   weapon1?.type ?? "AR",
  };
  const db2 = {
    damage: getWeaponValue(weapon2, ["damage"], 40),
    recoil: getWeaponValue(weapon2, ["recoil"], 50),
    speed:  getWeaponValue(weapon2, ["speed"],  50),
    range:  getWeaponValue(weapon2, ["range"],  50),
    type:   weapon2?.type ?? "AR",
  };

  const d1 = db1.damage;  const d2 = db2.damage;
  const r1 = db1.recoil;  const r2 = db2.recoil;
  const s1 = db1.speed;   const s2 = db2.speed;
  const g1 = db1.range;   const g2 = db2.range;
  const t1 = db1.type;    const t2 = db2.type;
  // الثبات = عكس الارتداد (كلما قل الارتداد، زاد الثبات)
  const stab1 = 100 - r1; const stab2 = 100 - r2;

  const type1Label = getTypeLabel(t1);
  const type2Label = getTypeLabel(t2);
  const sc1 = getTypeScenario(t1);
  const sc2 = getTypeScenario(t2);

  // ===== معادلات التقييم الشاملة مع مراعاة فئة السلاح =====
  // قريب: ضرر 35% + سرعة 40% + ثبات 25%
  const rawClose1 = d1 * 0.35 + s1 * 0.40 + stab1 * 0.25;
  const rawClose2 = d2 * 0.35 + s2 * 0.40 + stab2 * 0.25;
  // بعيد: ضرر 35% + ثبات 35% + مدى 30%
  const rawLong1  = d1 * 0.35 + stab1 * 0.35 + g1 * 0.30;
  const rawLong2  = d2 * 0.35 + stab2 * 0.35 + g2 * 0.30;

  // تعديل النتيجة بمعامل فئة السلاح (Shotgun يسيطر قريباً، Sniper يسيطر بعيداً)
  const closeScore1 = rawClose1 * sc1.closeWeight + rawLong1 * (1 - sc1.closeWeight) * 0.2;
  const closeScore2 = rawClose2 * sc2.closeWeight + rawLong2 * (1 - sc2.closeWeight) * 0.2;
  const longScore1  = rawLong1  * sc1.longWeight  + rawClose1 * (1 - sc1.longWeight)  * 0.2;
  const longScore2  = rawLong2  * sc2.longWeight  + rawClose2 * (1 - sc2.longWeight)  * 0.2;

  // تحديد الفائز (عتبة 3 نقاط للتمييز بين التفوق والتعادل)
  const closeWin = closeScore1 > closeScore2 + 3 ? 1 : closeScore2 > closeScore1 + 3 ? 2 : 0;
  const longWin  = longScore1  > longScore2  + 3 ? 1 : longScore2  > longScore1  + 3 ? 2 : 0;

  // ===== دوال بناء النصوص التحليلية التفصيلية =====
  const buildClose = (wi: 1 | 2): string => {
    const [wn, ln]                     = wi === 1 ? [n1, n2]                       : [n2, n1];
    const [wd, wr, ws, wg, wt]  = wi === 1 ? [d1, r1, s1, g1, t1] : [d2, r2, s2, g2, t2];
    const [ld, lr, ls, lg, lt]  = wi === 1 ? [d2, r2, s2, g2, t2] : [d1, r1, s1, g1, t1];
    const reasons: string[] = [];

    // أولوية فئة السلاح في المواجهات القريبة
    if (wt === "Shotgun" && lt !== "Shotgun") {
      reasons.push(`كونه رمحة صيد (ضرر ${wd}/100) يجعله الأفتك في المسافات القصيرة جداً — طلقة أو اثنتان كافيتان للإسقاط`);
    } else if (lt === "Sniper" && wt !== "Sniper") {
      reasons.push(`لأن ${ln} (قنص) بطيء الإطلاق (${ls}/100) مما يجعله في وضع ضعيف في الاشتباكات السريعة القريبة`);
    } else if (wt === "SMG" && (lt === "AR" || lt === "LMG")) {
      reasons.push(`كونه رشاشاً صغيراً بسرعة إطلاق عالية (${ws}/100) وارتداد منخفض (${wr}/100) مما يجعله مثالياً للاشتباكات السريعة`);
    } else {
      // مقارنة تفصيلية بالأرقام الحقيقية من constants.ts
      const dmgDiff = wd - ld;
      const spdDiff = ws - ls;
      const rcDiff  = lr - wr; // موجب = الفائز أقل ارتداداً

      if (Math.abs(dmgDiff) >= 5) {
        if (dmgDiff > 0) reasons.push(`ضرره أعلى بفارق ${dmgDiff} نقطة (${wd} مقابل ${ld}) مما يقلل عدد الطلقات اللازمة للإسقاط`);
        else reasons.push(`رغم ضرره الأقل (${wd} مقابل ${ld})، يعوّض ذلك بسرعة إطلاق وثبات أعلى`);
      }
      if (spdDiff >= 6) {
        reasons.push(`سرعة إطلاقه أعلى بفارق ${spdDiff} نقطة (${ws} مقابل ${ls}) مما يزيد كثافة الرش ويقلل زمن الحسم`);
      }
      if (rcDiff >= 6) {
        reasons.push(`ارتداده أقل بفارق ${rcDiff} نقطة (${wr} مقابل ${lr}) مما يجعل السحب أسهل وأدق في الاشتباكات السريعة`);
      } else if (rcDiff <= -6) {
        reasons.push(`رغم ارتداده الأعلى (${wr} مقابل ${lr})، يتفوق بفضل مزيجه القوي من الضرر والسرعة`);
      }
    }

    const summary = reasons.length > 0
      ? reasons.join("، ")
      : `توازنه الأفضل في المواجهات القريبة (ضرر ${wd} | سرعة ${ws} | ارتداد ${wr})`;
    return `في المواجهات القريبة، ${wn} (${getTypeLabel(wt)}) يتفوق على ${ln} (${getTypeLabel(lt)}): ${summary}.`;
  };

  const buildLong = (wi: 1 | 2): string => {
    const [wn, ln]                     = wi === 1 ? [n1, n2]                       : [n2, n1];
    const [wd, wr, ws, wg, wt]  = wi === 1 ? [d1, r1, s1, g1, t1] : [d2, r2, s2, g2, t2];
    const [ld, lr, ls, lg, lt]  = wi === 1 ? [d2, r2, s2, g2, t2] : [d1, r1, s1, g1, t1];
    const reasons: string[] = [];

    // أولوية فئة السلاح في المواجهات البعيدة
    if (wt === "Sniper" && lt !== "Sniper") {
      reasons.push(`كونه سلاح قنص (ضرر ${wd}/100 | مدى ${wg}/100) يجعله الخيار الأمثل على المسافات الطويلة — طلقة واحدة كافية للإسقاط في أغلب الأحيان`);
    } else if (lt === "Shotgun" && wt !== "Shotgun") {
      reasons.push(`لأن ${ln} (رمحة صيد) فعاليته تنعدم تقريباً على المسافات البعيدة (مدى ${lg}/100)`);
    } else if (wt === "DMR" && (lt === "AR" || lt === "SMG")) {
      reasons.push(`كونه رامية دقيقة (ضرر ${wd}/100 | مدى ${wg}/100) متخصصة للمسافات المتوسطة والبعيدة`);
    } else {
      // مقارنة تفصيلية بالأرقام الحقيقية
      const rngDiff = wg - lg;
      const rcDiff  = lr - wr; // موجب = الفائز أقل ارتداداً
      const dmgDiff = wd - ld;

      if (rngDiff >= 5) {
        reasons.push(`مداه الفعال أكبر بفارق ${rngDiff} نقطة (${wg} مقابل ${lg}) مما يحافظ على فعالية الطلقات على المسافات البعيدة`);
      }
      if (rcDiff >= 6) {
        reasons.push(`ارتداده أقل بفارق ${rcDiff} نقطة (${wr} مقابل ${lr}) مما يجعل التربيل والرش على البعد أكثر دقة`);
      } else if (rcDiff <= -6) {
        reasons.push(`رغم ارتداده الأعلى (${wr} مقابل ${lr})، يتفوق بفضل ضرره ومداه الأكبر`);
      }
      if (Math.abs(dmgDiff) >= 5) {
        if (dmgDiff > 0) reasons.push(`ضرره أعلى (${wd} مقابل ${ld}) مما يقلل عدد الطلقات اللازمة لإسقاط الخصم من بعيد`);
      }
    }

    const summary = reasons.length > 0
      ? reasons.join("، ")
      : `تفوقه في الثبات (${stab1 > stab2 && wi === 1 ? stab1 : stab2}/100) والمدى (${wg}/100)`;
    return `في المواجهات البعيدة، ${wn} (${getTypeLabel(wt)}) يتفوق على ${ln} (${getTypeLabel(lt)}): ${summary}.`;
  };

  // ===== بناء النصوص النهائية =====
  let closeRange: string;
  let longRange: string;

  if (closeWin === 1)      closeRange = buildClose(1);
  else if (closeWin === 2) closeRange = buildClose(2);
  else closeRange = `في المواجهات القريبة، ${n1} (${type1Label}) و${n2} (${type2Label}) متقاربان جداً — ${n1}: ضرر ${d1} | سرعة ${s1} | ارتداد ${r1} ، ${n2}: ضرر ${d2} | سرعة ${s2} | ارتداد ${r2}. الفارق يعتمد على أسلوب اللاعب وسرعة ردة فعله.`;

  if (longWin === 1)       longRange = buildLong(1);
  else if (longWin === 2)  longRange = buildLong(2);
  else longRange = `في المواجهات البعيدة، ${n1} (${type1Label}) و${n2} (${type2Label}) متقاربان — ${n1}: مدى ${g1} | ثبات ${stab1} | ضرر ${d1} ، ${n2}: مدى ${g2} | ثبات ${stab2} | ضرر ${d2}. الأفضلية تعتمد على السكوب والحساسية المستخدمة.`;

  // ===== تعليق يعكس المسافة المختارة =====
  if (distance <= 20) {
    closeRange += ` (المسافة ${distance}م — اشتباك مباشر جداً: الأولوية لسرعة الحسم والطلقة الأولى.)`;
  } else if (distance <= 50) {
    closeRange += ` (المسافة ${distance}م — متوسطة قريبة: كلا السلاحين فعالان، اختر بحسب أسلوبك.)`;
  } else if (distance <= 100) {
    longRange += ` (المسافة ${distance}م — متوسطة بعيدة: الثبات والمدى يصبحان أهم من سرعة الإطلاق.)`;
  } else {
    longRange += ` (المسافة ${distance}م — بعيدة جداً: الثبات والمدى الفعال هما العاملان الحاسمان.)`;
  }

  // ===== نصائح الأجهزة بناءً على الارتداد الحقيقي =====
  const recoilWinner = r1 < r2 ? n1 : r2 < r1 ? n2 : "السلاحان";
  const recoilLoser  = r1 < r2 ? n2 : r2 < r1 ? n1 : null;
  const minR = Math.min(r1, r2);
  const maxR = Math.max(r1, r2);
  const recoilGap = maxR - minR;

  const tabletAdvice = r1 === r2
    ? `على التابلت، ${n1} و${n2} متساويان في الارتداد (${r1}/100 لكليهما). يفضّل ضبط حساسية الكاميرا وADS بشكل متوازن للاستفادة من مساحة الشاشة الأكبر.`
    : `على التابلت، ${recoilWinner} أسهل في السحب والتحكم (ارتداد ${minR}/100) مقارنةً بـ${recoilLoser} (ارتداد ${maxR}/100) — الفارق ${recoilGap} نقطة. يمكنك رفع حساسية الجيروسكوب مع ${recoilWinner} للاستفادة من شاشة التابلت الواسعة.`;

  const mobileAdvice = r1 === r2
    ? `على الجوال، ${n1} و${n2} متساويان في الارتداد (${r1}/100 لكليهما). يفضّل تجربة حساسية مستقرة دون مبالغة في الرفع.`
    : `على الجوال، ${recoilWinner} (ارتداد ${minR}/100) أنسب وأسهل في التحكم بفارق ${recoilGap} نقطة. إذا استخدمت ${recoilLoser} (ارتداد ${maxR}/100) فقلل الحساسية قليلًا لتعويض الاهتزاز الأعلى أثناء الرش.`;

  return {
    closeRange,
    longRange,
    tabletAdvice,
    mobileAdvice,
    source: "بيانات constants.ts الحقيقية",
    updatedAt: new Date().toLocaleString("ar-SA"),
  };
}
export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

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
    { id: 'pmgc', name: 'PMGC 2026', date: '2026-11-15T00:00:00Z', icon: <Trophy size={24} />, label: 'البطولة العالمية' },
    { id: 'pmwi', name: 'PMWI Riyadh', date: '2026-07-20T00:00:00Z', icon: <Globe size={24} />, label: 'الدعوة العالمية' },
    { id: 'pmsl', name: 'PMSL EMEA', date: '2026-05-25T00:00:00Z', icon: <Zap size={24} />, label: 'الدوري الإقليمي' },
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
            
            <div className="flex flex-col items-center text-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-black transition-all duration-500 transform group-hover:rotate-6">
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

  const [activeTab, setActiveTab] = useState<
    | "home"
    | "sensitivity"
    | "news"
    | "characters"
    | "ads"
    | "giveaways"
    | "events"
    | "compare"
    | "calculator"
    | "rate"
    | "admin"
    | "loadouts"
    | "game-events"
    | "dashboard"
  >(() => {
    const path = window.location.pathname.replace("/", "");
    const validTabs = [
      "home",
      "news",
      "calculator",
      "characters",
      "compare",
      "loadouts",
      "sensitivity",
      "events",
      "giveaways",
      "ads",
      "admin",
      "rate",
      "game-events",
    ];

    return (validTabs.includes(path) ? path : "home") as any;
  });

  useEffect(() => {
    const path = activeTab === "home" ? "/" : `/${activeTab}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  }, [activeTab]);

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

  const [selectedWeapon1, setSelectedWeapon1] = useState<Weapon | null>(null);
  const [selectedWeapon2, setSelectedWeapon2] = useState<Weapon | null>(null);
  const [distance, setDistance] = useState<number>(50);

  const comparisonAdvice = buildComparisonAdvice(
    selectedWeapon1,
    selectedWeapon2,
    distance
  );
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
  const [isAttachmentDropdownOpen, setIsAttachmentDropdownOpen] = useState(false);
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
    if (WEAPONS.length >= 2) {
      setSelectedWeapon1(WEAPONS[0]);
      setSelectedWeapon2(WEAPONS[1]);
    }
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

  useEffect(() => {
    if (currentWeapons.length >= 2) {
      setSelectedWeapon1((prev) => prev || currentWeapons[0]);
      setSelectedWeapon2((prev) => prev || currentWeapons[1]);
    }
  }, [currentWeapons]);
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

  const calculateTTK = (weapon: Weapon | null) => {
    if (!weapon) return 0;
    // Base health is 100. Level 2 vest reduces damage by 40% (multiplier 0.6)
    const vestMultiplier = 0.6;
    const effectiveDamage = weapon.damage * vestMultiplier;
    const shotsToKill = Math.ceil(100 / effectiveDamage);

    // speed in constants is 0-100, let's map it to a realistic fire rate (RPM)
    // Most ARs are between 600-800 RPM.
    // RPM = 500 + (speed * 4)
    const rpm = 500 + weapon.speed * 4;
    const fireRatePerSecond = rpm / 60;
    const timeBetweenShots = 1 / fireRatePerSecond;

    // TTK = (Shots to kill - 1) * Time between shots
    const ttk = (shotsToKill - 1) * timeBetweenShots;
    return ttk.toFixed(3);
  };

  const getComparisonAdvice = () => {
    if (!selectedWeapon1 || !selectedWeapon2) return null;

    const w1 = selectedWeapon1;
    const w2 = selectedWeapon2;

    const ipadAdvice =
      w1.recoil > w2.recoil
        ? `لمستخدمي الـ iPad: الـ ${w2.nameAr} أفضل للتحكم بسبب مساحة الشاشة الكبيرة التي تساعد في سحب الارتداد، لكن الـ ${w1.nameAr} يحتاج حساسية جيروسكوب عالية.`
        : `لمستخدمي الـ iPad: الـ ${w1.nameAr} هو الخيار الأمثل للثبات على المسافات البعيدة بفضل شاشة الآيباد الواسعة.`;

    const phoneAdvice =
      w1.recoil < w2.recoil
        ? `لمستخدمي الهواتف: الـ ${w1.nameAr} أسهل بكثير في التحكم (Spray) نظراً لصغر مساحة السحب على الشاشة مقارنة بالـ ${w2.nameAr}.`
        : `لمستخدمي الهواتف: الـ ${w2.nameAr} يتطلب مهارة عالية في التحكم بالارتداد، ننصح باستخدام مقبض رأسي (Vertical Grip).`;

    return {
      ipad: ipadAdvice,
      phone: phoneAdvice,
    };
  };

  const rawComparisonAdvice = getComparisonAdvice();

  const comparisonAdviceSmart = selectedWeapon1
    ? {
        ...getWeaponSmartAnalysis(selectedWeapon1),
        ipad: rawComparisonAdvice?.ipad ?? "",
        phone: rawComparisonAdvice?.phone ?? "",
      }
    : null;

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
          {showAdBanner && (
            <motion.div
              key={ad.id + "-" + currentAdIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {getIconComponent(ad.icon)}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                      إعلان ممول
                    </span>
                    <h4 className="font-bold text-white">{ad.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {ad.description}
                  </p>
                </div>
              </div>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-primary hover:text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <span>استكشف الآن</span>
                <ExternalLink size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const deleteItem = async (col: string, id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, col, id));
      showNotification("تم الحذف بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${col}/${id}`);
    }
  };

  const toggleEventVisibility = async (id: string, currentHidden: boolean) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "events", id), { isHidden: !currentHidden });
      showNotification(
        currentHidden ? "تم إظهار الفعالية" : "تم إخفاء الفعالية",
        "success"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${id}`);
    }
  };

  const withdrawAuthority = async () => {
    showNotification(
      "ميزة سحب الصلاحية ستتوفر قريباً في لوحة التحكم المتقدمة",
      "info"
    );
  };

  const handleVideoUpload = async () => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول لرفع مقاطعك", "info");
      setIsAuthModalOpen(true);
      return;
    }
    showNotification(
      "ميزة رفع المقاطع ستتوفر قريباً عبر Firebase Storage",
      "info"
    );
  };

  const handleRateWeapon = async () => {
    if (!user || !selectedWeaponToRate) {
      showNotification("يرجى تسجيل الدخول للتقييم", "info");
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingWeaponRating(true);
    try {
      const ratingData: Omit<WeaponRating, "id"> = {
        weaponId: selectedWeaponToRate.id,
        rating: weaponRatingValue,
        comment: weaponRatingComment,
        userId: user.uid,
        userName: user.displayName || "لاعب",
        userPhoto: user.photoURL || "",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "weaponRatings"), ratingData);
      showNotification("شكراً لتقييمك!", "success");
      setIsRatingModalOpen(false);
      setWeaponRatingComment("");
      setWeaponRatingValue(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "weaponRatings");
    } finally {
      setIsSubmittingWeaponRating(false);
    }
  };

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification("تم نسخ الكود بنجاح!", "success");
  };

  const copyImageToClipboard = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      showNotification("تم نسخ الصورة إلى الحافظة", "success");
    } catch (err) {
      // Fallback to copying URL if blob copy fails (e.g. CORS)
      navigator.clipboard.writeText(url);
      showNotification("تم نسخ رابط الصورة", "success");
    }
  };

  useEffect(() => {
    // No rankings to check in frontend-only mode
  }, []);

  const refreshRankings = async () => {
    if (!isAdmin) return;
    setIsRefreshingRankings(true);
    try {
      const latestData = await fetchLatestRankings();

      // Update each ranking in Firestore
      for (const rankData of latestData) {
        const q = query(
          collection(db, "rankings"),
          where("rank", "==", rankData.rank)
        );
        const snap = await getDocs(q);

        const docData = {
          ...rankData,
          updatedAt: serverTimestamp(),
          source: "Gemini AI (Real-time Stats)",
        };

        if (snap.empty) {
          await addDoc(collection(db, "rankings"), docData);
        } else {
          await updateDoc(doc(db, "rankings", snap.docs[0].id), docData);
        }
      }

      showNotification("تم تحديث التصنيفات بنجاح من مصادر موثوقة", "success");
    } catch (error) {
      console.error("Refresh rankings error:", error);
      showNotification("فشل تحديث التصنيفات", "error");
    } finally {
      setIsRefreshingRankings(false);
    }
  };

  // Automatic Ranking Update (Every 6 hours if admin is active)
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      refreshRankings();
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(interval);
  }, [isAdmin]);

  const loadNews = async () => {
    setLoadingNews(true);
    const { fetchPubgNews } = await import("./services/geminiService");
    const data = await fetchPubgNews();
    setNews(data);
    setLoadingNews(false);
  };

  const handlePickWinner = async () => {
    if (!isAdmin || giveaways.length === 0) return;
    const giveawayId = giveaways[0].id;
    try {
      const entriesSnap = await getDocs(
        query(
          collection(db, "giveawayEntries"),
          where("giveawayId", "==", giveawayId)
        )
      );
      const entries = entriesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GiveawayEntry[];

      if (entries.length === 0) {
        showNotification("لا يوجد مشاركون في هذا السحب بعد", "info");
        return;
      }

      const winnerIndex = Math.floor(Math.random() * entries.length);
      const winnerEntry = entries[winnerIndex];

      const winner: Omit<GiveawayWinner, "id"> = {
        giveawayId,
        userId: winnerEntry.userId,
        playerName: winnerEntry.playerName,
        playerId: winnerEntry.playerId,
        prize: giveaways[0].prize,
        wonAt: new Date().toISOString(),
        date: new Date().toLocaleDateString("ar-SA"),
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(collection(db, "giveawayWinners")), winner);
      await updateDoc(doc(db, "giveaways", giveawayId), { status: "ended" });

      showNotification(
        `تم اختيار الفائز: ${winnerEntry.playerName}`,
        "success"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "giveawayWinners");
    }
  };

  const handleSubmitClip = async () => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول لرفع مقاطعك", "info");
      setIsAuthModalOpen(true);
      return;
    }
    if (!newClipTitle.trim() || (!newClipUrl.trim() && !selectedClipFile)) {
      showNotification("يرجى إدخال عنوان المقطع ورابط الفيديو", "error");
      return;
    }
    setIsSubmittingClip(true);
    try {
      let finalUrl = newClipUrl;
      
      // If a file was selected, we'd normally upload to Storage. 
      // Since we only have Firestore, we'll warn the user if they didn't provide a link.
      if (selectedClipFile && !newClipUrl.trim()) {
        showNotification("عذراً، رفع الملفات مباشرة من الجهاز قيد الصيانة حالياً. يرجى استخدام رابط يوتيوب أو تيك توك.", "error");
        setIsSubmittingClip(false);
        return;
      }

      // AI Analysis
      let aiAnalysis = undefined;
      try {
        const { analyzeClipWithAI } = await import("./services/geminiService");
        aiAnalysis = await analyzeClipWithAI(newClipTitle, videoDesc || "");
      } catch (aiError) {
        console.error("AI Analysis failed:", aiError);
      }

      const newClip: Omit<Clip, "id"> = {
        title: newClipTitle,
        description: videoDesc || "",
        url: finalUrl,
        videoUrl: finalUrl,
        authorId: user.uid,
        authorName: userProfile?.displayName || "لاعب ببجي",
        userName: userProfile?.displayName || "لاعب ببجي",
        userPhoto: userProfile?.photoURL || "",
        votes: 0,
        voters: [],
        isWinner: false,
        aiAnalysis,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(collection(db, "clips")), newClip);

      // Update total participations
      try {
        await updateDoc(doc(db, "siteStats", "global"), {
          totalParticipations: increment(1),
          updatedAt: serverTimestamp()
        });
      } catch (statsErr) {
        console.error("Error updating stats:", statsErr);
      }

      showNotification("تم رفع المقطع بنجاح!", "success");
      setNewClipTitle("");
      setNewClipUrl("");
      setSelectedClipFile(null);
      setVideoDesc("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "clips");
    } finally {
      setIsSubmittingClip(false);
    }
  };

  const handleAddWinningClip = async () => {
    if (!isAdmin) {
      showNotification("فقط المسؤول يمكنه رفع اللقطات الفائزة", "error");
      return;
    }
    if (!newClipTitle.trim() || !newClipUrl.trim()) {
      showNotification("يرجى إدخال عنوان المقطع ورابط الفيديو", "error");
      return;
    }
    setIsSubmittingClip(true);
    try {
      // AI Analysis
      let aiAnalysis = undefined;
      try {
        const { analyzeClipWithAI } = await import("./services/geminiService");
        aiAnalysis = await analyzeClipWithAI(newClipTitle, videoDesc || "لقطة فائزة في المسابقة");
      } catch (aiError) {
        console.error("AI Analysis failed:", aiError);
      }

      const newClip: Omit<Clip, "id"> = {
        title: newClipTitle,
        description: videoDesc || "لقطة فائزة في المسابقة",
        url: newClipUrl,
        videoUrl: newClipUrl,
        authorId: user?.uid || "admin",
        authorName: "المسؤول",
        userName: newClipTitle.split('-')[1]?.trim() || "فائز",
        userPhoto: "",
        votes: 0,
        voters: [],
        isWinner: true,
        aiAnalysis,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(collection(db, "clips")), newClip);

      showNotification("تم رفع اللقطة الفائزة بنجاح!", "success");
      setNewClipTitle("");
      setNewClipUrl("");
      setVideoDesc("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "clips");
    } finally {
      setIsSubmittingClip(false);
    }
  };

  const handleClipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedClipFile(file);
      if (!newClipTitle) {
        setNewClipTitle(file.name.split('.')[0]);
      }
      showNotification(`تم اختيار الملف: ${file.name}. يرجى إضافة رابط الفيديو (YouTube/TikTok) لضمان المشاهدة.`, "info");
    }
  };

  const handleVoteClip = async (clipId: string) => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول للتصويت", "info");
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const clipRef = doc(db, "clips", clipId);
      const clipSnap = await getDoc(clipRef);
      if (clipSnap.exists()) {
        const currentVotes = clipSnap.data().votes || 0;
        await updateDoc(clipRef, { votes: currentVotes + 1 });
        showNotification("تم تسجيل تصويتك بنجاح!", "success");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `clips/${clipId}`);
    }
  };

  const handleSetClipWinner = async (clipId: string) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "clips", clipId), { isWinner: true });
      showNotification("تم تحديد المقطع كفائز!", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `clips/${clipId}`);
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "clips", clipId));
      showNotification("تم حذف المقطع بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `clips/${clipId}`);
    }
  };

  const handleRateSensitivity = async (deviceId: string) => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول للتقييم", "info");
      setIsAuthModalOpen(true);
      return;
    }
    if (ratingValue === 0) {
      showNotification("يرجى اختيار عدد النجوم", "error");
      return;
    }
    setIsSubmittingRating(true);
    try {
      const rating: Omit<SensitivityRating, "id"> = {
        deviceId,
        userId: user.uid,
        userName: userProfile?.displayName || "لاعب ببجي",
        rating: ratingValue,
        comment: ratingComment,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(collection(db, "sensitivityRatings")), rating);
      showNotification("شكراً لتقييمك!", "success");
      setRatingValue(0);
      setRatingComment("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "sensitivityRatings");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleUpdateAttachment = async (field: string, value: string) => {
    if (!isAdmin || !isEditingAttachment) return;
    try {
      await setDoc(
        doc(db, "attachments", isEditingAttachment),
        {
          [field]: value,
        },
        { merge: true }
      );
      showNotification("تم تحديث المرفق", "success");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `attachments/${isEditingAttachment}`
      );
    }
  };

  const handleAddAttachment = async () => {
    if (!isAdmin) return;
    showNotification("ميزة إضافة المرفقات ستتوفر قريباً", "info");
  };

  const handleUpdateWeapon = async (field: string, value: any) => {
    if (!isAdmin || !isEditingWeapon) return;
    try {
      await setDoc(
        doc(db, "weapons", isEditingWeapon),
        { [field]: value },
        { merge: true }
      );
      showNotification("تم تحديث السلاح", "success");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `weapons/${isEditingWeapon}`
      );
    }
  };

  const handleSyncWeapons = async () => {
    if (!isAdmin) return;
    try {
      const batch = WEAPONS.map(async (weapon) => {
        await setDoc(doc(db, "weapons", weapon.id), weapon);
      });
      await Promise.all(batch);
      showNotification("تم مزامنة الأسلحة بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "weapons");
    }
  };

  const handleSyncAttachments = async () => {
    if (!isAdmin) return;
    try {
      const batch = ATTACHMENTS.map(async (att) => {
        await setDoc(doc(db, "attachments", att.id), att);
      });
      await Promise.all(batch);
      showNotification("تم مزامنة الملحقات بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "attachments");
    }
  };

  const handleSyncCharacters = async () => {
    if (!isAdmin) return;
    try {
      const batch = CHARACTERS.map(async (char) => {
        await setDoc(doc(db, "characters", char.id), char);
      });
      await Promise.all(batch);
      showNotification("تم مزامنة الشخصيات بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "characters");
    }
  };

  const handleSyncProPlayers = async () => {
    if (!isAdmin) return;
    try {
      const batch = PRO_PLAYERS.map(async (player) => {
        await setDoc(doc(db, "players", player.id), player);
      });
      await Promise.all(batch);
      showNotification("تم مزامنة اللاعبين المحترفين بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "players");
    }
  };

  const handleUserStatusChange = async (uid: string, status: 'active' | 'disabled' | 'suspended') => {
    try {
      await updateDoc(doc(db, "users", uid), { status });
      showNotification("تم تحديث حالة المستخدم بنجاح", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleUserBanToggle = async (uid: string, isBanned: boolean) => {
    try {
      await updateDoc(doc(db, "users", uid), { isBanned });
      showNotification(isBanned ? "تم حظر المستخدم" : "تم إلغاء حظر المستخدم", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleUpdateCompetitionSetting = async (field: string, value: any) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "competitionSettings", selectedSettingId), {
        [field]: value,
      });
      showNotification("تم تحديث الإعدادات", "success");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `competitionSettings/${selectedSettingId}`
      );
    }
  };

  const handleAddImageToLibrary = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isAdmin || !e.target.files?.[0]) return;
    const file = e.target.files[0];

    // Check file size (Firestore limit is 1MB, base64 adds ~33% overhead)
    if (file.size > 700000) {
      showNotification(
        "حجم الصورة كبير جداً (الحد الأقصى 700 كيلوبايت)",
        "error"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        await addDoc(collection(db, "imageLibrary"), {
          url: base64,
          name: file.name,
          createdAt: new Date().toISOString(),
        });
        showNotification("تم رفع الصورة بنجاح", "success");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "imageLibrary");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImageFromLibrary = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "imageLibrary", id));
      showNotification("تم حذف الصورة", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `imageLibrary/${id}`);
    }
  };

  const getMetaContent = () => {
    const siteName = "ببجيكوم - Pubgcom";
    const defaultDesc =
      "المنصة رقم #1 للاعبي ببجي موبايل. إعدادات حساسية، أخبار، مقارنة أسلحة، وحاسبة كونكر.";

    const metaMap: Record<string, { title: string; desc: string }> = {
      home: { title: siteName, desc: defaultDesc },
      news: {
        title: `آخر الأخبار - ${siteName}`,
        desc: "تابع أحدث تحديثات وفعاليات ببجي موبايل مباشرة.",
      },
      compare: {
        title: `مقارنة الأسلحة - ${siteName}`,
        desc: "قارن بين أسلحة ببجي موبايل واعرف الأفضل لمواجهاتك.",
      },
      calculator: {
        title: `حاسبة الكونكر - ${siteName}`,
        desc: "احسب نقاطك المتبقية للوصول إلى تقييم الغازي (Conqueror).",
      },
      characters: {
        title: `مميزات وخصائص - ${siteName}`,
        desc: "تعرف على مهارات الشخصيات وخصائص المرفقات والأسلحة.",
      },
      sensitivity: {
        title: `إعدادات الحساسية - ${siteName}`,
        desc: "أفضل أكواد الحساسية للمحترفين ولجميع الأجهزة.",
      },
      events: {
        title: `الفعاليات - ${siteName}`,
        desc: "شارك في أحدث الفعاليات والبطولات واربح جوائز قيمة.",
      },
      giveaways: {
        title: `السحوبات - ${siteName}`,
        desc: "سحوبات يومية وأسبوعية على شدات UC ورويال باس.",
      },
      ads: {
        title: `الإعلانات - ${siteName}`,
        desc: "عروض وخدمات حصرية لمجتمع ببجيكوم.",
      },
      rate: {
        title: `أجمل لقطة  - ${siteName}`,
        desc: "شارك أجمل لقطاتك وصوت للأفضل في قسم تحليل اللقطات.",
      },
      "game-events": {
        title: `فعاليات اللعبة - ${siteName}`,
        desc: "تعرف على أحدث فعاليات الصناديق والرويال باس في ببجي موبايل.",
      },
      loadouts: {
        title: `أفضل القطع - ${siteName}`,
        desc: "دليل شامل لأفضل القطع والمرفقات لكل سلاح في ببجي موبايل.",
      },
    };

    return metaMap[activeTab] || metaMap.home;
  };

  const meta = getMetaContent();

  const hasSRating = activeTab === "rate" && clips
    .filter(c => c.authorId === user?.uid)
    .some(clip => 
      clip.aiAnalysis?.golden_dashboard?.pro_rating === 'S' || 
      clip.aiAnalysis?.analysis?.pro_rating === 'S'
    );

  if (loadingFirebase) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`min-h-screen text-text-main font-sans selection:bg-primary/30 relative transition-all duration-1000 ${
        hasSRating ? "bg-[#1a1300] shadow-[inset_0_0_300px_rgba(234,179,8,0.15)]" : "bg-bg-dark"
      }`}
      dir="rtl"
    >
      {/* Premium Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence>
          {hasSRating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-[-1]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.2),transparent_70%)] animate-pulse-gold" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-gold" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-gold"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-primary/3 blur-[80px] rounded-full" />
      </div>

      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.desc} />
      </Helmet>

      {/* Golden Top 3 Banner */}
      {rankings.length >= 3 && (
        <div className="bg-[#0A0C10] text-primary py-2 overflow-hidden relative z-[100] shadow-2xl border-b border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="max-w-7xl mx-auto px-4 relative flex items-center justify-center gap-6 md:gap-12">
            <div className="hidden md:flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter gold-shimmer">
              <Trophy size={14} className="fill-current" />
              <span>TOP 3 ME SERVER</span>
            </div>

            <div className="flex items-center gap-8 overflow-hidden">
              <motion.div
                animate={{ x: [0, -10, 0] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center gap-8 whitespace-nowrap"
              >
                {[
                  { medal: "🥇", rank: 1 },
                  { medal: "🥈", rank: 2 },
                  { medal: "🥉", rank: 3 },
                ].map((item) => {
                  const player = rankings.find((r) => r.rank === item.rank);
                  if (!player) return null;
                  return (
                    <div key={item.rank} className="flex items-center gap-2">
                      <span className="text-xl filter drop-shadow-md">
                        {item.medal}
                      </span>
                      <div className="flex flex-col leading-none">
                        <span className="font-black text-sm uppercase tracking-tight">
                          {player.playerName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold opacity-80">
                            {player.stats}
                          </span>
                          <span className="text-[9px] font-bold opacity-60">
                            ({player.country})
                          </span>
                          {player.source && (
                            <span className="text-[8px] font-bold opacity-40 border-l border-black/20 pl-2 ml-1">
                              المصدر: {player.source}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <div className="hidden md:flex items-center gap-2 font-black text-[9px] uppercase tracking-widest opacity-80">
              <span>
                <span className="animate-pulse-slow text-red-500">LIVE</span>{" "}
                UPDATES
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              {isAdmin && (
                <button
                  onClick={() => refreshRankings()}
                  disabled={isRefreshingRankings}
                  className={`ml-2 p-1 rounded hover:bg-black/20 transition-all ${
                    isRefreshingRankings ? "animate-spin" : ""
                  }`}
                  title="تحديث البيانات يدوياً"
                >
                  <RefreshCw size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ranking Ticker */}
      <AnimatePresence>
        {rankings.length > 0 && (
          <div className="bg-primary/10 border-b border-primary/20 py-2 overflow-hidden whitespace-nowrap relative z-[60] min-h-[36px] flex items-center">
            <AnimatePresence mode="wait">
              {showRankingTicker && (
                <motion.div
                  key="ranking-ticker-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="flex animate-marquee items-center gap-12 w-max"
                >
                  {[
                    ...rankings.slice(0, 3),
                    ...rankings.slice(0, 3),
                    ...rankings.slice(0, 3),
                    ...rankings.slice(0, 3),
                    ...rankings.slice(0, 3),
                  ].map((r, i) => (
                    <div
                      key={`ticker-${r.id ?? r.rank}-${i}`}
                      className="flex items-center gap-3 text-xs font-bold"
                    >
                      <span className="text-primary">#{r.rank}</span>
                      <span className="text-text-main">{r.playerName}</span>
                      <span className="text-text-muted">({r.country})</span>
                      {r.stats && (
                        <span className="text-primary/70">{r.stats}</span>
                      )}
                    </div>
                  ))}

                  {/* Duplicate for seamless loop */}
                  {rankings.slice(0, 3).map((r, i) => (
                    <div
                      key={`dup-${i}`}
                      className="flex items-center gap-3 text-xs font-bold"
                    >
                      <span className="text-primary">#{r.rank}</span>
                      <span className="text-text-main">{r.playerName}</span>
                      <span className="text-text-muted">({r.country})</span>
                      {r.stats && (
                        <span className="text-primary/70">{r.stats}</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/10 px-4 md:px-6 py-4 bg-bg-dark/75 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 md:gap-12">
          <div
            className={`flex items-center gap-3 md:gap-5 group cursor-pointer hover:scale-[1.02] transition-all duration-300 ${
              competitionSettings.find(s => s.id === 'global')?.isLogoHidden ? 'hidden' : 'flex'
            }`}
            onClick={() => setActiveTab("home")}
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all duration-500 shadow-inner">
                <Zap
                  size={24}
                  className="text-primary group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg md:text-2xl font-black tracking-tighter gold-shimmer leading-none mb-1">
                ببجيكوم
              </h1>
              <p className="text-[8px] md:text-[10px] text-primary/70 font-bold uppercase tracking-[0.3em] leading-none">
                PUBGCOM PRO
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex gap-2 items-center">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-primary hover:bg-primary/10 transition-all mr-2"
              title={isDarkMode ? "الوضع الفاتح" : "الوضع المظلم"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {[
              { id: "home", label: "الرئيسية" },
              { id: "news", label: "الاخبار" },
              { id: "game-events", label: "فعاليات اللعبة" },
              { id: "dashboard", label: "لوحة التحكم" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative group overflow-hidden ${
                  activeTab === tab.id
                    ? "btn-gold shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-[2px]"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab !== tab.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary group-hover:w-1/2 transition-all duration-300" />
                )}
              </button>
            ))}

            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsFeaturesDropdownOpen(true)}
              onMouseLeave={() => setIsFeaturesDropdownOpen(false)}
            >
              <button
                onClick={() => setActiveTab("characters")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative group overflow-hidden flex items-center gap-2 ${
                  activeTab === "characters"
                    ? "btn-gold shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-0.5"
                }`}
              >
                <span className="relative z-10">مميزات وخصائص</span>
                <ChevronDown
                  size={24}
                  className={`transition-transform duration-300 ${
                    isFeaturesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                {activeTab !== "characters" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary group-hover:w-1/2 transition-all duration-300" />
                )}
              </button>

              <AnimatePresence>
                {isFeaturesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                  >
                    {[
                      {
                        id: "characters",
                        label: "الشخصيات",
                        icon: <Users size={14} />,
                        cat: "characters",
                      },
                      {
                        id: "characters",
                        label: "الأسلحة",
                        icon: <Crosshair size={14} />,
                        cat: "weapons",
                      },
                      {
                        id: "characters",
                        label: "قطع الأسلحة",
                        icon: <Settings2 size={14} />,
                        cat: "attachments",
                      },
                    ].map((item) => (
                      <button
                        key={item.cat}
                        onClick={() => {
                          setActiveTab("characters");
                          setFeaturesCategory(item.cat as any);
                          setIsFeaturesDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-right text-sm font-bold flex items-center justify-end gap-3 transition-all ${
                          activeTab === "characters" &&
                          featuresCategory === item.cat
                            ? "bg-primary/10 text-primary"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="opacity-70">{item.icon}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Player Tools Dropdown */}
            <div
              className="relative group"
              onMouseLeave={() => setIsToolsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                onMouseEnter={() => setIsToolsDropdownOpen(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 relative group overflow-hidden ${
                  ["calculator", "compare", "loadouts", "sensitivity", "rate"].includes(
                    activeTab
                  )
                    ? "btn-gold shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-0.5"
                }`}
              >
                <Crosshair
                  size={16}
                  className={
                    [
                      "calculator",
                      "compare",
                      "loadouts",
                      "sensitivity",
                      "rate",
                    ].includes(activeTab)
                      ? "text-black"
                      : "text-primary"
                  }
                />
                <span className="relative z-10">أدوات اللاعبين </span>
                {![
                  "calculator",
                  "compare",
                  "loadouts",
                  "sensitivity",
                  "rate",
                ].includes(activeTab) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary group-hover:w-1/2 transition-all duration-300" />
                )}
                <ChevronDown
                  size={24}
                  className={`transition-transform duration-300 ${
                    isToolsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isToolsDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsToolsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden py-2"
                    >
                      {[
                        {
                          id: "calculator",
                          label: "حاسبة التقييم",
                          icon: <BarChart3 size={14} />,
                        },
                        {
                          id: "compare",
                          label: "مقارنة الأسلحة",
                          icon: <ArrowLeftRight size={14} />,
                        },
                        {
                          id: "loadouts",
                          label: "تجهيز الأسلحة",
                          icon: <Settings size={14} />,
                        },
                        {
                          id: "sensitivity",
                          label: "الحساسية",
                          icon: <Target size={14} />,
                        },
                        {
                          id: "rate",
                          label: "حلّل مستواك",
                          icon: <Video size={14} />,
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            setIsToolsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-right text-sm font-bold flex items-center gap-3 transition-all ${
                            activeTab === item.id
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="opacity-70">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Community Dropdown */}
            <div
              className="relative group"
              onMouseLeave={() => setIsCommunityDropdownOpen(false)}
            >
              <button
                onClick={() =>
                  setIsCommunityDropdownOpen(!isCommunityDropdownOpen)
                }
                onMouseEnter={() => setIsCommunityDropdownOpen(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 relative group overflow-hidden ${
                  ["events", "giveaways", "ads"].includes(activeTab)
                    ? "btn-gold shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-0.5"
                }`}
              >
                <Users
                  size={16}
                  className={
                    ["events", "giveaways", "ads"].includes(activeTab)
                      ? "text-black"
                      : "text-primary"
                  }
                />
                <span className="relative z-10">مجتمعنا</span>
                {!["events", "giveaways", "ads"].includes(activeTab) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary group-hover:w-1/2 transition-all duration-300" />
                )}
                <ChevronDown
                  size={24}
                  className={`transition-transform duration-300 ${
                    isCommunityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCommunityDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCommunityDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden py-2"
                    >
                      {[
                        {
                          id: "events",
                          label: "الفعاليات",
                          icon: <Calendar size={14} />,
                        },
                        {
                          id: "giveaways",
                          label: "السحوبات",
                          icon: <Gift size={14} />,
                        },
                        {
                          id: "ads",
                          label: "الإعلانات",
                          icon: <Megaphone size={14} />,
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            setIsCommunityDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-right text-sm font-bold flex items-center gap-3 transition-all ${
                            activeTab === item.id
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="opacity-70">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {isAdmin ? (
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border group relative overflow-hidden ${
                  activeTab === "dashboard"
                    ? "btn-gold shadow-lg shadow-primary/20 border-primary/50"
                    : "text-primary bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                }`}
              >
                <div className="relative">
                  <Shield size={16} className={activeTab === "dashboard" ? "text-black" : "text-primary"} />
                </div>
                <span className="relative z-10">لوحة التحكم</span>
              </button>
            ) : activeUser && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`p-3 rounded-xl border transition-all ${
                  activeTab === "dashboard"
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 border-white/10"
                }`}
                title="لوحة التحكم"
              >
                <LayoutDashboard size={20} />
              </button>
            )}

            <div className="h-6 w-px bg-white/10 mx-2" />

            {activeUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-white leading-none mb-1">
                      {activeUser.displayName || "لاعب"}
                    </p>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest leading-none">
                      {isAdmin ? "Admin" : "Pro Player"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black shadow-lg shadow-primary/20">
                    <UserIcon size={20} />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/10"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-white/10 flex items-center justify-center group"
                title="تسجيل الدخول / إنشاء حساب"
              >
                <UserIcon
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
              </button>
            )}
          </nav>

          {/* Mobile Actions Overlay/Bar */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-white/10 transition-all border border-white/10"
              title={isDarkMode ? "الوضع الفاتح" : "الوضع المظلم"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {activeUser ? (
              <button
                onClick={() => setActiveTab("dashboard")}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black border border-primary/20 shadow-lg shadow-primary/20"
                title="لوحة التحكم"
              >
                <UserIcon size={18} />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-10 h-10 rounded-xl bg-primary text-black hover:scale-[1.05] transition-all border border-primary/20 shadow-lg shadow-primary/20 flex items-center justify-center font-bold"
                title="تسجيل الدخول / إنشاء حساب"
              >
                <UserIcon size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Section Tabs Menu */}
        <div className="lg:hidden mt-4 pt-4 border-t border-white/5 mx-[-1rem] px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {[
              { id: "home", label: "الرئيسية", icon: <Home size={14} /> },
              { id: "characters", label: "المميزات والخصائص", icon: <Users size={14} /> },
              { id: "news", label: "التسريبات", icon: <Newspaper size={14} /> },
              { id: "rate", label: "تحليل الذكاء", icon: <Video size={14} />, highlight: true },
              { id: "calculator", label: "حاسبة التقييم", icon: <BarChart3 size={14} /> },
              { id: "compare", label: "مقارنة", icon: <ArrowLeftRight size={14} /> },
              { id: "loadouts", label: "القطع", icon: <Settings size={14} /> },
              { id: "sensitivity", label: "الحساسية", icon: <Target size={14} /> },
              { id: "game-events", label: "الفعاليات", icon: <Calendar size={14} /> },
              { id: "events", label: "البطولات", icon: <Trophy size={14} /> },
              { id: "giveaways", label: "السحوبات", icon: <Gift size={14} /> },
              { id: "ads", label: "مجتمعنا", icon: <Megaphone size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-[12px] flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                    : tab.highlight
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-white/5 text-slate-300 border border-transparent hover:border-white/10"
                }`}
              >
                <span className={activeTab === tab.id ? "text-black" : tab.highlight ? "text-primary" : "text-slate-400"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-0 sm:px-6 py-6 sm:py-12 mb-20 lg:mb-0">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            !userProfile ? (
              <motion.div
                key="login-required"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pro-card p-12 bg-bg-card/50 border-white/5 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
                  <Lock size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2">تسجيل الدخول مطلوب</h2>
                <p className="text-slate-500 mb-8 max-w-md">يرجى تسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك ومتابعة نشاطاتك.</p>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="btn-gold px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20"
                >
                  تسجيل الدخول الآن
                </button>
              </motion.div>
            ) : (
              <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                <Dashboard
                  userProfile={userProfile}
                  isAdmin={isAdmin}
                  siteStats={siteStats}
                  allUsers={allUsers}
                  clips={clips}
                  giveaways={giveaways}
                  events={events}
                  onLogout={handleLogout}
                  onUpdateProfile={async (data) => {
                    if (userProfile) {
                      try {
                        await updateDoc(doc(db, "users", userProfile.uid), data);
                        showNotification("تم تحديث الملف الشخصي بنجاح", "success");
                      } catch (error) {
                        console.error("Error updating profile:", error);
                        showNotification("فشل تحديث الملف الشخصي", "error");
                      }
                    }
                  }}
                  onDeleteUser={(uid) => deleteItem("users", uid)}
                  onUpdateUserRole={(uid, role) => updateDoc(doc(db, "users", uid), { role })}
                  onNavigate={handleNavigate}
                  isTournamentsHidden={competitionSettings.find(s => s.id === 'global')?.isTournamentsHidden || false}
                  onToggleTournaments={handleToggleTournaments}
                  isCommentsEnabled={competitionSettings.find(s => s.id === 'global')?.isCommentsEnabled !== false}
                  onToggleComments={handleToggleComments}
                  competitionSettings={competitionSettings}
                  onUpdateCompetitionSettings={handleUpdateCompetitionSettings}
                  isUpdatingSettings={isUpdatingSettings}
                  onSyncData={async (type) => {
                    if (type === 'weapons') await handleSyncWeapons();
                    if (type === 'attachments') await handleSyncAttachments();
                    if (type === 'characters') await handleSyncCharacters();
                    if (type === 'players') await handleSyncProPlayers();
                  }}
                  isLogoHidden={competitionSettings.find(s => s.id === 'global')?.isLogoHidden || false}
                  onToggleLogo={handleToggleLogo}
                />
              </Suspense>
            )
          ) : activeTab === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 md:space-y-24 py-6 md:py-12"
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden mx-4 sm:mx-0 rounded-3xl bg-bg-card border border-white/5 p-6 md:p-20 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6"
                  >
                    المنصة رقم #1 للاعبي ببجي
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-6xl font-bold leading-tight mb-4 md:mb-6"
                  >
                    احترف اللعبة <br />{" "}
                    <span className="gold-shimmer">بأفضل الإعدادات</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-xl text-text-muted mb-8 md:mb-10 leading-relaxed"
                  >
                    
                    كل ما تحتاجه في ببجي:
إعدادات | أخبار | تسريبات | فعاليات 🔥
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <button
                      onClick={() => setActiveTab("sensitivity")}
                      className="btn-gold px-8 md:px-10 py-4 md:py-5 rounded-2xl text-lg md:text-xl premium-glow w-full md:w-auto"
                    >
                      ابدأ الآن
                    </button>
                  </motion.div>
                </div>

                <SubtleAdBanner />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                  <Zap
                    size={400}
                    className="absolute -top-20 -right-20 rotate-12 text-primary"
                  />
                </div>
              </section>

              {/* Tournament Flash Banner */}
              <TournamentFlashBanner settings={competitionSettings} />

              {/* Official Global Tournaments */}
              <OfficialGlobalTournaments isHidden={(competitionSettings.find(s => s.id === 'global')?.isTournamentsHidden || false) && !isAdmin} />

              {/* Star of the Round Section */}
              {clips.some((c) => c.isWinner) && (
                <section className="relative overflow-hidden rounded-3xl bg-[#0A0C10] border border-primary/20 p-6 md:p-12 text-center shadow-2xl shadow-primary/5 premium-glow">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                  <div className="relative z-10 space-y-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-3 px-6 py-2 rounded-full btn-gold shadow-xl shadow-primary/40"
                    >
                      <Star size={20} fill="currentColor" />
                      <span className="text-black">نجم الجولة</span>
                      <Star size={20} fill="currentColor" />
                    </motion.div>

                    <div className="flex flex-col items-center gap-6">
                      {clips
                        .filter((c) => c.isWinner)
                        .map((winner) => (
                          <div
                            key={winner.id}
                            className="flex flex-col items-center gap-4"
                          >
                            <div className="relative">
                              <div className="w-24 h-24 rounded-full border-4 border-primary p-1 shadow-lg shadow-primary/20">
                                <GameImage
                                  src={
                                    winner.userPhoto ||
                                    `https://ui-avatars.com/api/?name=${winner.userName}&background=F2A900&color=000`
                                  }
                                  alt={winner.userName}
                                  className="w-full h-full rounded-full"
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1.5 rounded-lg shadow-lg">
                                <Trophy size={16} />
                              </div>
                            </div>

                            <div>
                              <h3 className="text-3xl font-black text-white tracking-tight mb-1 gold-shimmer">
                                {winner.userName}
                              </h3>
                              <p className="text-primary font-bold text-sm uppercase tracking-widest">
                                Star of the Round
                              </p>
                            </div>

                            <div className="max-w-2xl w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                              <iframe
                                src={
                                  winner.videoUrl.includes("youtube.com") ||
                                  winner.videoUrl.includes("youtu.be")
                                    ? winner.videoUrl
                                        .replace("watch?v=", "embed/")
                                        .replace("watch?v=", "embed/")
                                        .replace(
                                          "youtu.be/",
                                          "youtube.com/embed/"
                                        )
                                    : winner.videoUrl
                                }
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>

                            <p className="text-text-muted italic text-lg">
                              "{winner.title}"
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Featured Ads Section */}
              {ads.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center justify-between px-4 md:px-0">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(242,169,0,0.5)]" />
                      <h2 className="text-xl md:text-2xl font-black tracking-tight">
                        عروض وخدمات مميزة
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        إعلان ممول
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 px-4 md:px-0">
                    {ads.map((ad, i) => (
                      <motion.a
                        key={ad.id}
                        href={ad.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative md:overflow-hidden rounded-3xl bg-bg-card border border-white/5 p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                      >
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
                              {ad.icon === "Megaphone" ? (
                                <Megaphone size={28} />
                              ) : ad.icon === "Zap" ? (
                                <Zap size={28} />
                              ) : ad.icon === "Gift" ? (
                                <Gift size={28} />
                              ) : (
                                <Tag size={28} />
                              )}
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                              <ExternalLink size={18} />
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                            {ad.title}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 min-h-[40px]">
                            {ad.description ||
                              "اضغط لمشاهدة التفاصيل والاستفادة من العرض الحصري المقدم لمجتمعنا."}
                          </p>

                          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              اكتشف الآن
                            </span>
                            <ChevronRight
                              size={16}
                              className="text-primary translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                            />
                          </div>
                        </div>

                        {/* Decorative background glow */}
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700" />
                      </motion.a>
                    ))}
                  </div>
                </section>
              )}

              {/* Features Grid */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 px-4 md:px-0">
                  <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(242,169,0,0.5)]" />
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">لماذا ببجيكوم؟</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
                  {[
                    {
                      title: "حساسية مخصصة",
                      desc: "إعدادات دقيقة لكل جهاز (iPhone, iPad, Samsung) لضمان أفضل أداء.",
                      icon: <Smartphone className="text-primary" size={28} />,
                    },
                    {
                      title: "أخبار فورية",
                      desc: "تغطية شاملة لكل الفعاليات، الأطوار الجديدة، وعروض الشدات الرسمية.",
                      icon: <Newspaper className="text-primary" size={28} />,
                    },
                    {
                      title: "أكواد المحترفين",
                      desc: "انسخ أكواد حساسية أفضل اللاعبين العالميين بضغطة واحدة.",
                      icon: <Crosshair className="text-primary" size={28} />,
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 pro-card hover:translate-y-[-4px]"
                    >
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Stats Section */}
              <section className="py-12 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { label: "جهاز مدعوم", value: "50+" },
                  { label: "لاعب محترف", value: "20+" },
                  { label: "تحديث يومي", value: "100%" },
                  { label: "مستخدم نشط", value: "10K+" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </section>

              <SubtleAdBanner />

              {/* CTA Section */}
              <section className="text-center py-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  جاهز لتصبح محترفاً؟
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
                  انضم إلى آلاف اللاعبين الذين طوروا مستواهم باستخدام إعداداتنا.
                  كل ما تحتاجه في مكان واحد.
                </p>
                <button
                  onClick={() => setActiveTab("sensitivity")}
                  className="px-10 py-4 bg-gold-gradient text-black rounded-xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/30 premium-glow"
                >
                  ابدأ رحلة الاحتراف الآن
                </button>
              </section>
            </motion.div>
          ) : activeTab === "sensitivity" ? (
            <motion.div
              key="sensitivity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Smart AI Search Bar */}
              <section className="pro-card p-8 bg-gradient-to-br from-bg-card to-primary/5 border-primary/20">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Sparkles size={12} />
                    مستشار الحساسية الذكي
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    ابحث عن أفضل حساسية لجهازك
                  </h2>
                  <p className="text-text-muted text-sm mb-8">
                    أدخل نوع جهازك وسيقوم الذكاء الاصطناعي بتحليل مواصفاته
                    وتقديم أفضل أرقام لك.
                  </p>

                  <div className="relative flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={smartDeviceSearch}
                        onChange={(e) => setSmartDeviceSearch(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSmartSensitivitySearch()
                        }
                        placeholder="مثال: iPhone 15 Pro Max أو Samsung S24 Ultra..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all pr-12"
                      />
                      <Smartphone
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={20}
                      />
                    </div>
                    <button
                      onClick={handleSmartSensitivitySearch}
                      disabled={!smartDeviceSearch.trim() || isAiLoading}
                      className="px-8 py-4 bg-primary text-black rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAiLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Zap size={20} />
                      )}
                      تحليل الحساسية
                    </button>
                  </div>

                  <SubtleAdBanner />

                  <AnimatePresence>
                    {aiSensitivityResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-black/40 border border-primary/20 rounded-2xl text-right"
                      >
                        <div className="flex items-center gap-2 text-primary mb-4 border-b border-primary/10 pb-2">
                          <Sparkles size={18} />
                          <span className="font-bold">
                            توصية الذكاء الاصطناعي لـ {smartDeviceSearch}
                          </span>
                        </div>
                        <div className="markdown-body text-sm text-slate-300">
                          <Markdown>{aiSensitivityResponse}</Markdown>
                        </div>
                        <button
                          onClick={() => setAiSensitivityResponse(null)}
                          className="mt-6 text-[10px] text-slate-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                        >
                          إغلاق النتيجة
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar: Device/Player Selection */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="pro-card p-6 space-y-6">
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                      <button
                        onClick={() => {
                          setSensitivityCategory("devices");
                          setSelectedDevice(currentDevices[0]);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          sensitivityCategory === "devices"
                            ? "btn-gold shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        الأجهزة
                      </button>
                      <button
                        onClick={() => {
                          setSensitivityCategory("players");
                          setSelectedDevice(currentPlayers[0]);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          sensitivityCategory === "players"
                            ? "btn-gold shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        أفضل اللاعبين
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          {sensitivityCategory === "devices" ? (
                            <Smartphone size={14} />
                          ) : (
                            <Crosshair size={14} />
                          )}
                          {sensitivityCategory === "devices"
                            ? "اختر الجهاز"
                            : "اختر اللاعب"}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedDevice.id}
                            onChange={(e) => {
                              const device = currentList.find(
                                (d) => d.id === e.target.value
                              );
                              if (device) setSelectedDevice(device);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
                          >
                            {currentList.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                                className="bg-bg-dark"
                              >
                                {item.name}{" "}
                                {sensitivityCategory === "players"
                                  ? "(محترف)"
                                  : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute left-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none"
                            size={24}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Target size={14} /> اختر السلاح
                        </label>
                        <div className="relative">
                          <select
                            value={selectedWeapon?.id || ""}
                            onChange={(e) => {
                              const weapon = currentWeapons.find(
                                (w) => w.id === e.target.value
                              );
                              if (weapon) setSelectedWeapon(weapon);
                              else setSelectedWeapon(null);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
                          >
                            <option value="" className="bg-bg-dark">
                              بدون سلاح محدد
                            </option>
                            {currentWeapons.map((weapon) => (
                              <option
                                key={weapon.id}
                                value={weapon.id}
                                className="bg-bg-dark"
                              >
                                {weapon.nameAr} ({weapon.nameEn})
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute left-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none"
                            size={24}
                          />
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => setShowAddDeviceModal(true)}
                        className="w-full py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 font-bold text-sm"
                      >
                        <Plus size={16} />
                        {sensitivityCategory === "devices"
                          ? "إضافة جهاز جديد"
                          : "إضافة لاعب جديد"}
                      </button>
                    )}
                  </div>

                  <div className="p-6 pro-card bg-primary/5 border-primary/10">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
                      <Shield size={18} /> نصيحة احترافية
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      الحساسية تختلف من لاعب لآخر. ابدأ بهذه الإعدادات ثم قم
                      بتعديلها تدريجياً في ساحة التدريب لتناسب أسلوب لعبك.
                    </p>
                  </div>
                </div>

                {/* Main Content: Sensitivity Details */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between p-6 pro-card">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                        {selectedDevice.image ? (
                          <GameImage
                            src={selectedDevice.image}
                            alt={selectedDevice.name}
                            className="w-full h-full"
                          />
                        ) : selectedWeapon ? (
                          <Target className="text-primary" size={24} />
                        ) : (
                          <Settings2 className="text-primary" size={24} />
                        )}
                      </div>
                      <div>
                        {isEditingName && isAdmin ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-bold outline-none focus:border-primary/50 transition-all w-full max-w-md"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleUpdateDevice("name", editName);
                                if (e.key === "Escape") setIsEditingName(false);
                              }}
                            />
                            <button
                              onClick={() =>
                                handleUpdateDevice("name", editName)
                              }
                              className="p-2.5 bg-primary text-black rounded-xl hover:scale-105 transition-transform"
                              title="حفظ"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button
                              onClick={() => setIsEditingName(false)}
                              className="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 transition-colors"
                              title="إلغاء"
                            >
                              <Plus className="rotate-45" size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">
                              {selectedDevice.name}
                              {selectedWeapon && (
                                <span className="text-primary mr-2">
                                  / {selectedWeapon.nameAr}
                                </span>
                              )}
                            </h2>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setEditName(selectedDevice.name);
                                  setIsEditingName(true);
                                }}
                                className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary transition-all group/edit"
                                title="تعديل الاسم"
                              >
                                <Pencil
                                  size={18}
                                  className="group-hover/edit:scale-110 transition-transform"
                                />
                              </button>
                            )}
                          </div>
                        )}
                        <p className="text-slate-400 text-sm">
                          {selectedWeapon
                            ? `إعدادات الحساسية الموصى بها لسلاح ${selectedWeapon.nameAr}`
                            : "إعدادات الحساسية العامة الموصى بها"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedDevice.playStyle && (
                        <div className="px-3 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                          {selectedDevice.playStyle === "Rusher"
                            ? "مقتحم"
                            : "قناص"}
                        </div>
                      )}
                      {selectedDevice.useGyroscope !== undefined && (
                        <div
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                            selectedDevice.useGyroscope
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {selectedDevice.useGyroscope
                            ? "جيروسكوب ON"
                            : "جيروسكوب OFF"}
                        </div>
                      )}
                      {selectedDevice.screenSize && (
                        <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10">
                          {selectedDevice.screenSize}"
                        </div>
                      )}
                      {selectedWeapon && (
                        <div className="px-3 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                          {selectedWeapon.type}
                        </div>
                      )}
                      <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10">
                        ID: {selectedDevice.id}
                      </div>
                    </div>
                  </div>

                  {selectedWeapon && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 pro-card bg-black/20 border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                          <Activity size={18} className="text-primary" /> خصائص
                          السلاح المختار
                        </h3>
                        <span className="text-xs text-slate-500">
                          {selectedWeapon.nameEn}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-32 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/5 group">
                          <GameImage
                            src={selectedWeapon.image}
                            alt={selectedWeapon.nameEn}
                            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              الضرر
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-500"
                                  style={{ width: `${selectedWeapon.damage}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold">
                                {selectedWeapon.damage}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              الارتداد
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-500"
                                  style={{ width: `${selectedWeapon.recoil}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold">
                                {selectedWeapon.recoil}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              السرعة
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{ width: `${selectedWeapon.speed}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold">
                                {selectedWeapon.speed}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              المدى
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${selectedWeapon.range}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold">
                                {selectedWeapon.range}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedDevice.code && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 pro-card bg-bg-card flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30">
                          <Zap size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">
                            كود الحساسية (Code)
                          </h3>
                          <p className="text-slate-400 text-sm">
                            انسخ الكود واستخدمه مباشرة في اللعبة
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-xl border border-white/5 font-bold text-xl text-primary relative">
                        {isEditingCode && isAdmin ? (
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={editCode}
                              onChange={(e) => setEditCode(e.target.value)}
                              className="bg-transparent border-b border-primary text-primary font-bold text-center outline-none w-48"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleUpdateDevice("code", editCode);
                                if (e.key === "Escape") setIsEditingCode(false);
                              }}
                            />
                            <button
                              onClick={() =>
                                handleUpdateDevice("code", editCode)
                              }
                              className="p-1 text-primary hover:bg-primary/10 rounded"
                              title="حفظ"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button
                              onClick={() => setIsEditingCode(false)}
                              className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                              title="إلغاء"
                            >
                              <Plus className="rotate-45" size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-mono">
                              {selectedDevice.code}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setEditCode(selectedDevice.code || "");
                                  setIsEditingCode(true);
                                }}
                                className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary transition-all group/edit"
                                title="تعديل الكود"
                              >
                                <Pencil
                                  size={16}
                                  className="group-hover/edit:scale-110 transition-transform"
                                />
                              </button>
                            )}
                          </div>
                        )}
                        {!isEditingCode && (
                          <button
                            onClick={() =>
                              handleCopy(selectedDevice.code || "")
                            }
                            className="mr-4 p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-white"
                            title="نسخ الكود"
                          >
                            <Copy size={20} />
                          </button>
                        )}
                        <AnimatePresence>
                          {copied && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-xl"
                            >
                              تم النسخ!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Camera Sensitivity */}
                    <SensitivityCard
                      title="حساسية الكاميرا"
                      icon={<Eye className="text-primary" size={20} />}
                      data={selectedDevice.settings.camera}
                      isAdmin={isAdmin}
                      onUpdate={(field, val) =>
                        handleUpdateSetting(
                          "camera",
                          field as keyof SensitivitySettings,
                          val
                        )
                      }
                    />

                    {/* ADS Sensitivity */}
                    <SensitivityCard
                      title="حساسية ADS (إطلاق النار)"
                      icon={<Crosshair className="text-orange-500" size={20} />}
                      data={selectedDevice.settings.ads}
                      isAdmin={isAdmin}
                      onUpdate={(field, val) =>
                        handleUpdateSetting(
                          "ads",
                          field as keyof SensitivitySettings,
                          val
                        )
                      }
                    />

                    {/* Gyroscope Sensitivity */}
                    <div className="md:col-span-2">
                      <SensitivityCard
                        title="حساسية الجيروسكوب"
                        icon={<RefreshCw className="text-primary" size={20} />}
                        data={selectedDevice.settings.gyroscope}
                        fullWidth
                        isAdmin={isAdmin}
                        onUpdate={(field, val) =>
                          handleUpdateSetting(
                            "gyroscope",
                            field as keyof SensitivitySettings,
                            val
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Ratings & Comments Section */}
                  <div className="pro-card p-8 space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <Star
                            className="text-yellow-500"
                            size={24}
                            fill="currentColor"
                          />{" "}
                          تقييمات المستخدمين
                        </h3>
                        <p className="text-slate-400 text-sm">
                          شارك تجربتك مع هذا الكود وساعد الآخرين.
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl font-black text-primary">
                          {(() => {
                            const ratings = sensitivityRatings.filter(
                              (r) => r.deviceId === selectedDevice.id
                            );
                            if (ratings.length === 0) return "0.0";
                            const avg =
                              ratings.reduce((acc, r) => acc + r.rating, 0) /
                              ratings.length;
                            return avg.toFixed(1);
                          })()}
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const ratings = sensitivityRatings.filter(
                              (r) => r.deviceId === selectedDevice.id
                            );
                            const avg =
                              ratings.length > 0
                                ? ratings.reduce(
                                    (acc, r) => acc + r.rating,
                                    0
                                  ) / ratings.length
                                : 0;
                            return (
                              <Star
                                key={star}
                                size={16}
                                className={
                                  star <= Math.round(avg)
                                    ? "text-yellow-500"
                                    : "text-slate-700"
                                }
                                fill={
                                  star <= Math.round(avg)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {
                            sensitivityRatings.filter(
                              (r) => r.deviceId === selectedDevice.id
                            ).length
                          }{" "}
                          تقييم
                        </p>
                      </div>
                    </div>

                    {/* Add Rating Form */}
                    <div className="bg-white/2 rounded-2xl p-6 border border-white/5">
                      <h4 className="font-bold mb-4 text-sm">
                        أضف تقييمك الخاص
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500">
                            التقييم:
                          </span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRatingValue(star)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  size={28}
                                  className={
                                    star <= ratingValue
                                      ? "text-yellow-500"
                                      : "text-slate-700"
                                  }
                                  fill={
                                    star <= ratingValue
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                            placeholder="اكتب تجربتك مع هذا الكود (اختياري)..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
                          />
                          <button
                            onClick={() =>
                              handleRateSensitivity(selectedDevice.id)
                            }
                            disabled={isSubmittingRating || ratingValue === 0}
                            className="absolute bottom-4 left-4 btn-gold px-6 py-2 rounded-lg font-bold text-xs disabled:opacity-50"
                          >
                            {isSubmittingRating ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} />
                            )}
                            إرسال التقييم
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 md:max-h-[400px] md:overflow-y-auto pr-2 custom-scrollbar">
                      {sensitivityRatings.filter(
                        (r) => r.deviceId === selectedDevice.id
                      ).length > 0 ? (
                        sensitivityRatings
                          .filter((r) => r.deviceId === selectedDevice.id)
                          .map((rating) => (
                            <div
                              key={rating.id}
                              className="p-4 bg-white/2 rounded-xl border border-white/5 flex gap-4"
                            >
                              <GameImage
                                src={
                                  rating.userPhoto ||
                                  `https://ui-avatars.com/api/?name=${rating.userName}`
                                }
                                alt={rating.userName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-sm">
                                      {rating.userName}
                                    </h5>
                                    <div className="flex gap-0.5">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                          key={s}
                                          size={10}
                                          className={
                                            s <= rating.rating
                                              ? "text-yellow-500"
                                              : "text-slate-800"
                                          }
                                          fill={
                                            s <= rating.rating
                                              ? "currentColor"
                                              : "none"
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-slate-600">
                                    {rating.createdAt?.toDate
                                      ? rating.createdAt
                                          .toDate()
                                          .toLocaleDateString("ar-EG")
                                      : "الآن"}
                                  </span>
                                </div>
                                {rating.comment && (
                                  <p className="text-sm text-slate-400 leading-relaxed">
                                    {rating.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="py-12 text-center text-slate-600 italic text-sm">
                          لا توجد تعليقات بعد. كن أول من يشارك تجربته!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <SubtleAdBanner />
              </div>
            </motion.div>
          ) : activeTab === "characters" ? (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                  <Users className="text-primary" size={32} /> المميزات والخصائص
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  دليل شامل لقدرات الشخصيات الفريدة وخصائص قطع الأسلحة التي
                  تساعدك في تحسين أدائك في الميدان.
                </p>
              </div>

              <div className="max-w-xs mx-auto mb-12">
                <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
                  اختر القسم
                </label>
                <div
                  className="relative"
                  onMouseLeave={() => setIsFeaturesCategoryDropdownOpen(false)}
                >
                  <button
                    onMouseEnter={() => setIsFeaturesCategoryDropdownOpen(true)}
                    onClick={() =>
                      setIsFeaturesCategoryDropdownOpen(
                        !isFeaturesCategoryDropdownOpen
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
                  >
                    <ChevronDown
                      size={24}
                      className={`text-slate-500 transition-transform duration-300 ${
                        isFeaturesCategoryDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span>
                      {featuresCategory === "characters"
                        ? "الشخصيات"
                        : featuresCategory === "weapons"
                        ? "الأسلحة"
                        : "قطع الأسلحة"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isFeaturesCategoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden py-2"
                      >
                        <button
                          onClick={() => {
                            setFeaturesCategory("characters");
                            setIsFeaturesCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                            featuresCategory === "characters"
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          الشخصيات
                          <Users size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setFeaturesCategory("weapons");
                            setIsFeaturesCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                            featuresCategory === "weapons"
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          الأسلحة
                          <Crosshair size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setFeaturesCategory("attachments");
                            setIsFeaturesCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                            featuresCategory === "attachments"
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          قطع الأسلحة
                          <Settings2 size={16} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {featuresCategory === "characters" ? (
                <div className="space-y-12">
                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
                      اختر الشخصية
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setIsCharacterDropdownOpen(false)}
                    >
                      <button
                        onMouseEnter={() => setIsCharacterDropdownOpen(true)}
                        onClick={() =>
                          setIsCharacterDropdownOpen(!isCharacterDropdownOpen)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
                      >
                        <ChevronDown
                          size={24}
                          className={`text-slate-500 transition-transform duration-300 ${
                            isCharacterDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span>
                          {currentCharacters.find(
                            (c) => c.id === selectedCharacterId
                          )?.arabicName || "اختر الشخصية"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isCharacterDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="md:absolute relative mt-2 md:top-full left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl md:z-20 md:overflow-hidden py-2 md:max-h-[300px] md:overflow-y-auto custom-scrollbar"
                          >
                            {currentCharacters.map((char) => (
                              <button
                                key={char.id}
                                onClick={() => {
                                  setSelectedCharacterId(char.id);
                                  setIsCharacterDropdownOpen(false);
                                }}
                                className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                                  selectedCharacterId === char.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {char.arabicName} ({char.name})
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    {currentCharacters.filter((c) => c.id === selectedCharacterId).map(
                      (char) => (
                        <motion.div
                          key={char.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="pro-card overflow-hidden group border-white/5 max-w-md w-full"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <GameImage
                              src={char.image}
                              alt={char.arabicName}
                              className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                            <div className="absolute top-4 right-4 flex gap-2">
                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingContentData(char);
                                      setIsEditingCharacter(char.id);
                                      setIsAddingContent("character");
                                    }}
                                    className="p-2 rounded-lg bg-black/50 text-primary hover:bg-primary hover:text-black transition-all backdrop-blur-md z-10"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteItem("characters", char.id)}
                                    className="p-2 rounded-lg bg-black/50 text-red-500 hover:bg-red-500 hover:text-white transition-all backdrop-blur-md z-10"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
                              <div>
                                <h3 className="text-2xl font-bold text-white">
                                  {char.arabicName}
                                </h3>
                                <span className="text-xs text-primary font-bold uppercase tracking-widest">
                                  {char.name}
                                </span>
                              </div>
                              <div className="bg-primary text-black px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                                MAX: +{char.levelMaxBonus}
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-4 text-primary">
                              <Trophy size={18} />
                              <span className="font-bold text-sm">
                                {char.ability}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                              {char.description}
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                Special Ability
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i <= 4 ? "bg-primary" : "bg-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              ) : featuresCategory === "weapons" ? (
                <div className="space-y-12">
                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
                      اختر السلاح
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setIsWeaponDropdownOpen && setIsWeaponDropdownOpen(false)}
                    >
                      <button
                        onMouseEnter={() => setIsWeaponDropdownOpen && setIsWeaponDropdownOpen(true)}
                        onClick={() =>
                          setIsWeaponDropdownOpen && setIsWeaponDropdownOpen(!isWeaponDropdownOpen)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
                      >
                        <ChevronDown
                          size={24}
                          className={`text-slate-500 transition-transform duration-300 ${
                            isWeaponDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span>
                          {currentWeapons.find(
                            (w) => w.id === selectedWeaponId
                          )?.nameAr || "اختر السلاح"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isWeaponDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="md:absolute relative mt-2 md:top-full left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl md:z-20 md:overflow-hidden py-2 md:max-h-[300px] md:overflow-y-auto custom-scrollbar"
                          >
                            {Object.entries(groupedWeapons).map(
                              ([type, wpns]) => (
                                <div key={type}>
                                  <div className="px-6 py-2 text-[10px] uppercase font-bold tracking-widest text-primary bg-white/5 border-y border-white/5 text-right">
                                    {categoryNames[type] || type}
                                  </div>
                                  {wpns.map((wpn) => (
                                    <button
                                      key={wpn.id}
                                      onClick={() => {
                                        setSelectedWeaponId(wpn.id);
                                        if (setIsWeaponDropdownOpen) setIsWeaponDropdownOpen(false);
                                      }}
                                      className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                                        selectedWeaponId === wpn.id
                                          ? "bg-primary/10 text-primary"
                                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                                      }`}
                                    >
                                      {wpn.nameAr}
                                    </button>
                                  ))}
                                </div>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex justify-center flex-wrap gap-8">
                    {currentWeapons
                      .filter((w) => w.id === selectedWeaponId)
                      .map((wpn) => (
                        <motion.div
                          key={wpn.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="pro-card overflow-hidden group border-white/5 max-w-md w-full"
                        >
                          <div className="relative h-48 overflow-hidden bg-white/5 flex items-center justify-center p-8">
                            <GameImage
                              src={wpn.image}
                              alt={wpn.nameAr}
                              className="w-full h-full group-hover:scale-110 transition-transform duration-500 object-contain"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingContentData(wpn);
                                      setIsEditingWeapon(wpn.id);
                                      setIsAddingContent("weapon");
                                    }}
                                    className="p-2 rounded-lg bg-black/50 text-primary hover:bg-primary hover:text-black transition-all backdrop-blur-md"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteItem("weapons", wpn.id)}
                                    className="p-2 rounded-lg bg-black/50 text-red-500 hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                              <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-slate-300 text-[10px] font-bold uppercase">
                                {wpn.type}
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-bold text-white">
                                {wpn.nameAr}
                              </h3>
                              <span className="text-xs text-slate-400 font-bold uppercase">
                                {wpn.nameEn}
                              </span>
                            </div>
                            <div className="space-y-3 mt-4">
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                  <span>الضرر</span>
                                  <span className="text-white">{wpn.damage}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-red-500 rounded-full"
                                    style={{ width: `${wpn.damage}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                  <span>سرعة الطلقة</span>
                                  <span className="text-white">{wpn.speed}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${wpn.speed}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                  <span>المدى</span>
                                  <span className="text-white">{wpn.range}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${wpn.range}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
                      اختر القطعة
                    </label>
                    <div
                      className="relative"
                      onMouseLeave={() => setIsAttachmentDropdownOpen(false)}
                    >
                      <button
                        onMouseEnter={() => setIsAttachmentDropdownOpen(true)}
                        onClick={() =>
                          setIsAttachmentDropdownOpen(!isAttachmentDropdownOpen)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
                      >
                        <ChevronDown
                          size={24}
                          className={`text-slate-500 transition-transform duration-300 ${
                            isAttachmentDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span>
                          {currentAttachments.find(
                            (a) => a.id === selectedAttachmentId
                          )?.arabicName || "اختر القطعة"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isAttachmentDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="md:absolute relative mt-2 md:top-full left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl md:z-20 md:overflow-hidden py-2 md:max-h-[400px] md:overflow-y-auto custom-scrollbar"
                          >
                            {Object.entries(groupedAttachments).map(
                              ([type, items]) => (
                                <div key={type}>
                                  <div className="px-6 py-2 text-[10px] uppercase font-bold tracking-widest text-primary bg-white/5 border-y border-white/5 text-right">
                                    {attachmentCategoryNames[type] || type}
                                  </div>
                                  {items.map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        setSelectedAttachmentId(item.id);
                                        setIsAttachmentDropdownOpen(false);
                                      }}
                                      className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                                        selectedAttachmentId === item.id
                                          ? "bg-primary/10 text-primary"
                                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                                      }`}
                                    >
                                      {item.arabicName}
                                    </button>
                                  ))}
                                </div>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {isAdmin && dbAttachments.length < ATTACHMENTS.length && (
                      <div className="flex justify-center">
                        <button
                          onClick={seedAttachments}
                          className="bg-primary/10 text-primary border border-primary/20 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/20 transition-all"
                        >
                          <RefreshCw size={16} />
                          مزامنة بيانات القطع مع قاعدة البيانات
                        </button>
                      </div>
                    )}

                    <div className="flex justify-center">
                      {currentAttachments
                        .filter((a) => a.id === selectedAttachmentId)
                        .map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="pro-card overflow-hidden group border-white/5 max-w-md w-full"
                          >
                            <div className="relative h-48 overflow-hidden bg-white/5 flex items-center justify-center p-8">
                              <GameImage
                                src={item.image}
                                alt={item.arabicName}
                                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 right-4 flex gap-2">
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingContentData(item);
                                        setIsEditingAttachment(item.id);
                                        setIsAddingContent("attachment");
                                      }}
                                      className="p-2 rounded-lg bg-black/50 text-primary hover:bg-primary hover:text-black transition-all backdrop-blur-md"
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      onClick={() => deleteItem("attachments", item.id)}
                                      className="p-2 rounded-lg bg-black/50 text-red-500 hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-slate-300 text-[10px] font-bold uppercase">
                                  {item.type}
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-white mb-2">
                                {item.arabicName}
                              </h3>

                              <>
                                <div className="flex items-center gap-2 text-primary mb-3">
                                    <Zap size={16} />
                                    <span className="text-sm font-bold">
                                      {item.effect}
                                    </span>
                                  </div>
                                  <p className="text-slate-400 text-sm leading-relaxed">
                                    {item.description}
                                  </p>
                                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                      Weapon Attachment
                                    </span>
                                    <div className="flex items-center gap-1 text-primary">
                                      <Star size={10} fill="currentColor" />
                                      <Star size={10} fill="currentColor" />
                                      <Star size={10} fill="currentColor" />
                                    </div>
                                  </div>
                                </>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              <SubtleAdBanner />
            </motion.div>
          ) : activeTab === "loadouts" ? (
            <motion.div
              key="loadouts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto space-y-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                  <Crosshair className="text-primary" size={32} /> أفضل تركيبات
                  الأسلحة
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  دليل شامل لأفضل القطع والمرفقات لكل سلاح في ببجي موبايل لضمان
                  أقل ارتداد وأعلى دقة.
                </p>
              </div>

              <div className="space-y-12">
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
                    اختر السلاح
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLoadoutWeaponId}
                      onChange={(e) =>
                        setSelectedLoadoutWeaponId(e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer text-right"
                    >
                      {Object.entries(groupedLoadoutWeapons).map(
                        ([type, weapons]) => (
                          <optgroup
                            key={type}
                            label={categoryNames[type] || type}
                            className="bg-slate-900 text-primary font-bold"
                          >
                            {weapons.map((weapon) => (
                              <option
                                key={weapon.id}
                                value={weapon.id}
                                className="bg-slate-900 text-white font-normal"
                              >
                                {weapon.nameAr} ({weapon.nameEn})
                              </option>
                            ))}
                          </optgroup>
                        )
                      )}
                    </select>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ChevronDown size={24} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  {currentWeapons.filter((w) => w.id === selectedLoadoutWeaponId).map(
                    (weapon) => (
                      <motion.div
                        key={weapon.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pro-card p-6 border-white/5 bg-white/2 hover:border-primary/30 transition-all group max-w-md w-full"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                              {weapon.image ? (
                                <GameImage
                                  src={weapon.image}
                                  alt={weapon.nameEn}
                                  className="w-14 h-14 group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <Zap size={28} />
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {weapon.nameAr}
                              </h3>
                              <span className="text-xs text-primary font-bold uppercase tracking-widest">
                                {weapon.nameEn} • {weapon.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star size={14} fill="currentColor" />
                              <span className="text-sm font-black">
                                {(() => {
                                  const ratings = weaponRatings.filter(
                                    (r) => r.weaponId === weapon.id
                                  );
                                  if (ratings.length === 0) return "0.0";
                                  const avg =
                                    ratings.reduce(
                                      (acc, curr) => acc + curr.rating,
                                      0
                                    ) / ratings.length;
                                  return avg.toFixed(1);
                                })()}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">
                              (
                              {
                                weaponRatings.filter(
                                  (r) => r.weaponId === weapon.id
                                ).length
                              }{" "}
                              تقييم)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                            القطع الموصى بها:
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {weapon.bestAttachments?.muzzle && (
                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                  {currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.muzzle
                                  )?.image ? (
                                    <GameImage
                                      src={
                                        currentAttachments.find(
                                          (a) =>
                                            a.id ===
                                            weapon.bestAttachments?.muzzle
                                        )?.image || ""
                                      }
                                      alt="Muzzle"
                                      className="w-8 h-8"
                                    />
                                  ) : (
                                    <Target size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                                    Muzzle
                                  </p>
                                  <p className="text-sm font-bold text-white">
                                    {currentAttachments.find(
                                      (a) =>
                                        a.id === weapon.bestAttachments?.muzzle
                                    )?.arabicName ||
                                      weapon.bestAttachments.muzzle}
                                  </p>
                                </div>
                              </div>
                            )}
                            {weapon.bestAttachments?.grip && (
                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                  {currentAttachments.find(
                                    (a) => a.id === weapon.bestAttachments?.grip
                                  )?.image ? (
                                    <GameImage
                                      src={
                                        currentAttachments.find(
                                          (a) =>
                                            a.id ===
                                            weapon.bestAttachments?.grip
                                        )?.image || ""
                                      }
                                      alt="Grip"
                                      className="w-8 h-8"
                                    />
                                  ) : (
                                    <Activity size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                                    Grip
                                  </p>
                                  <p className="text-sm font-bold text-white">
                                    {currentAttachments.find(
                                      (a) =>
                                        a.id === weapon.bestAttachments?.grip
                                    )?.arabicName ||
                                      weapon.bestAttachments.grip}
                                  </p>
                                </div>
                              </div>
                            )}
                            {weapon.bestAttachments?.magazine && (
                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                  {currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.magazine
                                  )?.image ? (
                                    <GameImage
                                      src={
                                        currentAttachments.find(
                                          (a) =>
                                            a.id ===
                                            weapon.bestAttachments?.magazine
                                        )?.image || ""
                                      }
                                      alt="Magazine"
                                      className="w-8 h-8"
                                    />
                                  ) : (
                                    <Zap size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                                    Magazine
                                  </p>
                                  <p className="text-sm font-bold text-white">
                                    {currentAttachments.find(
                                      (a) =>
                                        a.id ===
                                        weapon.bestAttachments?.magazine
                                    )?.arabicName ||
                                      weapon.bestAttachments.magazine}
                                  </p>
                                </div>
                              </div>
                            )}
                            {weapon.bestAttachments?.stock && (
                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                  {currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.stock
                                  )?.image ? (
                                    <GameImage
                                      src={
                                        currentAttachments.find(
                                          (a) =>
                                            a.id ===
                                            weapon.bestAttachments?.stock
                                        )?.image || ""
                                      }
                                      alt="Stock"
                                      className="w-8 h-8"
                                    />
                                  ) : (
                                    <Shield size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                                    Stock
                                  </p>
                                  <p className="text-sm font-bold text-white">
                                    {currentAttachments.find(
                                      (a) =>
                                        a.id === weapon.bestAttachments?.stock
                                    )?.arabicName ||
                                      weapon.bestAttachments.stock}
                                  </p>
                                </div>
                              </div>
                            )}
                            {weapon.bestAttachments?.scope && (
                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                  {currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.scope
                                  )?.image ? (
                                    <GameImage
                                      src={
                                        currentAttachments.find(
                                          (a) =>
                                            a.id ===
                                            weapon.bestAttachments?.scope
                                        )?.image || ""
                                      }
                                      alt="Scope"
                                      className="w-8 h-8"
                                    />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                                    Scope
                                  </p>
                                  <p className="text-sm font-bold text-white">
                                    {currentAttachments.find(
                                      (a) =>
                                        a.id === weapon.bestAttachments?.scope
                                    )?.arabicName ||
                                      weapon.bestAttachments.scope}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedWeaponToRate(weapon);
                            setIsRatingModalOpen(true);
                          }}
                          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2"
                        >
                          <Star size={14} />
                          <span>تقييم هذه التشكيلة</span>
                        </button>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <SubtleAdBanner />
            </motion.div>
          ) : activeTab === "events" ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-16"
            >
              {/* Sub-navigation for Events */}
              <div className="flex justify-center gap-4 mb-12">
                <button
                  onClick={() => setEventsSubTab("list")}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                    eventsSubTab === "list" ? "btn-gold" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  الفعاليات القادمة
                </button>
                <button
                  onClick={() => setEventsSubTab("clips")}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                    eventsSubTab === "clips" ? "btn-gold" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  لقطاتكم
                </button>
              </div>

              {/* Admin Competition Settings Panel */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pro-card p-8 bg-bg-card/80 backdrop-blur-xl border-primary/20 mb-12"
                >
                  <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        إعدادات المسابقات والفعاليات
                      </h3>
                      <p className="text-xs text-slate-500">
                        تحكم يدوي في تواريخ البداية والنهاية
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Event Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                        نوع الفعالية (معرف)
                      </label>
                      <input
                        type="text"
                        value={selectedSettingId}
                        onChange={(e) => setSelectedSettingId(e.target.value)}
                        placeholder="مثال: royal-pass"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                        تاريخ ووقت البداية
                      </label>
                      <input
                        type="datetime-local"
                        value={settingStartDate}
                        onChange={(e) => setSettingStartDate(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                        تاريخ ووقت النهاية
                      </label>
                      <input
                        type="datetime-local"
                        value={settingEndDate}
                        onChange={(e) => setSettingEndDate(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* Hide All Events Toggle */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                        إخفاء كافة الفعاليات
                      </label>
                      <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                        <button
                          onClick={() =>
                            setIsAllEventsHidden(!isAllEventsHidden)
                          }
                          className={`w-12 h-6 rounded-full transition-all relative ${
                            isAllEventsHidden ? "bg-primary" : "bg-slate-700"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              isAllEventsHidden ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                        <span className="text-xs text-slate-400 font-bold">
                          {isAllEventsHidden ? "مخفي" : "ظاهر"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <button
                      onClick={() => handleUpdateCompetitionSettings(selectedSettingId, {}, false)}
                      disabled={isUpdatingSettings}
                      className="flex-1 min-w-[200px] py-4 bg-primary text-black rounded-xl font-black hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUpdatingSettings ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      <span>حفظ التغييرات</span>
                    </button>
                    <button
                      onClick={() => handleUpdateCompetitionSettings(selectedSettingId, {}, true)}
                      disabled={isUpdatingSettings}
                      className="flex-1 min-w-[200px] py-4 bg-red-600 text-white rounded-xl font-black hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUpdatingSettings ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <PowerOff size={20} />
                      )}
                      <span>إيقاف الفعالية فوراً</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {eventsSubTab === "list" ? (
                <>
                  {/* Admin Section */}
                  <div className="space-y-12 mb-16">
                    {!isAdmin ? (
                      <div className="pro-card p-8 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                        <Lock className="text-slate-700 mb-4" size={32} />
                        <h3 className="text-lg font-bold text-slate-500 mb-4">
                          لوحة تحكم المسؤول
                        </h3>
                        <button
                          onClick={handleLogin}
                          className="bg-white/5 hover:bg-primary hover:text-black px-6 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
                        >
                          تسجيل الدخول كمسؤول لرؤية القوالب
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <button
                            onClick={() => setShowAddEventModal(true)}
                            className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                          >
                            <Calendar
                              className="text-primary group-hover:scale-110 transition-transform"
                              size={24}
                            />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              إضافة فعالية
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              videoUploadRef.current?.scrollIntoView({
                                behavior: "smooth",
                              })
                            }
                            className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                          >
                            <Video
                              className="text-primary group-hover:scale-110 transition-transform"
                              size={24}
                            />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              رفع فيديو
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              showNotification(
                                "اختر فعالية من القائمة أدناه لحذفها",
                                "info"
                              )
                            }
                            className="p-6 pro-card border-red-500/20 bg-red-500/5 flex flex-col items-center gap-3 hover:bg-red-500/10 transition-colors group"
                          >
                            <Trash2
                              className="text-red-500 group-hover:scale-110 transition-transform"
                              size={24}
                            />
                            <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                              حذف فعالية
                            </span>
                          </button>
                          <button
                            onClick={withdrawAuthority}
                            className="p-6 pro-card border-orange-500/20 bg-orange-500/5 flex flex-col items-center gap-3 hover:bg-orange-500/10 transition-colors group"
                          >
                            <UserMinus
                              className="text-orange-500 group-hover:scale-110 transition-transform"
                              size={24}
                            />
                            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                              سحب الصلاحية
                            </span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          {templates
                            .filter((t) => t.type === "event")
                            .map((tmpl) => (
                              <div key={tmpl.id} className="relative group">
                                <button
                                  onClick={() => {
                                    setNewEvent({
                                      title: tmpl.label,
                                      description: tmpl.desc,
                                      status: "upcoming",
                                      type: "standard",
                                    });
                                    setShowAddEventModal(true);
                                  }}
                                  className="w-full pro-card p-6 border-white/5 bg-white/2 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center text-center"
                                >
                                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-black transition-all mb-4">
                                    {getIconComponent(tmpl.icon)}
                                  </div>
                                  <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                                    {tmpl.label}
                                  </h4>
                                  <p className="text-[10px] text-slate-500">
                                    {tmpl.desc}
                                  </p>
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() =>
                                      deleteItem("templates", tmpl.id)
                                    }
                                    className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          {isAdmin && (
                            <button
                              onClick={() => {
                                setNewTemplate({
                                  ...newTemplate,
                                  type: "event",
                                });
                                setShowAddTemplateModal(true);
                              }}
                              className="pro-card p-6 border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-center group"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all mb-4">
                                <Plus size={24} />
                              </div>
                              <h4 className="font-bold text-sm text-primary">
                                إضافة قالب
                              </h4>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin Video Upload Section */}
                  {isAdmin && (
                    <section
                      ref={videoUploadRef}
                      className="pro-card p-8 border-primary/20 bg-primary/5"
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
                          <Video size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            رفع مقطع فيديو (خاص بالمسؤول)
                          </h2>
                          <p className="text-xs text-primary/60 font-bold uppercase tracking-widest mt-1">
                            Admin Dashboard • {ADMIN_EMAIL}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                              عنوان المقطع
                            </label>
                            <input
                              type="text"
                              value={videoTitle}
                              onChange={(e) => setVideoTitle(e.target.value)}
                              placeholder="مثال: لقطات احترافية من التحديث الجديد"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                              وصف الفعالية
                            </label>
                            <textarea
                              value={videoDesc}
                              onChange={(e) => setVideoDesc(e.target.value)}
                              placeholder="اكتب تفاصيل الفعالية هنا..."
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors cursor-pointer group relative">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                            <Upload
                              className="text-slate-500 group-hover:text-primary transition-colors"
                              size={32}
                            />
                          </div>
                          <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                            اسحب وأفلت المقطع هنا أو انقر للاختيار
                          </p>
                          <p className="text-[10px] text-slate-600 mt-2">
                            MP4, MOV (Max 50MB)
                          </p>
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="video/*"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleVideoUpload}
                        className="mt-8 w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-3"
                      >
                        <Play size={20} fill="currentColor" /> نشر المقطع في
                        الفعاليات
                      </button>
                    </section>
                  )}

                  {/* Events List Section */}
                  {(competitionSettings.some((s) => s.isAllEventsHidden) &&
                    !isAdmin) ||
                  (!isCompetitionActive("daily-tournament") && !isAdmin) ? (
                    <div className="pro-card p-12 bg-bg-card/50 border-white/5 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700 mb-6">
                        <Lock size={40} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-500 mb-2">
                        المسابقة مغلقة حالياً
                      </h2>
                      <p className="text-slate-600 max-w-md">
                        لا توجد بطولات يومية نشطة في الوقت الحالي. ترقبوا
                        المواعيد القادمة!
                      </p>
                    </div>
                  ) : (
                    <section>
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                          <Calendar className="text-primary" size={32} />{" "}
                          الفعاليات القادمة
                        </h2>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                          Upcoming Events
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.filter(
                          (e) =>
                            isAdmin ||
                            (!e.isHidden &&
                              !competitionSettings.some(
                                (s) => s.isAllEventsHidden || s.isTournamentsHidden
                              ))
                        ).length > 0 ? (
                          events
                            .filter(
                              (e) =>
                                isAdmin ||
                                (!e.isHidden &&
                                  !competitionSettings.some(
                                    (s) => s.isAllEventsHidden || s.isTournamentsHidden
                                  ))
                            )
                            .map((event) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`pro-card p-8 relative group ${
                                  event.isHidden
                                    ? "opacity-60 border-dashed border-red-500/30"
                                    : ""
                                }`}
                              >
                                {event.isHidden && (
                                  <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                                    <Eye size={10} /> مخفي
                                  </div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                      <Trophy size={28} />
                                    </div>
                                    <div>
                                      <h3 className="text-2xl font-bold">
                                        {event.title}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-sm mt-1">
                                        <div className="flex items-center gap-2">
                                          <Timer size={14} />
                                          <span>
                                            {new Date(
                                              event.date
                                            ).toLocaleDateString("ar-EG")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                      event.status === "upcoming"
                                        ? "bg-sky-500/20 text-sky-500"
                                        : event.status === "ongoing"
                                        ? "bg-green-500/20 text-green-500"
                                        : "bg-slate-500/20 text-slate-500"
                                    }`}
                                  >
                                    {event.status}
                                  </div>
                                </div>
                                <p className="text-slate-400 leading-relaxed mb-8">
                                  {event.description ||
                                    "لا يوجد وصف متاح لهذه الفعالية."}
                                </p>
                                <div className="flex items-center justify-between">
                                  <button className="btn-gold px-6 py-2 rounded-xl font-bold text-sm">
                                    التفاصيل
                                  </button>
                                  {isAdmin && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          toggleEventVisibility(
                                            event.id,
                                            !!event.isHidden
                                          )
                                        }
                                        className={`p-2 rounded-lg transition-all ${
                                          event.isHidden
                                            ? "text-green-500 bg-green-500/10"
                                            : "text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                                        }`}
                                        title={
                                          event.isHidden
                                            ? "إظهار الفعالية"
                                            : "إخفاء الفعالية"
                                        }
                                      >
                                        {event.isHidden ? (
                                          <Eye size={18} />
                                        ) : (
                                          <Eye
                                            size={18}
                                            className="opacity-40"
                                          />
                                        )}
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteItem("events", event.id)
                                        }
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div className="col-span-full py-24 pro-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                              <Calendar className="text-slate-700" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-500 mb-3">
                              لا توجد فعاليات نشطة حالياً
                            </h3>
                            <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                              نحن نعمل على تنظيم فعاليات وبطولات حماسية لمجتمع
                              ببجيكوم . ترقبوا الإعلانات القادمة هنا!
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="space-y-12">
                  <div className="text-center space-y-4 mb-12">
                    <h2 className="text-4xl font-black gold-shimmer">
                      اللقطات الفائزة (Winning Clips)
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                      شاهد اللقطات الفائزة في مسابقاتنا على تيك توك. شارك لقطتك على تيك توك مع الإشارة لحسابنا لفرصة الفوز والظهور هنا!
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="pro-card p-8 bg-bg-card/50 border-primary/20 mb-12">
                      <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <Trophy size={20} />
                        إضافة لقطة فائزة (لوحة المسؤول)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">عنوان اللقطة واسم الفائز</label>
                          <input
                            type="text"
                            placeholder="مثال: الفائز بالمركز الأول - أحمد"
                            value={newClipTitle}
                            onChange={(e) => setNewClipTitle(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">رابط الفيديو (تيك توك/يوتيوب)</label>
                          <input
                            type="text"
                            placeholder="رابط الفيديو"
                            value={newClipUrl}
                            onChange={(e) => setNewClipUrl(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleAddWinningClip}
                        disabled={isSubmittingClip || !newClipTitle || !newClipUrl}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingClip ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>جاري الرفع والتحليل...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={20} />
                            <span>رفع اللقطة الفائزة</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...clips]
                      .filter(clip => clip.isWinner)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((clip) => (
                        <motion.div
                          key={clip.id}
                          layout
                          className="pro-card overflow-hidden group border-yellow-500/20 relative"
                        >
                          <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                            <Trophy size={12} />
                            لقطة فائزة
                          </div>
                          <div className="aspect-video bg-black relative">
                            <iframe
                              src={
                                clip.videoUrl.includes("youtube.com") ||
                                clip.videoUrl.includes("youtu.be")
                                  ? clip.videoUrl
                                      .replace("watch?v=", "embed/")
                                      .replace(
                                        "youtu.be/",
                                        "youtube.com/embed/"
                                      )
                                  : clip.videoUrl
                              }
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                          <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg mb-1 line-clamp-1 text-yellow-400">
                                  {clip.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <GameImage
                                    src={
                                      clip.userPhoto ||
                                      `https://ui-avatars.com/api/?name=${clip.userName}`
                                    }
                                    alt={clip.userName}
                                    className="w-5 h-5 rounded-full border border-yellow-500/30"
                                  />
                                  <span>{clip.userName}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === "rate" ? (
            <motion.div
              key="rate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-16"
            >
              <div className="best-clip-section">
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black gold-shimmer">
                      حلل مستواك (AI Analysis)
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                      ارفع لقطتك الآن واحصل على تحليل فوري مع نصائح احترافية لتطوير لعبك.
                    </p>
                  </div>

                  <div className="pro-card p-8 bg-bg-card/50 border-white/10">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div className="flex-1 space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">عنوان اللقطة</label>
                            <input
                              type="text"
                              placeholder="مثال: سحب سكواد كامل"
                              value={newClipTitle}
                              onChange={(e) => setNewClipTitle(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">رابط الفيديو أو رفع ملف</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="YouTube/TikTok Link"
                                value={newClipUrl}
                                onChange={(e) => setNewClipUrl(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                              />
                              <input
                                type="file"
                                accept="video/*"
                                id="analysis-file-upload"
                                className="hidden"
                                onChange={handleClipFileChange}
                              />
                              <label
                                htmlFor="analysis-file-upload"
                                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-slate-400 hover:text-primary flex items-center justify-center"
                              >
                                <Upload size={20} />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">وصف اللقطة يساعدنا في التحليل </label>
                          <textarea
                            placeholder="اكتب تفاصيل اللقطة هنا (مثال: كنت أستخدم سلاح M416 مع سكوب 4، واجهت سكواد في منطقة مفتوحة...)"
                            value={videoDesc}
                            onChange={(e) => setVideoDesc(e.target.value)}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                          />
                        </div>
                        
                        <button
                          onClick={handleSubmitClip}
                          disabled={isSubmittingClip}
                          className="w-full py-4 bg-primary text-black rounded-xl font-black hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isSubmittingClip ? (
                            <Loader2 size={24} className="animate-spin" />
                          ) : (
                            <Sparkles size={24} />
                          )}
                          <span>تحليل اللقطة </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="grid grid-cols-1 gap-8">
                    {[...clips]
                      .filter(c => c.authorId === user?.uid)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((clip) => (
                        <motion.div
                          key={clip.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="pro-card overflow-hidden border-white/5 bg-bg-card/30"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            <div className="aspect-video bg-black">
                              <iframe
                                src={
                                  clip.videoUrl.includes("youtube.com") ||
                                  clip.videoUrl.includes("youtu.be")
                                    ? clip.videoUrl
                                        .replace("watch?v=", "embed/")
                                        .replace(
                                          "youtu.be/",
                                          "youtube.com/embed/"
                                        )
                                    : clip.videoUrl
                                }
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                            <div className="p-8 space-y-6">
                              <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-black text-white">{clip.title}</h3>
                                <span className="text-[10px] text-slate-500 font-bold">{new Date(clip.createdAt).toLocaleDateString('ar-EG')}</span>
                              </div>

                              {clip.aiAnalysis?.xray_results ? (
                                <div className="space-y-6 p-6 bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-500/30 rounded-2xl relative overflow-hidden" dir="rtl">
                                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>
                                  
                                  <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                      <Activity className="text-yellow-500" size={24} />
                                    </div>
                                    <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                                      لوحة التحكم الذهبية (X-Ray Analysis)
                                    </h4>
                                  </div>

                                  {/* X-Ray Stats */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CircularScore 
                                      value={clip.aiAnalysis.xray_results.recoil_stability_score} 
                                      label="ثبات الارتداد" 
                                      icon={Target} 
                                      isGolden={true} 
                                    />
                                    <CircularScore 
                                      value={clip.aiAnalysis.xray_results.headshot_accuracy_percent} 
                                      label="دقة الهيدشوت" 
                                      icon={Crosshair} 
                                      isGolden={true} 
                                    />
                                    <div className="p-6 bg-black/40 border border-yellow-500/20 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <Zap className="text-yellow-500 mb-4" size={32} />
                                      <span className="text-sm font-bold text-slate-400 mb-2">سرعة الحركة</span>
                                      <span className="text-3xl font-black text-yellow-400 mt-2">{clip.aiAnalysis.xray_results.movement_speed}</span>
                                    </div>
                                  </div>

                                  {/* Golden Dashboard Notes */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-black/40 border border-yellow-500/20 rounded-xl">
                                      <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                        <Trophy size={18} />
                                        <span className="font-bold">التقييم الاحترافي</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.golden_dashboard?.pro_evaluation || 'لا يوجد تقييم متاح.'}
                                      </p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-yellow-500/20 rounded-xl">
                                      <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                        <Lightbulb size={18} />
                                        <span className="font-bold">نصيحة تكتيكية</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.golden_dashboard?.tactical_advice || 'لا توجد نصائح متاحة.'}
                                      </p>
                                    </div>
                                  </div>

                                  {clip.aiAnalysis.strategic_note && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mt-4">
                                      <div className="flex items-center gap-2 text-red-400 mb-2">
                                        <Target size={18} />
                                        <span className="font-bold">التحليل ( Analysis)</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.strategic_note}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : clip.aiAnalysis?.analysis ? (
                                <div className="space-y-6" dir="rtl">
                                  {/* Analysis Stats */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <span className="text-xs text-slate-400 mb-1">تقييم المحترفين</span>
                                      <span className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{clip.aiAnalysis.analysis?.pro_rating || '-'}</span>
                                    </div>
                                    <CircularScore 
                                      value={clip.aiAnalysis.analysis?.recoil_control || 0} 
                                      label="ثبات الارتداد" 
                                      icon={Target} 
                                    />
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <span className="text-xs text-slate-400 mb-1">سرعة رد الفعل</span>
                                      <span className="text-2xl font-black text-orange-400">
                                        <AnimatedNumber value={clip.aiAnalysis.analysis?.reaction_time_ms || 0} />ms
                                      </span>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <span className="text-xs text-slate-400 mb-1">كفاءة الحركة</span>
                                      <span className="text-2xl font-black text-green-400">{clip.aiAnalysis.analysis?.movement_efficiency || '0%'}</span>
                                    </div>
                                  </div>

                                  {/* Technical Fixes */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                                      <div className="flex items-center gap-2 text-primary mb-3">
                                        <Settings size={18} />
                                        <span className="font-bold">تعديل الحساسية</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.technical_fix?.sensitivity_delta || 'لا توجد تعديلات مقترحة.'}
                                      </p>
                                    </div>
                                    <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
                                      <div className="flex items-center gap-2 text-sky-500 mb-3">
                                        <Monitor size={18} />
                                        <span className="font-bold">نصيحة الجرافيكس</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.technical_fix?.graphic_settings_advice || 'لا توجد نصائح حالياً.'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Strategic Note */}
                                  <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                    <div className="flex items-center gap-2 text-orange-500 mb-3">
                                      <Target size={18} />
                                      <span className="font-bold">ملاحظة تكتيكية</span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                      {clip.aiAnalysis.strategic_note || 'استمر في التدريب!'}
                                    </p>
                                  </div>

                                  {/* Meta */}
                                  <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500">
                                    <Bot size={12} />
                                    <span>Engine: {clip.aiAnalysis.json_meta?.engine || 'Unknown'}</span>
                                  </div>
                                </div>
                              ) : clip.aiAnalysis ? (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-slate-400">
                                  هذا التحليل قديم ولا يدعم لوحة التحكم الذهبية.
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                                  <Loader2 className="animate-spin mb-4" size={32} />
                                  <p className="font-bold">جاري تحليل اللقطة...</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                    {clips.filter(c => c.authorId === user?.uid).length === 0 && (
                      <div className="pro-card p-20 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-700">
                          <Sparkles size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-500 mb-3">لا توجد تحليلات سابقة</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                          ارفع لقطتك الأولى الآن واحصل على تقرير مفصل لتطوير مستواك.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "game-events" ? (
            <motion.div
              key="game-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-black gold-shimmer">
                  فعاليات اللعبة
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                  تابع أحدث فعاليات الصناديق والرويال باس في ببجي موبايل مع
                  التوقيت الدقيق لانتهاء كل فعالية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "الرويال باس - الموسم الحالي",
                    desc: "الموسم الجديد من الرويال باس مع مكافآت أسطورية وحصرية.",
                    endDate: "2026-05-20T00:00:00Z",
                    icon: <Zap className="text-yellow-500" size={32} />,
                    color: "from-yellow-500/20 to-transparent",
                    borderColor: "border-yellow-500/20",
                    category: "الموسم",
                  },
                  {
                    title: "مود: مدينة المستقبل (Cyber City)",
                    desc: "استكشف خريطة إرانغل بحلتها الجديدة مع تقنيات المستقبل والمركبات الطائرة.",
                    endDate: "2026-06-15T00:00:00Z",
                    icon: <Flame className="text-orange-500" size={32} />,
                    color: "from-orange-500/20 to-transparent",
                    borderColor: "border-orange-500/20",
                    category: "مود خاص",
                  },
                  {
                    title: "مترو رويال (Metro Royale)",
                    desc: "الموسم الجديد من مترو رويال مع أسلحة ومعدات جديدة كلياً.",
                    endDate: "2026-05-30T00:00:00Z",
                    icon: <Shield className="text-slate-400" size={32} />,
                    color: "from-slate-400/20 to-transparent",
                    borderColor: "border-slate-400/20",
                    category: "مود دائم",
                  },
                  {
                    title: "عالم العجائب (WOW)",
                    desc: "خرائط وتحديات جديدة من تصميم اللاعبين مع مكافآت أسبوعية.",
                    endDate: "2026-12-31T00:00:00Z",
                    icon: <Compass className="text-indigo-500" size={32} />,
                    color: "from-indigo-500/20 to-transparent",
                    borderColor: "border-indigo-500/20",
                    category: "مود إبداعي",
                  },
                  {
                    title: "تعاون: سيارات Lamborghini",
                    desc: "احصل على أسرع وأفخم سيارات لامبورغيني الآن في ساحة المعركة.",
                    endDate: "2026-04-30T00:00:00Z",
                    icon: <Sparkles className="text-cyan-500" size={32} />,
                    color: "from-cyan-500/20 to-transparent",
                    borderColor: "border-cyan-500/20",
                    category: "تعاون",
                  },
                  {
                    title: "الصندوق المميز (Premium Crate)",
                    desc: "أقوى البدلات والأسلحة القابلة للتطوير متوفرة الآن في الصندوق المميز.",
                    endDate: "2026-04-25T00:00:00Z",
                    icon: <Trophy className="text-purple-500" size={32} />,
                    color: "from-purple-500/20 to-transparent",
                    borderColor: "border-purple-500/20",
                    category: "صناديق",
                  },
                  {
                    title: "عجلة الحظ: M416 Glacier",
                    desc: "فرصة الحصول على سلاح M416 الثلجي الأسطوري وتطويره للمستوى الأقصى.",
                    endDate: "2026-05-05T00:00:00Z",
                    icon: <Target className="text-blue-400" size={32} />,
                    color: "from-blue-400/20 to-transparent",
                    borderColor: "border-blue-400/20",
                    category: "عجلة الحظ",
                  },
                  {
                    title: "الصندوق الكلاسيكي (Classic Crate)",
                    desc: "مجموعة من العناصر الكلاسيكية النادرة التي يبحث عنها الجميع.",
                    endDate: "2026-05-10T00:00:00Z",
                    icon: <Star className="text-blue-500" size={32} />,
                    color: "from-blue-500/20 to-transparent",
                    borderColor: "border-blue-500/20",
                    category: "صناديق",
                  },
                  {
                    title: "فعالية: هدايا الربيع",
                    desc: "سجل دخول يومياً للحصول على قسائم صناديق وعناصر تجميلية مجانية.",
                    endDate: "2026-04-20T00:00:00Z",
                    icon: <Gift className="text-pink-500" size={32} />,
                    color: "from-pink-500/20 to-transparent",
                    borderColor: "border-pink-500/20",
                    category: "فعالية",
                  },
                  {
                    title: "صندوق الإمداد (Supply Crate)",
                    desc: "عناصر متنوعة ومفيدة لتجهيز شخصيتك بأفضل المظاهر.",
                    endDate: "2026-04-18T00:00:00Z",
                    icon: <Package className="text-green-500" size={32} />,
                    color: "from-green-500/20 to-transparent",
                    borderColor: "border-green-500/20",
                    category: "صناديق",
                  },
                  {
                    title: "محطة الـ UC (UC Station)",
                    desc: "احصل على مكافآت إضافية تصل إلى 200% عند شحن الـ UC خلال فترة الفعالية.",
                    endDate: "2026-04-15T00:00:00Z",
                    icon: <Activity className="text-yellow-400" size={32} />,
                    color: "from-yellow-400/20 to-transparent",
                    borderColor: "border-yellow-400/20",
                    category: "شحن",
                  },
                ].map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`pro-card p-6 bg-gradient-to-br ${event.color} ${event.borderColor} border relative overflow-hidden group flex flex-col h-full`}
                  >
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      {event.icon}
                    </div>

                    <div className="flex-1 space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          {event.icon}
                        </div>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400">
                          {event.category}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-black leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {event.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">
                        الوقت المتبقي للانتهاء
                      </p>
                      <CountdownTimer endDate={event.endDate} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <SubtleAdBanner />
            </motion.div>
          ) : activeTab === "giveaways" ? (
            <motion.div
              key="giveaways"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-16"
            >
              {/* Monthly Royal Pass Giveaway Section */}
              {!isCompetitionActive("royal-pass") && !isAdmin ? (
                <div className="pro-card p-12 bg-bg-card/50 border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700 mb-6">
                    <Lock size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-500 mb-2">
                    المسابقة مغلقة حالياً
                  </h2>
                  <p className="text-slate-600 max-w-md">
                    ترقبوا السحب القادم قريباً. سيتم الإعلان عن الموعد الجديد
                    عبر قنواتنا الرسمية.
                  </p>
                </div>
              ) : (
                <section className="pro-card p-8 bg-gradient-to-br from-bg-card via-primary/5 to-bg-card border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                  <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                    {/* Left: Form */}
                    <div className="flex-1 w-full space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                          <Gift size={28} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            سحب الرويال باس الشهري
                          </h2>
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                            Monthly Royal Pass Giveaway
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed">
                        سجل الآن للحصول على فرصة للفوز بالرويال باس لهذا الشهر
                        مجاناً! سيتم اختيار الفائز عشوائياً من بين المشاركين.
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                              الاسم في اللعبة
                            </label>
                            <input
                              type="text"
                              value={giveawayPlayerName}
                              onChange={(e) =>
                                setGiveawayPlayerName(e.target.value)
                              }
                              placeholder="مثال: PUBG_PRO_1"
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                              ID اللاعب
                            </label>
                            <input
                              type="text"
                              value={giveawayPlayerId}
                              onChange={(e) =>
                                setGiveawayPlayerId(e.target.value)
                              }
                              placeholder="مثال: 5123456789"
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSubmitGiveawayEntry}
                          disabled={isSubmittingEntry || !user}
                          className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmittingEntry ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={20} />
                          )}
                          {user
                            ? "تأكيد المشاركة في السحب"
                            : "يرجى تسجيل الدخول للمشاركة"}
                        </button>

                        {isAdmin && (
                          <button
                            onClick={handlePickWinner}
                            className="w-full py-2 border border-primary/30 text-primary rounded-xl text-xs font-bold hover:bg-primary/10 transition-all mt-2"
                          >
                            سحب فائز جديد (للمسؤول فقط)
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Last Winner Display */}
                    <div className="w-full md:w-80 flex flex-col items-center justify-center">
                      <div className="pro-card p-8 bg-gradient-to-b from-yellow-400/20 to-transparent border-yellow-500/30 flex flex-col items-center text-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-200/5 to-yellow-400/10 opacity-50 animate-pulse-slow" />

                        <Trophy
                          className="text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                          size={48}
                        />
                        <h3 className="text-sm font-black text-yellow-500 uppercase tracking-[0.2em] mb-6">
                          الفائز الأخير
                        </h3>

                        {giveawayWinners.length > 0 ? (
                          <div className="relative z-10">
                            <p className="text-2xl font-black text-white mb-2 tracking-tight uppercase">
                              {giveawayWinners[0].playerName}
                            </p>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest">
                                {giveawayWinners[0].prize}
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold">
                                التاريخ: {giveawayWinners[0].date}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 font-bold italic">
                            في انتظار السحب القادم...
                          </p>
                        )}

                        <div className="mt-8 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Verified Winner
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              <div className="space-y-12 mb-16">
                {!isAdmin ? (
                  <div className="pro-card p-8 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                    <Lock className="text-slate-700 mb-4" size={32} />
                    <h3 className="text-lg font-bold text-slate-500 mb-4">
                      لوحة تحكم المسؤول
                    </h3>
                    <button
                      onClick={handleLogin}
                      className="bg-white/5 hover:bg-primary hover:text-black px-6 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
                    >
                      تسجيل الدخول كمسؤول لرؤية القوالب
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => setShowAddGiveawayModal(true)}
                        className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                      >
                        <Plus
                          className="text-primary group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          إضافة سحب
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          showNotification(
                            "بدء عملية سحب الفائز عشوائياً",
                            "info"
                          )
                        }
                        className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                      >
                        <Trophy
                          className="text-primary group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          سحب الفائز
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          showNotification(
                            "اختر سحب من القائمة أدناه لحذفه",
                            "info"
                          )
                        }
                        className="p-6 pro-card border-red-500/20 bg-red-500/5 flex flex-col items-center gap-3 hover:bg-red-500/10 transition-colors group"
                      >
                        <Trash2
                          className="text-red-500 group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                          حذف سحب
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          showNotification(
                            "سيتم فتح نافذة إضافة تصويت جديد",
                            "info"
                          )
                        }
                        className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                      >
                        <BarChart3
                          className="text-primary group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          إضافة تصويت
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {templates
                        .filter((t) => t.type === "giveaway")
                        .map((tmpl) => (
                          <div key={tmpl.id} className="relative group">
                            <button
                              onClick={() => {
                                setNewGiveaway({
                                  title: tmpl.label,
                                  prize: tmpl.desc,
                                  image: "",
                                });
                                setShowAddGiveawayModal(true);
                              }}
                              className="w-full pro-card p-6 border-white/5 bg-white/2 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center text-center"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-black transition-all mb-4">
                                {getIconComponent(tmpl.icon)}
                              </div>
                              <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                                {tmpl.label}
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                {tmpl.desc}
                              </p>
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => deleteItem("templates", tmpl.id)}
                                className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setNewTemplate({
                              ...newTemplate,
                              type: "giveaway",
                            });
                            setShowAddTemplateModal(true);
                          }}
                          className="pro-card p-6 border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-center group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all mb-4">
                            <Plus size={24} />
                          </div>
                          <h4 className="font-bold text-sm text-primary">
                            إضافة قالب
                          </h4>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Giveaways Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Gift className="text-primary" size={32} /> السحوبات الحالية
                  </h2>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Active Giveaways
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {giveaways.length > 0 ? (
                    giveaways.map((giveaway) => (
                      <motion.div
                        key={giveaway.id}
                        whileHover={{ scale: 1.02 }}
                        className="pro-card overflow-hidden group"
                      >
                        <div className="relative h-48">
                          <GameImage
                            src={giveaway.image}
                            alt={giveaway.title}
                            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              giveaway.status === "active"
                                ? "bg-primary text-black"
                                : "bg-slate-500 text-white"
                            }`}
                          >
                            {giveaway.status === "active" ? "نشط" : "منتهي"}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">
                            {giveaway.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm mb-6">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Timer size={16} />
                              <span>ينتهي في: {giveaway.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                              <Users size={16} />
                              <span>{giveaway.participants} مشارك</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                showNotification(
                                  "تم تسجيل مشاركتك بنجاح! سيتم الإعلان عن الفائز في تاريخ الانتهاء.",
                                  "success"
                                )
                              }
                              className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                              <Zap size={18} /> دخول السحب الآن
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  deleteItem("giveaways", giveaway.id)
                                }
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 pro-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                      <Gift className="text-slate-700 mb-4" size={48} />
                      <h3 className="text-xl font-bold text-slate-500 mb-2">
                        لا توجد سحوبات حالياً
                      </h3>
                      <p className="text-slate-600 text-sm">
                        ترقبوا السحوبات القادمة والجوائز القيمة قريباً!
                      </p>
                    </div>
                  )}

                  {isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addGiveaway}
                      className="p-8 pro-card border-dashed border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-4 cursor-pointer group min-h-[300px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                        <Plus size={24} />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-primary">
                          إضافة سحب جديد
                        </h4>
                        <p className="text-[10px] text-primary/60 mt-1 uppercase font-bold">
                          Admin Only
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* Voting Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <BarChart3 className="text-primary" size={32} /> تصويت
                    المجتمع
                  </h2>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Community Polls
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {POLLS.length > 0 ? (
                    POLLS.map((poll) => (
                      <div key={poll.id} className="pro-card p-8">
                        <h3 className="text-xl font-bold mb-6 text-center">
                          {poll.question}
                        </h3>
                        <div className="space-y-4">
                          {poll.options.map((option) => {
                            const percentage = Math.round(
                              (option.votes / poll.totalVotes) * 100
                            );
                            return (
                              <div key={option.id} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                  <span>{option.text}</span>
                                  <span className="text-primary">
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className="h-full bg-primary"
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    showNotification(
                                      "شكراً لتصويتك!",
                                      "success"
                                    )
                                  }
                                  className="w-full py-2 text-[10px] text-slate-500 hover:text-primary font-bold uppercase tracking-widest transition-colors"
                                >
                                  تصويت
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <span>إجمالي الأصوات: {poll.totalVotes}</span>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-primary" />
                            <span>التصويت متاح</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 pro-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                      <BarChart3 className="text-slate-700 mb-4" size={48} />
                      <h3 className="text-xl font-bold text-slate-500 mb-2">
                        لا توجد استطلاعات رأي
                      </h3>
                      <p className="text-slate-600 text-sm">
                        شاركنا رأيك في الاستطلاعات القادمة لتطوير اللعبة!
                      </p>
                    </div>
                  )}

                  {isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        showNotification(
                          "ميزة إضافة التصويت ستتوفر قريباً",
                          "info"
                        )
                      }
                      className="p-8 pro-card border-dashed border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-4 cursor-pointer group min-h-[300px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                        <Plus size={24} />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-primary">
                          إضافة تصويت جديد
                        </h4>
                        <p className="text-[10px] text-primary/60 mt-1 uppercase font-bold">
                          Admin Only
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

              <SubtleAdBanner />
            </motion.div>
          ) : activeTab === "compare" ? (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Header & Distance Slider */}
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black gold-shimmer">
                    مقارنة الأسلحة الذكية
                  </h2>
                  <p className="text-slate-400 text-lg">
                    حلل الأداء، احسب الضرر، وتفوق في كل مواجهة
                  </p>
                </div>

                <div className="pro-card p-8 bg-gradient-to-b from-white/5 to-transparent border-primary/20">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Target size={14} className="text-primary" /> مسافة
                      الاشتباك
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {distance} متر
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="400"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                    <span>قريب جداً (5m)</span>
                    <span>متوسط (200m)</span>
                    <span>بعيد جداً (400m)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Selection & Stats */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weapon 1 Select */}
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                        السلاح الأول
                      </label>
                      <select
                        value={selectedWeapon1?.id || ""}
                        onChange={(e) =>
                          setSelectedWeapon1(
                            currentWeapons.find(
                              (w) => w.id === e.target.value
                            ) || null
                          )
                        }
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all cursor-pointer relative z-10"
                      >
                        <option value="" disabled>
                          اختر سلاحاً...
                        </option>
                        {Object.entries(groupedWeapons).map(
                          ([type, weapons]) => (
                            <optgroup
                              key={type}
                              label={categoryNames[type] || type}
                              className="bg-slate-900 text-primary font-bold"
                            >
                              {weapons.map((w) => (
                                <option
                                  key={w.id}
                                  value={w.id}
                                  className="bg-slate-900 text-white font-normal"
                                >
                                  {w.nameAr} ({w.nameEn})
                                </option>
                              ))}
                            </optgroup>
                          )
                        )}
                      </select>
                      <SmartWeaponCard
                        weapon={selectedWeapon1}
                        distance={distance}
                        index={1}
                      />
                    </div>

                    {/* Weapon 2 Select */}
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                        السلاح الثاني
                      </label>
                      <select
                        value={selectedWeapon2?.id || ""}
                        onChange={(e) =>
                          setSelectedWeapon2(
                            currentWeapons.find(
                              (w) => w.id === e.target.value
                            ) || null
                          )
                        }
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all cursor-pointer relative z-10"
                      >
                        <option value="" disabled>
                          اختر سلاحاً...
                        </option>
                        {Object.entries(groupedWeapons).map(
                          ([type, weapons]) => (
                            <optgroup
                              key={type}
                              label={categoryNames[type] || type}
                              className="bg-slate-900 text-primary font-bold"
                            >
                              {weapons.map((w) => (
                                <option
                                  key={w.id}
                                  value={w.id}
                                  className="bg-slate-900 text-white font-normal"
                                >
                                  {w.nameAr} ({w.nameEn})
                                </option>
                              ))}
                            </optgroup>
                          )
                        )}
                      </select>
                      <SmartWeaponCard
                        weapon={selectedWeapon2}
                        distance={distance}
                        index={2}
                      />
                    </div>
                  </div>

                  {/* TTK Calculation */}
                  <div className="pro-card p-8 bg-gradient-to-br from-bg-card to-red-500/5 border-red-500/20">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                        <Timer size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">وقت القتل (TTK)</h3>
                        <p className="text-xs text-slate-500">
                          ضد درع مستوى 2 (100 HP + 100 Armor)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {selectedWeapon1?.nameAr || "السلاح 1"}
                        </div>
                        <div className="text-4xl font-black text-primary">
                          {calculateTTK(selectedWeapon1)}s
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                (1 - Number(calculateTTK(selectedWeapon1))) *
                                100
                              }%`,
                            }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {selectedWeapon2?.nameAr || "السلاح 2"}
                        </div>
                        <div className="text-4xl font-black text-orange-500">
                          {calculateTTK(selectedWeapon2)}s
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                (1 - Number(calculateTTK(selectedWeapon2))) *
                                100
                              }%`,
                            }}
                            className="h-full bg-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis & Advice */}
                <div className="space-y-8">
                  <div className="pro-card p-8 space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Zap className="text-primary" size={20} /> تحليل المواجهات
                      الذكي
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                          <Target size={18} className="text-red-500" />
                          <span>المواجهات القريبة</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                        {comparisonAdvice?.closeRange}
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                          <Compass size={18} className="text-blue-500" />
                          <span>المواجهات البعيدة</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {comparisonAdvice?.longRange}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Info size={16} /> نصائح الأجهزة بناءً على الارتداد
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-500">
                            <Tablet size={24} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">
                              مستخدمي iPad
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {comparisonAdviceSmart?.ipad}
                            </p>
                          </div>
                        </div>
                        <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 flex gap-4 items-start">
                          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-500">
                            <Smartphone size={24} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest block mb-1">
                              مستخدمي الهواتف
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {comparisonAdviceSmart?.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div className="pro-card p-8 h-[450px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
                    <h3 className="text-xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                      <BarChart3 className="text-primary" size={20} /> التحليل
                      الرسومي المتقدم
                    </h3>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={[
                            {
                              subject: "الضرر",
                              A: selectedWeapon1?.damage || 0,
                              B: selectedWeapon2?.damage || 0,
                              fullMark: 100,
                            },
                            {
                              subject: "الارتداد",
                              A: selectedWeapon1?.recoil || 0,
                              B: selectedWeapon2?.recoil || 0,
                              fullMark: 100,
                            },
                            {
                              subject: "السرعة",
                              A: selectedWeapon1?.speed || 0,
                              B: selectedWeapon2?.speed || 0,
                              fullMark: 100,
                            },
                            {
                              subject: "المدى",
                              A: selectedWeapon1?.range || 0,
                              B: selectedWeapon2?.range || 0,
                              fullMark: 100,
                            },
                          ]}
                        >
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />
                          <Radar
                            name={selectedWeapon1?.nameAr || "سلاح 1"}
                            dataKey="A"
                            stroke="#D4AF37"
                            fill="#D4AF37"
                            fillOpacity={0.5}
                          />
                          <Radar
                            name={selectedWeapon2?.nameAr || "سلاح 2"}
                            dataKey="B"
                            stroke="#f97316"
                            fill="#f97316"
                            fillOpacity={0.5}
                          />
                          <Legend />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                            }}
                            itemStyle={{ color: "#fff" }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-center pt-12">
                  <button
                    onClick={() => setShowAddWeaponModal(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-2xl font-black hover:bg-white transition-all shadow-xl shadow-primary/20"
                  >
                    <Plus size={20} /> إضافة سلاح جديد لقاعدة البيانات
                  </button>
                </div>
              )}

              <SubtleAdBanner />
            </motion.div>
          ) : activeTab === "calculator" ? (
            <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
              <ConquerorCalculator SubtleAdBanner={SubtleAdBanner} />
            </Suspense>
          ) : activeTab === "news" ? (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Newspaper className="text-primary" size={28} /> آخر الأخبار
                    والفعاليات
                  </h2>
                  <p className="text-slate-400 mt-2">
                    تحديثات مباشرة من الموقع الرسمي لببجي موبايل
                  </p>
                </div>
                <button
                  onClick={loadNews}
                  disabled={loadingNews}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <RefreshCw
                    className={
                      loadingNews ? "animate-spin text-primary" : "text-primary"
                    }
                    size={20}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { id: "all", label: "الكل" },
                  { id: "news", label: "أخبار" },
                  {
                    id: "updates",
                    label: "تحديثات وصيانة",
                    special: "updates",
                  },
                  { id: "leaks", label: "التسريبات", special: "leaks" },
                  { id: "uc", label: "عروض UC" },
                  { id: "event", label: "فعاليات" },
                  { id: "mode", label: "أطوار" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setNewsFilter(filter.id as any)}
                    className={`px-5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      newsFilter === filter.id
                        ? filter.special === "leaks"
                          ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                          : filter.special === "updates"
                          ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                          : "btn-gold shadow-md"
                        : filter.special === "leaks"
                        ? "bg-purple-400/5 border-purple-400/20 text-purple-400 hover:bg-purple-400/10"
                        : filter.special === "updates"
                        ? "bg-blue-400/5 border-blue-400/20 text-blue-400 hover:bg-blue-400/10"
                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter.id === "leaks" && (
                      <Flame
                        size={14}
                        className={`inline-block ml-1 ${
                          newsFilter === "leaks" ? "animate-pulse" : ""
                        }`}
                      />
                    )}
                    {filter.id === "updates" && (
                      <Wrench
                        size={14}
                        className={`inline-block ml-1 ${
                          newsFilter === "updates" ? "animate-bounce" : ""
                        }`}
                      />
                    )}
                    {filter.label}
                  </button>
                ))}
              </div>

              {loadingNews ? (
                <InlineSpinner message="جاري جلب آخر التحديثات..." />
              ) : (
                <div className="grid gap-6">
                  {news
                    .filter(
                      (item) =>
                        newsFilter === "all" || item.category === newsFilter
                    )
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="pro-card overflow-hidden group border-white/5"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2">
                              {item.category === "leaks" ? (
                                <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 border border-purple-400/20">
                                  <Flame size={10} className="animate-pulse" />{" "}
                                  تسريب: {item.date}
                                </span>
                              ) : item.category === "updates" ? (
                                <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 border border-blue-400/20">
                                  <Wrench
                                    size={10}
                                    className="animate-bounce"
                                  />{" "}
                                  تحديث/صيانة: {item.date}
                                </span>
                              ) : (
                                item.category !== "news" && (
                                  <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={10} /> تاريخ الانتهاء:{" "}
                                    {item.date}
                                  </span>
                                )
                              )}
                            </div>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white">
                            {item.title}
                          </h3>
                          <p className="text-slate-400 leading-relaxed text-sm mb-6">
                            {item.summary}
                          </p>

                          {item.strategic_note && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                              <div className="flex items-center gap-2 text-red-400 mb-2">
                                <Target size={18} />
                                <span className="font-bold">تحليل الميتا (Meta Analysis)</span>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {item.strategic_note}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <button
                              onClick={() =>
                                setSelectedNewsId(
                                  selectedNewsId === item.id ? null : item.id
                                )
                              }
                              className={`flex items-center gap-2 text-xs font-bold transition-all ${
                                selectedNewsId === item.id
                                  ? "text-primary"
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              <MessageSquare size={16} />
                              <span>
                                التعليقات (
                                {selectedNewsId === item.id
                                  ? comments.length
                                  : "..."}
                                )
                              </span>
                            </button>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                              {item.category === "leaks"
                                ? "تسريبات"
                                : item.category === "uc"
                                ? "شدات"
                                : item.category === "event"
                                ? "فعالية"
                                : item.category === "mode"
                                ? "طور جديد"
                                : "أخبار"}
                            </span>
                          </div>

                          {/* Comments Section */}
                          <AnimatePresence>
                            {selectedNewsId === item.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-6 pt-6 border-t border-white/5 space-y-6 overflow-hidden"
                              >
                                {competitionSettings.find(s => s.id === 'global')?.isCommentsEnabled !== false ? (
                                  <>
                                    {/* Add Comment */}
                                    {user ? (
                                      <div className="flex gap-4">
                                        <GameImage
                                          src={
                                            user.photoURL ||
                                            `https://ui-avatars.com/api/?name=${
                                              user.displayName || "User"
                                            }&background=random`
                                          }
                                          alt="User"
                                          className="w-8 h-8 rounded-full border border-white/10"
                                        />
                                        <div className="flex-1 relative">
                                          <textarea
                                            value={newComment}
                                            onChange={(e) =>
                                              setNewComment(e.target.value)
                                            }
                                            placeholder="اكتب تعليقك هنا..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none pr-12"
                                            rows={2}
                                          />
                                          <button
                                            onClick={() =>
                                              handleAddComment(item.id)
                                            }
                                            disabled={
                                              isSubmittingComment ||
                                              !newComment.trim()
                                            }
                                            className="absolute left-3 bottom-3 text-primary hover:text-white transition-colors disabled:opacity-50"
                                          >
                                            {isSubmittingComment ? (
                                              <Loader2
                                                size={18}
                                                className="animate-spin"
                                              />
                                            ) : (
                                              <Send size={18} />
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="p-4 bg-white/5 rounded-xl text-center">
                                        <p className="text-xs text-slate-500 mb-3">
                                          يجب تسجيل الدخول للمشاركة في النقاش
                                        </p>
                                        <button
                                          onClick={handleLogin}
                                          className="text-xs font-bold text-primary hover:underline"
                                        >
                                          تسجيل الدخول الآن
                                        </button>
                                      </div>
                                    )}

                                    {/* Comments List */}
                                    <div className="space-y-4 md:max-h-[400px] md:overflow-y-auto pr-2 custom-scrollbar">
                                      {comments.length > 0 ? (
                                        comments.map((comment) => (
                                          <div
                                            key={comment.id}
                                            className="flex gap-3 group"
                                          >
                                            <GameImage
                                              src={
                                                comment.userPhoto ||
                                                `https://ui-avatars.com/api/?name=${comment.userName}&background=random`
                                              }
                                              alt={comment.userName}
                                              className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                                            />
                                            <div className="flex-1 space-y-1">
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-white">
                                                  {comment.userName}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-[9px] text-slate-600">
                                                    {comment.createdAt?.toDate
                                                      ? new Date(
                                                          comment.createdAt.toDate()
                                                        ).toLocaleString("ar-EG")
                                                      : "الآن"}
                                                  </span>
                                                  {isAdmin && (
                                                    <button
                                                      onClick={() =>
                                                        handleDeleteComment(
                                                          comment.id
                                                        )
                                                      }
                                                      className="p-1 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                      <Trash2 size={12} />
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                              <p className="text-sm text-slate-400 leading-relaxed">
                                                {comment.content}
                                              </p>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-center py-8">
                                          <MessageSquare
                                            size={32}
                                            className="text-slate-800 mx-auto mb-2"
                                          />
                                          <p className="text-xs text-slate-600">
                                            لا توجد تعليقات بعد. كن أول من يعلق!
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
                                    <MessageSquareOff size={40} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400 font-bold">تم تعطيل التعليقات حالياً</p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}

              <SubtleAdBanner />
            </motion.div>
          ) : (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto text-center py-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5">
                <Zap className="text-primary" size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4">مساحة إعلانية قادمة</h2>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-12">
                هذه الصفحة مخصصة للإعلانات والشركاء المستقبليين. حالياً، نحن
                نركز على تقديم أفضل تجربة للمستخدم بدون إزعاج.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {ads.map((ad) => (
                  <div key={ad.id} className="relative group">
                    <a
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-8 pro-card border-dashed border-2 border-white/10 flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                        {getIcon(ad.icon, 24)}
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold group-hover:text-primary transition-colors">
                          {ad.title}
                        </h4>
                        {ad.description && (
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                            {ad.description}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500 mt-3 uppercase font-bold tracking-widest">
                          انقر لزيارة الرابط
                        </p>
                      </div>
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
                        title="حذف الإعلان"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {isAdmin && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddAdModal(true)}
                    className="p-8 pro-card border-dashed border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-4 cursor-pointer group h-full"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <Plus size={24} />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-primary">
                        إضافة إعلان جديد
                      </h4>
                      <p className="text-[10px] text-primary/60 mt-1 uppercase font-bold">
                        Admin Only
                      </p>
                    </div>
                  </motion.div>
                )}

                {ads.length === 0 && !isAdmin && (
                  <div className="col-span-full py-12 text-center opacity-50">
                    <Megaphone
                      className="mx-auto mb-4 text-slate-500"
                      size={40}
                    />
                    <p className="text-slate-400">
                      لا توجد إعلانات نشطة حالياً
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  Coming Soon • قريباً
                </div>

                {!isAdmin && (
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="text-slate-500 hover:text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <Lock size={12} /> دخول المسؤول
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Admin Modals */}
        <AnimatePresence>
          {isAddingContent && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-2xl w-full border-primary/20 my-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    {isEditingWeapon || isEditingAttachment || isEditingCharacter || isEditingProPlayer ? <Pencil className="text-primary" size={24} /> : <Plus className="text-primary" size={24} />}
                    {isEditingWeapon || isEditingAttachment || isEditingCharacter || isEditingProPlayer ? 'تعديل ' : 'إضافة '} {isAddingContent === 'weapon' ? 'السلاح' : isAddingContent === 'attachment' ? 'الملحق' : isAddingContent === 'character' ? 'الشخصية' : 'اللاعب المحترف'}
                  </h3>
                  <button onClick={() => { setIsAddingContent(null); setIsEditingWeapon(null); setIsEditingAttachment(null); setIsEditingCharacter(null); setIsEditingProPlayer(null); }} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Common Fields */}
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">رابط الصورة</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingContentData?.image || ''}
                        onChange={(e) => setEditingContentData({ ...editingContentData, image: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                      />
                      <label className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-primary cursor-pointer transition-all flex items-center justify-center">
                        <Upload size={20} />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'content')}
                        />
                      </label>
                    </div>
                  </div>

                  {isAddingContent === 'weapon' && (
                    <>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الاسم بالعربي</label>
                        <input
                          type="text"
                          value={editingContentData?.nameAr || ''}
                          onChange={(e) => setEditingContentData({ ...editingContentData, nameAr: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الاسم بالإنجليزي</label>
                        <input
                          type="text"
                          value={editingContentData?.nameEn || ''}
                          onChange={(e) => setEditingContentData({ ...editingContentData, nameEn: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">النوع</label>
                        <select
                          value={editingContentData?.type || 'AR'}
                          onChange={(e) => setEditingContentData({ ...editingContentData, type: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all appearance-none"
                        >
                          <option value="AR">AR</option>
                          <option value="SR">SR</option>
                          <option value="DMR">DMR</option>
                          <option value="SMG">SMG</option>
                          <option value="Shotgun">Shotgun</option>
                          <option value="Pistol">Pistol</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الضرر</label>
                        <input
                          type="number"
                          value={editingContentData?.damage || 0}
                          onChange={(e) => setEditingContentData({ ...editingContentData, damage: Number(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </>
                  )}

                  {(isAddingContent === 'attachment') && (
                    <>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الاسم بالعربي</label>
                        <input
                          type="text"
                          value={editingContentData?.arabicName || ''}
                          onChange={(e) => setEditingContentData({ ...editingContentData, arabicName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الاسم بالإنجليزي</label>
                        <input
                          type="text"
                          value={editingContentData?.englishName || ''}
                          onChange={(e) => setEditingContentData({ ...editingContentData, englishName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </>
                  )}

                  {(isAddingContent === 'character' || isAddingContent === 'player') && (
                    <div className="space-y-4 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الاسم</label>
                      <input
                        type="text"
                        value={editingContentData?.name || ''}
                        onChange={(e) => setEditingContentData({ ...editingContentData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-12 flex gap-4">
                  <button
                    onClick={handleSaveContent}
                    disabled={isUpdatingSettings}
                    className="flex-1 bg-primary text-black font-black py-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isUpdatingSettings ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                    <span>حفظ البيانات</span>
                  </button>
                  <button
                    onClick={() => { setIsAddingContent(null); setIsEditingWeapon(null); setIsEditingAttachment(null); setIsEditingCharacter(null); setIsEditingProPlayer(null); }}
                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}


        </AnimatePresence>

        <AnimatePresence>
          {showAddWeaponModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Plus className="text-primary" size={20} /> إضافة سلاح جديد
                  </h3>
                  <button
                    onClick={() => setShowAddWeaponModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      اسم السلاح (English)
                    </label>
                    <input
                      type="text"
                      value={newWeapon.nameEn}
                      onChange={(e) =>
                        setNewWeapon({ ...newWeapon, nameEn: e.target.value })
                      }
                      placeholder="M416"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الاسم بالعربي
                    </label>
                    <input
                      type="text"
                      value={newWeapon.nameAr}
                      onChange={(e) =>
                        setNewWeapon({ ...newWeapon, nameAr: e.target.value })
                      }
                      placeholder="إم فور ١٦"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      النوع
                    </label>
                    <select
                      value={newWeapon.type}
                      onChange={(e) =>
                        setNewWeapon({ ...newWeapon, type: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    >
                      <option value="AR" className="bg-bg-dark">
                        AR
                      </option>
                      <option value="Sniper" className="bg-bg-dark">
                        Sniper
                      </option>
                      <option value="DMR" className="bg-bg-dark">
                        DMR
                      </option>
                      <option value="SMG" className="bg-bg-dark">
                        SMG
                      </option>
                      <option value="Shotgun" className="bg-bg-dark">
                        Shotgun
                      </option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        الضرر (0-100)
                      </label>
                      <input
                        type="number"
                        value={newWeapon.damage}
                        onChange={(e) =>
                          setNewWeapon({
                            ...newWeapon,
                            damage: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        الارتداد (0-100)
                      </label>
                      <input
                        type="number"
                        value={newWeapon.recoil}
                        onChange={(e) =>
                          setNewWeapon({
                            ...newWeapon,
                            recoil: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        السرعة (0-100)
                      </label>
                      <input
                        type="number"
                        value={newWeapon.speed}
                        onChange={(e) =>
                          setNewWeapon({
                            ...newWeapon,
                            speed: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        المدى (0-100)
                      </label>
                      <input
                        type="number"
                        value={newWeapon.range}
                        onChange={(e) =>
                          setNewWeapon({
                            ...newWeapon,
                            range: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      صورة السلاح
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newWeapon.image}
                        onChange={(e) =>
                          setNewWeapon({ ...newWeapon, image: e.target.value })
                        }
                        placeholder="رابط الصورة (https://...)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                      <label className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-primary cursor-pointer transition-all flex items-center justify-center shrink-0">
                        <Upload size={20} />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "newWeapon")}
                        />
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handleAddWeapon}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors mt-4"
                  >
                    إضافة السلاح
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAdminLogin && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <UserIcon className="text-primary" size={20} /> تسجيل دخول
                    المسؤول
                  </h3>
                  <button
                    onClick={() => setShowAdminLogin(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-4">
                    <p className="text-[10px] text-primary font-bold text-center leading-relaxed">
                      تنبيه: يجب تسجيل الدخول بحساب جوجل المعتمد ({ADMIN_EMAIL})
                      لتفعيل صلاحيات المسؤول.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      البريد الإلكتروني للمسؤول
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors"
                  >
                    تأكيد وتسجيل الدخول
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddDeviceModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Plus className="text-primary" size={20} />
                    {sensitivityCategory === "devices"
                      ? "إضافة جهاز جديد"
                      : "إضافة لاعب جديد"}
                  </h3>
                  <button
                    onClick={() => setShowAddDeviceModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الاسم
                    </label>
                    <input
                      type="text"
                      value={newDeviceData.name}
                      onChange={(e) =>
                        setNewDeviceData({
                          ...newDeviceData,
                          name: e.target.value,
                        })
                      }
                      placeholder={
                        sensitivityCategory === "devices"
                          ? "اسم الجهاز (مثال: iPhone 15 Pro)"
                          : "اسم اللاعب (مثال: BTR Zuxxy)"
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {sensitivityCategory === "devices" && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        الشركة المصنعة
                      </label>
                      <select
                        value={newDeviceData.brand}
                        onChange={(e) =>
                          setNewDeviceData({
                            ...newDeviceData,
                            brand: e.target.value as any,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      >
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="RedMagic">RedMagic</option>
                        <option value="Redmi">Redmi</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      كود الحساسية (اختياري)
                    </label>
                    <input
                      type="text"
                      value={newDeviceData.code}
                      onChange={(e) =>
                        setNewDeviceData({
                          ...newDeviceData,
                          code: e.target.value,
                        })
                      }
                      placeholder="7123-XXXX-XXXX-XXXX-XXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        حجم الشاشة (بوصة)
                      </label>
                      <input
                        type="text"
                        value={newDeviceData.screenSize}
                        onChange={(e) =>
                          setNewDeviceData({
                            ...newDeviceData,
                            screenSize: e.target.value,
                          })
                        }
                        placeholder="مثال: 6.7"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                        أسلوب اللعب
                      </label>
                      <select
                        value={newDeviceData.playStyle}
                        onChange={(e) =>
                          setNewDeviceData({
                            ...newDeviceData,
                            playStyle: e.target.value as any,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      >
                        <option value="Rusher">مقتحم (Rusher)</option>
                        <option value="Sniper">قناص (Sniper)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <input
                      type="checkbox"
                      id="useGyroscope"
                      checked={newDeviceData.useGyroscope}
                      onChange={(e) =>
                        setNewDeviceData({
                          ...newDeviceData,
                          useGyroscope: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                    <label
                      htmlFor="useGyroscope"
                      className="text-sm font-bold cursor-pointer"
                    >
                      يستخدم الجيروسكوب
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleAddDevice}
                      className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-colors"
                    >
                      إضافة الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showAddAdModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Megaphone className="text-primary" size={20} /> إضافة إعلان
                    جديد
                  </h3>
                  <button
                    onClick={() => setShowAddAdModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      عنوان الإعلان
                    </label>
                    <input
                      type="text"
                      value={newAd.title}
                      onChange={(e) =>
                        setNewAd({ ...newAd, title: e.target.value })
                      }
                      placeholder="مثال: متجر الشدات المعتمد"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      رابط الإعلان
                    </label>
                    <input
                      type="url"
                      value={newAd.url}
                      onChange={(e) =>
                        setNewAd({ ...newAd, url: e.target.value })
                      }
                      placeholder="https://example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      وصف الإعلان (اختياري)
                    </label>
                    <textarea
                      value={newAd.description}
                      onChange={(e) =>
                        setNewAd({ ...newAd, description: e.target.value })
                      }
                      placeholder="اكتب وصفاً مختصراً للعرض..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الأيقونة
                    </label>
                    <select
                      value={newAd.icon}
                      onChange={(e) =>
                        setNewAd({ ...newAd, icon: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    >
                      <option value="Megaphone">مكبر صوت</option>
                      <option value="ExternalLink">رابط خارجي</option>
                      <option value="Tag">وسم</option>
                      <option value="Gift">هدية</option>
                      <option value="Star">نجمة</option>
                      <option value="Bell">تنبيه</option>
                      <option value="Zap">صاعقة</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleAddAd}
                      className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-colors"
                    >
                      إضافة الإعلان
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showAddGiveawayModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Gift className="text-primary" size={20} /> إضافة سحب جديد
                  </h3>
                  <button
                    onClick={() => setShowAddGiveawayModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={newGiveaway.title}
                      onChange={(e) =>
                        setNewGiveaway({
                          ...newGiveaway,
                          title: e.target.value,
                        })
                      }
                      placeholder="مثال: سحب على 600 شدة"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الجائزة
                    </label>
                    <input
                      type="text"
                      value={newGiveaway.prize}
                      onChange={(e) =>
                        setNewGiveaway({
                          ...newGiveaway,
                          prize: e.target.value,
                        })
                      }
                      placeholder="مثال: 600 UC"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      رابط الصورة (اختياري)
                    </label>
                    <input
                      type="text"
                      value={newGiveaway.image}
                      onChange={(e) =>
                        setNewGiveaway({
                          ...newGiveaway,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button
                    onClick={addGiveaway}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors"
                  >
                    إضافة السحب
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddEventModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="text-primary" size={20} /> إضافة فعالية
                    جديدة
                  </h3>
                  <button
                    onClick={() => setShowAddEventModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      عنوان الفعالية
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      placeholder="مثال: بطولة رمضان الكبرى"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الوصف
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      placeholder="تفاصيل الفعالية..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      نوع الفعالية
                    </label>
                    <input
                      type="text"
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, type: e.target.value })
                      }
                      placeholder="مثال: standard, video, tournament"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الحالة
                    </label>
                    <select
                      value={newEvent.status}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    >
                      <option value="upcoming">قادمة</option>
                      <option value="ongoing">جارية</option>
                      <option value="completed">منتهية</option>
                    </select>
                  </div>
                  <button
                    onClick={addEvent}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors"
                  >
                    إضافة الفعالية
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddTemplateModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pro-card p-8 max-w-md w-full border-primary/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Plus className="text-primary" size={20} /> إضافة قالب جديد
                    ({newTemplate.type === "event" ? "فعالية" : "سحب"})
                  </h3>
                  <button
                    onClick={() => setShowAddTemplateModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      التسمية
                    </label>
                    <input
                      type="text"
                      value={newTemplate.label}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          label: e.target.value,
                        })
                      }
                      placeholder="مثال: بطولة كبرى"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الوصف الافتراضي
                    </label>
                    <input
                      type="text"
                      value={newTemplate.desc}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, desc: e.target.value })
                      }
                      placeholder="وصف قصير للقالب"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">
                      الأيقونة
                    </label>
                    <select
                      value={newTemplate.icon}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, icon: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    >
                      <option value="Zap">Zap (صاعقة)</option>
                      <option value="Shield">Shield (درع)</option>
                      <option value="Gift">Gift (هدية)</option>
                      <option value="Star">Star (نجمة)</option>
                      <option value="Trophy">Trophy (كأس)</option>
                      <option value="Users">Users (مستخدمين)</option>
                      <option value="Play">Play (تشغيل)</option>
                      <option value="Calendar">Calendar (تقويم)</option>
                      <option value="Video">Video (فيديو)</option>
                      <option value="Bell">Bell (جرس)</option>
                      <option value="BarChart3">BarChart (رسم بياني)</option>
                      <option value="Vote">Vote (تصويت)</option>
                    </select>
                  </div>
                  <button
                    onClick={addTemplate}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors"
                  >
                    إضافة القالب
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : notification.type === "error"
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-primary/20 border-primary/50 text-primary"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : notification.type === "error" ? (
              <Shield size={20} />
            ) : (
              <Bell size={20} />
            )}
            <span className="font-bold text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isRatingModalOpen && selectedWeaponToRate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pro-card p-8 max-w-md w-full border-primary/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary">
                  تقييم {selectedWeaponToRate.nameAr}
                </h3>
                <button
                  onClick={() => setIsRatingModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <Zap size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setWeaponRatingValue(star)}
                      className={`transition-all duration-300 ${
                        weaponRatingValue >= star
                          ? "text-yellow-400 scale-110"
                          : "text-slate-700 hover:text-slate-500"
                      }`}
                    >
                      <Star
                        size={40}
                        fill={
                          weaponRatingValue >= star ? "currentColor" : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-400">
                  {weaponRatingValue === 5
                    ? "ممتاز جداً"
                    : weaponRatingValue === 4
                    ? "جيد جداً"
                    : weaponRatingValue === 3
                    ? "متوسط"
                    : weaponRatingValue === 2
                    ? "ضعيف"
                    : "سيء جداً"}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  رأيك في هذه القطع (اختياري)
                </label>
                <textarea
                  value={weaponRatingComment}
                  onChange={(e) => setWeaponRatingComment(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={handleRateWeapon}
                disabled={isSubmittingWeaponRating}
                className="w-full py-4 bg-primary text-black font-black rounded-xl hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingWeaponRating ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>إرسال التقييم</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pro-card p-8 max-w-sm w-full border-primary/20 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">تأكيد الإجراء</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="py-3 rounded-xl bg-primary text-black hover:bg-white transition-colors font-bold"
                >
                  تأكيد
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteStatsSection stats={siteStats} />
      <footer className="mt-20 border-t border-white/5 py-12 px-6 bg-bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-80">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 overflow-hidden">
              <GameImage
                src="/logo.png"
                alt="ببجيكوم"
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg gold-shimmer">ببجيكوم</span>
              <span className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">
                PUBGCOM
              </span>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">
              سياسة الخصوصية
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              شروط الاستخدام
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              تواصل معنا
            </a>
          </div>
          <p className="text-xs text-slate-600">
            © 2024 PUBGCOM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
      <Suspense fallback={null}>
        <Chatbot
          weapons={currentWeapons}
          rankings={rankings}
          events={events}
          giveaways={giveaways}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          showNotification={showNotification}
          onLoginSuccess={handleLoginSuccess}
          activeTab={authTab}
          setActiveTab={setAuthTab}
        />
      </Suspense>
    </div>
  );
}

function SmartWeaponCard({
  weapon,
  distance,
  index,
}: {
  weapon: Weapon | null;
  distance: number;
  index: number;
}) {
  if (!weapon) return null;

  // Calculate effective damage based on distance
  const currentDamage = Math.max(10, weapon.damage - distance * 0.05).toFixed(
    1
  );

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="pro-card p-8 bg-bg-card border-white/10 relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />

      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/10">
            <GameImage
              src={weapon.image}
              alt={weapon.nameAr}
              className="max-h-full"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{weapon.nameAr}</h3>
            <span className="text-xs text-primary font-bold uppercase tracking-widest">
              {weapon.type} • Assault Rifle
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-5xl font-black text-white/5 absolute top-4 left-4 select-none">
            #{index}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <SmartStatBar
          label="الضرر الفعلي"
          value={Number(currentDamage)}
          max={50}
          icon={<Zap size={16} />}
          color="bg-orange-500"
        />
        <SmartStatBar
          label="الثبات"
          value={100 - weapon.recoil}
          max={100}
          icon={<Shield size={16} />}
          color="bg-blue-500"
        />
        <SmartStatBar
          label="سرعة الإطلاق"
          value={weapon.speed}
          max={100}
          icon={<TrendingUp size={16} />}
          color="bg-green-500"
        />
        <SmartStatBar
          label="المدى الفعال"
          value={weapon.range}
          max={100}
          icon={<Target size={16} />}
          color="bg-purple-500"
        />
      </div>
    </motion.div>
  );
}

function SmartStatBar({
  label,
  value,
  max,
  icon,
  color,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {icon} {label}
        </div>
        <span className="text-sm font-black text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} shadow-lg shadow-current/20`}
        />
      </div>
    </div>
  );
}

function SensitivityCard({
  title,
  icon,
  data,
  fullWidth = false,
  isAdmin = false,
  onUpdate,
}: {
  title: string;
  icon: React.ReactNode;
  data: any;
  fullWidth?: boolean;
  isAdmin?: boolean;
  onUpdate?: (field: string, val: number) => void;
}) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const items = [
    { key: "noScope", label: "بدون منظار", value: data.noScope },
    { key: "redDot", label: "نقطة الاستهداف", value: data.redDot },
    { key: "scope2x", label: "منظار 2x", value: data.scope2x },
    { key: "scope3x", label: "منظار 3x", value: data.scope3x },
    { key: "scope4x", label: "منظار 4x", value: data.scope4x },
    { key: "scope6x", label: "منظار 6x", value: data.scope6x },
    { key: "scope8x", label: "منظار 8x", value: data.scope8x },
  ];

  const handleSave = (key: string) => {
    const val = parseInt(editValue);
    if (!isNaN(val) && onUpdate) {
      onUpdate(key, val);
    }
    setEditingField(null);
  };

  return (
    <div className="p-6 pro-card group">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      <div
        className={`grid ${
          fullWidth
            ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
            : "grid-cols-2 sm:grid-cols-3"
        } gap-4`}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-all relative group/item"
          >
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {item.label}
            </span>

            {editingField === item.key ? (
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-16 bg-black/40 border border-primary/30 rounded px-1 text-center text-primary font-bold outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave(item.key);
                    if (e.key === "Escape") setEditingField(null);
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-primary">
                  {item.value}%
                </span>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditValue(item.value.toString());
                      setEditingField(item.key);
                    }}
                    className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-primary transition-all"
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            )}

            <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / 400) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
