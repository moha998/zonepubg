import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Target,
  Crown,
  Megaphone,
  ArrowUpRight,
  RefreshCcw,
  Trophy,
  Edit,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { Ranking, Ad } from "../types";
import { doc, setDoc, deleteDoc, db } from "../firebase";

interface TopBannersProps {
  rankings: Ranking[];
  ads: Ad[];
  isAdmin?: boolean;
  competitionSettings?: any[];
  onSyncRankings?: () => Promise<void>;
  onNavigate?: (path: string) => void;
}

export default function TopBanners({
  rankings,
  ads,
  isAdmin,
  competitionSettings,
  onSyncRankings,
  onNavigate
}: TopBannersProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adForm, setAdForm] = useState({ title: '', url: '' });
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#manage-ads") {
        setIsAdModalOpen(true);
        // Clear hash after opening to avoid re-triggering if closed then hash re-added
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    handleHashChange(); // Check on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSync = async () => {
    if (!onSyncRankings) return;
    setIsSyncing(true);
    try {
      await onSyncRankings();
    } finally {
      setIsSyncing(false);
    }
  };

  const topRankings = (rankings || []).slice(0, 10);

  const globalSetting = competitionSettings?.find((s) => s.id === "global");
  const isAdsEnabled = globalSetting?.isAdsTickerEnabled;

  const handleEditPlayer = async (player: Ranking, rank: number) => {
    const newName = window.prompt(
      `أدخل اسم اللاعب للمركز ${rank}:`,
      player.playerName !== "مجهول" ? player.playerName : "",
    );
    if (newName === null) return;

    const newStats = window.prompt(
      `أدخل إحصائية وصفية (مثل ملك الكيلات):`,
      player.stats || "",
    );
    if (newStats === null) return;

    try {
      await setDoc(doc(db, "rankings", rank.toString()), {
        id: rank.toString(),
        rank: rank,
        playerName: newName || "مجهول",
        country: "الشرق الأوسط",
        stats: newStats || "",
        updatedAt: new Date(),
      });
      alert("تم التحديث بنجاح!");
    } catch (e) {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const handleToggleAds = async () => {
    try {
      await setDoc(
        doc(db, "competitionSettings", "global"),
        {
          isAdsTickerEnabled: !isAdsEnabled,
          updatedAt: new Date(),
        },
        { merge: true },
      );
      alert(
        !isAdsEnabled ? "تم تفعيل شريط الإعلانات" : "تم إخفاء شريط الإعلانات",
      );
    } catch (e) {
      alert("حدث خطأ أثناء تغيير حالة الشريط");
    }
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title) return;
    
    setIsSubmittingAd(true);
    try {
      if (editingAdId) {
        // Update existing ad
        const adRef = doc(db, "ads", editingAdId);
        await setDoc(adRef, {
          title: adForm.title,
          url: adForm.url || "",
          updatedAt: new Date(),
        }, { merge: true });
        alert("تم تحديث الإعلان بنجاح!");
      } else {
        // Add new ad
        const newAd = {
          id: Date.now().toString(),
          title: adForm.title,
          description: "",
          url: adForm.url || "",
          icon: "Megaphone",
          createdAt: new Date(),
          authorId: "admin",
        };
        await setDoc(doc(db, "ads", newAd.id), newAd);
        alert("تمت إضافة الإعلان بنجاح!");
      }
      setAdForm({ title: '', url: '' });
      setEditingAdId(null);
    } catch (e) {
      alert("حدث خطأ أثناء العملية");
    } finally {
      setIsSubmittingAd(false);
    }
  };

  const handleEditClick = (ad: Ad) => {
    setEditingAdId(ad.id);
    setAdForm({ title: ad.title, url: ad.url || '' });
  };

  const cancelEdit = () => {
    setEditingAdId(null);
    setAdForm({ title: '', url: '' });
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
    try {
      await deleteDoc(doc(db, "ads", id));
      if (editingAdId === id) cancelEdit();
    } catch (err) {
      console.error("Delete error:", err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="w-full mb-6 relative">
      {/* 🚀 Admin Management Modal - Completely Refined */}
      <AnimatePresence>
        {isAdModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0A0C10] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">إدارة الإعلانات</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right">مركز التحكم بالبث المباشر</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsAdModalOpen(false); setEditingAdId(null); setAdForm({ title: '', url: '' }); }} 
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <form onSubmit={handleAddAd} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[2rem] blur opacity-10"></div>
                  <div className="relative p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                         {editingAdId ? "تعديل المحتوى" : "نشر إعلان جديد"}
                       </span>
                       {editingAdId && (
                         <button type="button" onClick={cancelEdit} className="text-[9px] font-black text-slate-500 hover:text-red-400 uppercase tracking-tighter transition-colors">إلغاء</button>
                       )}
                    </div>
                    
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="نص الإعلان (مثال: بطولة جديدة تبدأ قريباً...)" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-primary transition-all font-bold text-white placeholder:text-slate-600"
                        value={adForm.title}
                        onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                      />
                      <input 
                        type="text" 
                        placeholder="رابط خارجي (اختياري)..." 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-[11px] font-mono outline-none focus:border-primary transition-all text-primary/80 placeholder:text-slate-700"
                        value={adForm.url}
                        onChange={(e) => setAdForm({ ...adForm, url: e.target.value })}
                      />
                    </div>

                    <button 
                      disabled={isSubmittingAd || !adForm.title}
                      type="submit"
                      className="w-full py-3.5 bg-primary text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-xs uppercase tracking-widest shadow-xl shadow-primary/10"
                    >
                      {isSubmittingAd ? "جاري المعالجة..." : (editingAdId ? "تحديث الآن" : "نشر المحتوى")}
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الأخبار المنشورة ({ads?.length || 0})</h4>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {ads && ads.length > 0 ? ads.map((ad) => (
                      <motion.div 
                        layout
                        key={ad.id} 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${editingAdId === ad.id ? 'bg-primary/10 border-primary' : 'bg-white/2 border-white/5 hover:bg-white/5'}`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-[13px] font-black text-white truncate">{ad.title}</span>
                          {ad.url && <span className="text-[9px] text-primary/50 font-mono truncate max-w-[220px]">{ad.url}</span>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={() => handleEditClick(ad)}
                            className="p-2 text-slate-500 hover:text-primary transition-all hover:bg-primary/10 rounded-lg"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-2 text-slate-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-10 rounded-2xl border border-dashed border-white/5">
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic leading-loose">لا توجد منشورات نشطة حالياً، كن أول من ينشر خبراً!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📺 Slim Professional Broadcast Bar */}
      {(isAdsEnabled || isAdmin) && (
        <div className="px-4 max-w-7xl mx-auto w-full group/master mt-4 mb-2">
          <div className={`relative overflow-hidden backdrop-blur-3xl border rounded-2xl transition-all duration-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-stretch md:items-center min-h-[48px] ${isAdsEnabled ? 'bg-[#050608]/95 border-white/5' : 'bg-red-950/10 border-red-500/20 grayscale'}`}>
            
            {/* 🏅 Left Segment: Ads Ticker */}
            <div className="flex-1 flex items-center h-12 overflow-hidden relative border-b md:border-b-0 md:border-l border-white/5">
               <div className="z-20 px-5 h-full flex items-center bg-gradient-to-l from-primary/10 via-primary/5 to-transparent border-l border-primary/10">
                 <div className="relative flex items-center gap-2">
                   <Megaphone size={16} className="text-primary" />
                   <span className="text-[12px] font-black text-red-500 uppercase tracking-tighter">إعلانات</span>
                 </div>
               </div>
               
               <div className="flex-grow relative h-full flex items-center overflow-hidden">
                 <motion.div 
                   animate={{ x: ["0%", "-50%"] }}
                   transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                   className="flex items-center gap-12 whitespace-nowrap pl-6"
                 >
                   {[...(ads || []), ...(ads || [])].length > 0 ? [...(ads || []), ...(ads || [])].map((ad, idx) => (
                     <div key={`${ad.id}-${idx}`} className="flex items-center gap-12">
                       <span className="text-[11px] font-bold text-slate-200 hover:text-primary cursor-pointer transition-colors">
                         {ad.title}
                       </span>
                       <div className="w-1 h-1 rounded-full bg-white/10 shrink-0"></div>
                     </div>
                   )) : (
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">مرحباً بك في ساحة المحترفين • تابع آخر المستجدات</span>
                   )}
                 </motion.div>
               </div>
            </div>

            {/* 🏆 Right Segment: Rankings Ticker */}
            <div className="flex-1 flex items-center h-12 bg-white/[0.01] relative overflow-hidden group/fame cursor-pointer border-r md:border-r-0 border-white/5" onClick={() => onNavigate?.('ranking')}>
               <div className="px-5 h-full flex items-center bg-white/[0.02] border-l border-white/5 z-20">
                 <div className="flex items-center gap-2">
                   <Trophy size={16} className="text-primary" />
                   <span className="text-[11px] font-black text-slate-300 uppercase">النخبة</span>
                 </div>
               </div>

               <div className="flex-grow relative h-full flex items-center overflow-hidden">
                 <motion.div 
                   animate={{ x: ["0%", "-50%"] }}
                   transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                   className="flex items-center gap-10 whitespace-nowrap px-6"
                 >
                   {[...topRankings, ...topRankings].length > 0 ? [...topRankings, ...topRankings].map((player, idx) => (
                     <div key={`marquee-rank-${player.id}-${idx}`} className="flex items-center gap-4">
                        <span className="text-[10px] font-black w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                          {player.rank}
                        </span>
                        <span className="text-[11px] font-black text-white">{player.playerName}</span>
                        <span className="text-[9px] font-black text-primary/50 uppercase italic">{player.stats || "Pro"}</span>
                        <span className="text-white/5 font-black text-lg">/</span>
                     </div>
                   )) : (
                     <div className="flex gap-4">
                        <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                     </div>
                   )}
                 </motion.div>
               </div>
               
               <div className="flex items-center px-2 bg-white/[0.02] z-20">
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleSync(); }}
                   disabled={isSyncing}
                   className="p-2 text-slate-500 hover:text-primary transition-all rounded-lg"
                 >
                   <RefreshCcw size={14} className={isSyncing ? "animate-spin text-primary" : ""} />
                 </button>
               </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute -top-10 right-0 flex items-center gap-2 opacity-0 group-hover/master:opacity-100 transition-all duration-300 pointer-events-none group-hover/master:pointer-events-auto">
                <button
                   onClick={handleToggleAds}
                   className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${isAdsEnabled ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary text-black border-primary'}`}
                >
                  {isAdsEnabled ? "إيقاف" : "تفعيل"}
                </button>
                <button
                   onClick={() => setIsAdModalOpen(true)}
                   className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all bg-black/80 text-white border border-white/10"
                >
                  تعديل
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
