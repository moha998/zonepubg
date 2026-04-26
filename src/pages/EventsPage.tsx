import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Settings, 
  Loader2, 
  Save, 
  PowerOff, 
  Lock, 
  Video, 
  Trash2, 
  UserMinus, 
  Plus, 
  Eye, 
  Trophy, 
  Timer,
  Upload,
  Play
} from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

interface EventsPageProps {
  isAdmin: boolean;
  user: any;
  userProfile: any;
  competitionSettings: any[];
  clips: any[];
  comments: any[];
  handleUpdateCompetitionSettings: (id: string, data: any, disable: boolean) => void;
  isUpdatingSettings: boolean;
  showNotification: (msg: string, type: 'success'|'error') => void;
  onLogin: () => void;
}

export default function EventsPage({
  isAdmin,
  user,
  userProfile,
  competitionSettings,
  clips,
  comments,
  handleUpdateCompetitionSettings,
  isUpdatingSettings,
  showNotification,
  onLogin
}: EventsPageProps) {
  const [eventsSubTab, setEventsSubTab] = useState<"list" | "clips">("list");
  
  // Admin states
  const [selectedSettingId, setSelectedSettingId] = useState("");
  const [settingStartDate, setSettingStartDate] = useState("");
  const [settingEndDate, setSettingEndDate] = useState("");
  const [isAllEventsHidden, setIsAllEventsHidden] = useState(false);
  const videoUploadRef = useRef<HTMLElement>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  
  // New winning clip states
  const [newClipTitle, setNewClipTitle] = useState("");
  const [newClipUrl, setNewClipUrl] = useState("");
  const [isSubmittingClip, setIsSubmittingClip] = useState(false);

  // Hardcoded for now until full extraction
  const ADMIN_EMAIL = "eng.moha990@gmail.com";
  const events: any[] = []; // In a real scenario, this would be passed as a prop
  const templates: any[] = []; // Real scenario, pass as prop
  
  const isCompetitionActive = (id: string) => true; // mock
  const deleteItem = (collection: string, id: string) => {}; // mock
  const toggleEventVisibility = (id: string, isHidden: boolean) => {}; // mock
  const handleVideoUpload = () => {}; // mock
  const handleAddWinningClip = () => {}; // mock

  return (
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
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                إخفاء كافة الفعاليات
              </label>
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <button
                  onClick={() => setIsAllEventsHidden(!isAllEventsHidden)}
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
          <div className="space-y-12 mb-16">
            {!isAdmin ? (
              <div className="pro-card p-8 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                <Lock className="text-slate-700 mb-4" size={32} />
                <h3 className="text-lg font-bold text-slate-500 mb-4">
                  لوحة تحكم المسؤول
                </h3>
                <button
                  onClick={onLogin}
                  className="bg-white/5 hover:bg-primary hover:text-black px-6 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
                >
                  تسجيل الدخول كمسؤول لرؤية القوالب
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
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
                </div>
              </div>
            )}
          </div>
          
          {(competitionSettings.some((s) => s.isAllEventsHidden) && !isAdmin) ||
          (!isCompetitionActive("daily-tournament") && !isAdmin) ? (
            <div className="pro-card p-12 bg-bg-card/50 border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700 mb-6">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-500 mb-2">
                المسابقة مغلقة حالياً
              </h2>
              <p className="text-slate-600 max-w-md">
                لا توجد بطولات يومية نشطة في الوقت الحالي. ترقبوا المواعيد القادمة!
              </p>
            </div>
          ) : (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Calendar className="text-primary" size={32} /> الفعاليات القادمة
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-full py-24 pro-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <Calendar className="text-slate-700" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-500 mb-3">
                      لا توجد فعاليات نشطة حالياً
                    </h3>
                  </div>
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
                          <OptimizedImage
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
  );
}
